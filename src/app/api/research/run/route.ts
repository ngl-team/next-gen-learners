import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { insertResearchItem, getLatestResearchTime, logActivity } from '@/lib/db';

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

export async function POST(req: NextRequest) {
  // Allow cron calls with a secret, or authenticated users
  const cronSecret = req.nextUrl.searchParams.get('secret');
  const isAuthed = cronSecret === process.env.CRON_SECRET;

  if (!isAuthed) {
    const { isAuthenticated } = await import('@/lib/auth');
    if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Pick 2-3 random topics to research this run
  const shuffled = [...SEARCH_TOPICS].sort(() => Math.random() - 0.5);
  const topics = shuffled.slice(0, 3);

  let allArticles: { title: string; link: string; source: string; pubDate: string; query_category: string }[] = [];

  for (const topic of topics) {
    const articles = await fetchGoogleNews(topic.query);
    allArticles.push(...articles.map(a => ({ ...a, query_category: topic.category })));
  }

  if (allArticles.length === 0) {
    return NextResponse.json({ ok: true, items: 0, message: 'No articles found' });
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
  const articleList = allArticles.slice(0, 10).map((a, i) =>
    `${i + 1}. [${a.query_category}] "${a.title}" — ${a.source} (${a.pubDate})\n   URL: ${a.link}`
  ).join('\n');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `You are a research analyst for Next Generation Learners (NGL), an AI literacy education company that teaches K-12 students to think critically with AI through prompt engineering, output verification, and ethical reasoning. NGL is based in Boca Raton, FL, founded by Ryan Vincent.

Analyze these recent articles and extract the most valuable insights for NGL's business:

${articleList}

For each article that is ACTUALLY relevant to NGL (skip irrelevant ones), return a JSON array of objects with:
- "category": one of "ai_education", "competitors", "ai_trends", "market_opportunity"
- "title": a concise headline (not the original — rewrite it to be useful for Ryan)
- "summary": 2-3 sentences explaining what this means and why it matters to NGL
- "source_url": the article URL
- "source_name": the publication name
- "relevance": one sentence on why this is relevant to NGL specifically
- "action_item": a specific action Ryan could take based on this (e.g., "Reach out to this district", "Add this feature to the toolkit", "Monitor this competitor")

IMPORTANT:
- Only include articles that are genuinely useful for an AI education startup
- Be specific in action items — vague advice is useless
- If fewer than 3 articles are relevant, that's fine — quality over quantity
- Return ONLY valid JSON array, no other text

Example format:
[{"category":"ai_education","title":"...","summary":"...","source_url":"...","source_name":"...","relevance":"...","action_item":"..."}]`
      }]
    });

    const output = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = output.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ ok: true, items: 0, message: 'No relevant insights found' });
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

    return NextResponse.json({ ok: true, items: saved, topics: topics.map(t => t.query) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
