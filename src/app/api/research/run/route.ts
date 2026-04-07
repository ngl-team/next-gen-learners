import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { insertResearchItem, logActivity } from '@/lib/db';

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// ── Source Feeds ────────────────────────────────────────────────────
// Direct RSS from education-specific publications (high quality)
const DIRECT_FEEDS = [
  { url: 'https://www.edsurge.com/rss', source: 'EdSurge', category: 'ai_education' },
  { url: 'https://www.k12dive.com/feeds/topic/technology/', source: 'K-12 Dive', category: 'ai_education' },
  { url: 'https://thejournal.com/rss-feeds/all-articles.aspx', source: 'THE Journal', category: 'ai_education' },
];

// Google News searches (broader coverage, more noise)
const GOOGLE_NEWS_QUERIES = [
  { query: 'AI education K-12 schools', category: 'ai_education' },
  { query: 'AI literacy curriculum K12', category: 'ai_education' },
  { query: 'edtech startup funding education', category: 'competitors' },
  { query: 'school district AI policy adoption', category: 'market_opportunity' },
  { query: 'education technology grants RFP schools', category: 'market_opportunity' },
  { query: 'AI tutoring personalized learning K12', category: 'competitors' },
  { query: '"Magic School" OR "Khanmigo" OR "SchoolAI" OR "Synthesis AI" education', category: 'competitors' },
  { query: 'AI ethics education critical thinking K-12', category: 'ai_education' },
];

type Article = { title: string; link: string; source: string; pubDate: string; query_category: string };

// ── RSS Parser ──────────────────────────────────────────────────────
function parseRssItems(xml: string, maxItems = 8): { title: string; link: string; source: string; pubDate: string }[] {
  const items: { title: string; link: string; source: string; pubDate: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < maxItems) {
    const block = match[1];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
    const link = block.match(/<link\s*\/?>([\s\S]*?)<\/link>/)?.[1]?.trim()
      || block.match(/<link[^>]*href="([^"]+)"/)?.[1]?.trim() || '';
    const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
      || block.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
    if (title) items.push({ title, link, source, pubDate });
  }
  return items;
}

async function fetchRss(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'NGL-Research/1.0' },
    next: { revalidate: 0 },
  });
  return resp.text();
}

// ── Fetch from direct RSS feeds ─────────────────────────────────────
async function fetchDirectFeed(feed: typeof DIRECT_FEEDS[0]): Promise<Article[]> {
  try {
    const xml = await fetchRss(feed.url);
    const items = parseRssItems(xml, 6);
    return items.map(a => ({ ...a, source: a.source || feed.source, query_category: feed.category }));
  } catch {
    return [];
  }
}

// ── Fetch from Google News ──────────────────────────────────────────
async function fetchGoogleNews(query: string, category: string): Promise<Article[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const xml = await fetchRss(url);
    const items = parseRssItems(xml, 5);
    return items.map(a => ({ ...a, query_category: category }));
  } catch {
    return [];
  }
}

// ── Routes ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return runResearch();
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { isAuthenticated } = await import('@/lib/auth');
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  let actor = 'ryan';
  try { const body = await req.json(); actor = body._actor || 'ryan'; } catch {}
  return runResearch(actor);
}

// ── Main Research Logic ─────────────────────────────────────────────
async function runResearch(triggeredBy = 'cron') {
  // Fetch ALL direct feeds + 2 random Google News queries in parallel
  const shuffled = [...GOOGLE_NEWS_QUERIES].sort(() => Math.random() - 0.5);
  const googleTopics = shuffled.slice(0, 2);

  const fetches: Promise<Article[]>[] = [
    ...DIRECT_FEEDS.map(f => fetchDirectFeed(f)),
    ...googleTopics.map(t => fetchGoogleNews(t.query, t.category)),
  ];

  const results = await Promise.all(fetches);
  let allArticles = results.flat();

  const sourceBreakdown = {
    direct: results.slice(0, DIRECT_FEEDS.length).reduce((n, r) => n + r.length, 0),
    google: results.slice(DIRECT_FEEDS.length).reduce((n, r) => n + r.length, 0),
  };

  if (allArticles.length === 0) {
    return NextResponse.json({ ok: true, items: 0, message: 'No articles found', sources: sourceBreakdown });
  }

  // Deduplicate by title
  const seen = new Set<string>();
  allArticles = allArticles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Build article list for Claude — prioritize direct feeds (higher quality)
  const directArticles = allArticles.filter(a =>
    DIRECT_FEEDS.some(f => a.source === f.source || a.source === '')
  );
  const googleArticles = allArticles.filter(a =>
    !DIRECT_FEEDS.some(f => a.source === f.source)
  );
  const prioritized = [...directArticles, ...googleArticles].slice(0, 12);

  const articleList = prioritized.map((a, i) =>
    `${i + 1}. [${a.query_category}] "${a.title}" — ${a.source} (${a.pubDate})\n   URL: ${a.link}`
  ).join('\n');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a research analyst for Next Generation Learners (NGL). NGL teaches K-12 students AI literacy — prompt engineering, output verification, critical thinking with AI, and ethical reasoning. Based in Boca Raton, FL, founded by Ryan Vincent. NGL sells programs directly to schools, libraries, and districts.

These articles come from EdSurge, K-12 Dive, THE Journal, and Google News:

${articleList}

ONLY include an article if it meets at least ONE of these criteria:
- A school district, library, or state is adopting AI education programs (potential customer)
- A competitor is launching something NGL should know about (Khanmigo, Magic School AI, SchoolAI, Synthesis)
- There's a grant, RFP, or funding opportunity NGL could apply for
- A new AI policy or regulation directly affects K-12 AI education
- A specific trend Ryan should act on NOW (not general AI hype)

DO NOT include:
- General AI news that doesn't connect to K-12 education sales
- Vague "AI is changing education" think pieces
- University/college-level AI news (NGL is K-12 only)
- Big tech product launches unless they directly compete with NGL

For each article that passes the filter, return a JSON array:
[{"category":"ai_education|competitors|ai_trends|market_opportunity","title":"rewritten headline","summary":"2-3 sentences on what this means for NGL","source_url":"URL","source_name":"publication","relevance":"why Ryan needs to know this","action_item":"specific next step Ryan should take"}]

If ZERO articles are worth Ryan's time, return an empty array: []
Return ONLY valid JSON, no other text.`
      }]
    });

    const output = message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = output.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ ok: true, items: 0, message: 'No relevant insights found', sources: sourceBreakdown, articleCount: allArticles.length });
    }

    const insights = JSON.parse(jsonMatch[0]);
    let saved = 0;

    for (const item of insights) {
      await insertResearchItem({
        category: item.category || 'ai_trends',
        title: item.title || '',
        summary: item.summary || '',
        source_url: item.source_url || '',
        source_name: item.source_name || '',
        relevance: item.relevance || '',
        action_item: item.action_item || '',
      });
      saved++;
    }

    if (saved > 0) {
      await logActivity({
        person: triggeredBy,
        action: 'ran research',
        resource_type: 'research',
        resource_name: `${saved} new insights`,
        details: `Sources: ${sourceBreakdown.direct} from EdSurge/K12Dive/THEJournal, ${sourceBreakdown.google} from Google News`,
      });
    }

    return NextResponse.json({
      ok: true,
      items: saved,
      sources: sourceBreakdown,
      articleCount: allArticles.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
