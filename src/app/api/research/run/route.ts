import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { insertResearchItem, logActivity } from '@/lib/db';

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// Rotate through different search topics each run
const SEARCH_TOPICS = [
  { query: 'AI education K-12 schools 2026', category: 'ai_education' },
  { query: 'edtech artificial intelligence classroom tools', category: 'ai_education' },
  { query: 'AI literacy curriculum schools', category: 'ai_education' },
  { query: 'edtech startup funding education technology', category: 'competitors' },
  { query: 'school district AI policy adoption', category: 'market_opportunity' },
  { query: 'artificial intelligence new models capabilities 2026', category: 'ai_trends' },
  { query: 'education technology grants schools RFP', category: 'market_opportunity' },
  { query: 'AI tutoring personalized learning K12', category: 'competitors' },
  { query: 'prompt engineering education students', category: 'ai_education' },
  { query: 'AI ethics education critical thinking', category: 'ai_education' },
];

async function fetchGoogleNews(query: string): Promise<{ title: string; link: string; source: string; pubDate: string }[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'NGL-Research/1.0' }, next: { revalidate: 0 } });
    const xml = await resp.text();

    const items: { title: string; link: string; source: string; pubDate: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const block = match[1];
      const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
      const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
      if (title) items.push({ title, link, source, pubDate });
    }
    return items;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  // Vercel Cron calls GET with Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return runResearch();
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { isAuthenticated } = await import('@/lib/auth');
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return runResearch();
}

async function runResearch() {
  // Pick 2 random topics and fetch in parallel
  const shuffled = [...SEARCH_TOPICS].sort(() => Math.random() - 0.5);
  const topics = shuffled.slice(0, 2);

  const results = await Promise.all(topics.map(t => fetchGoogleNews(t.query).then(articles => articles.map(a => ({ ...a, query_category: t.category })))));
  let allArticles = results.flat();

  if (allArticles.length === 0) {
    return NextResponse.json({ ok: true, items: 0, message: 'No articles found', topics: topics.map(t => t.query) });
  }

  // Deduplicate by title
  const seen = new Set<string>();
  allArticles = allArticles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Use Claude to analyze and extract insights
  const articleList = allArticles.slice(0, 8).map((a, i) =>
    `${i + 1}. [${a.query_category}] "${a.title}" — ${a.source} (${a.pubDate})\n   URL: ${a.link}`
  ).join('\n');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a research analyst for Next Generation Learners (NGL), an AI literacy education company teaching K-12 students to think critically with AI. Based in Boca Raton, FL, founded by Ryan Vincent.

Analyze these articles and extract valuable insights for NGL:

${articleList}

For each RELEVANT article, return a JSON array with objects containing:
- "category": "ai_education" | "competitors" | "ai_trends" | "market_opportunity"
- "title": concise rewritten headline useful for Ryan
- "summary": 2-3 sentences on what it means for NGL
- "source_url": the URL
- "source_name": publication name
- "relevance": one sentence on why it matters to NGL
- "action_item": specific action Ryan could take

Skip irrelevant articles. Quality over quantity. Return ONLY a valid JSON array.`
      }]
    });

    const output = message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = output.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ ok: true, items: 0, message: 'No relevant insights found', debug: { articleCount: allArticles.length, rawOutput: output.slice(0, 500) } });
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
        person: 'research-agent',
        action: 'found insights',
        resource_type: 'research',
        resource_name: `${saved} new items`,
        details: topics.map(t => t.category).join(', '),
      });
    }

    return NextResponse.json({ ok: true, items: saved, topics: topics.map(t => t.query), articleCount: allArticles.length, rawInsights: insights.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
