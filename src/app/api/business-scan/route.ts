import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  const { isAuthenticated } = await import('@/lib/auth');
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { name, url, industry, notes } = await req.json();
  if (!name) return NextResponse.json({ error: 'Business name is required' }, { status: 400 });

  let websiteContent = '';

  // Try to fetch and extract text from their website
  if (url) {
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NGL-Scanner/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (resp.ok) {
        const html = await resp.text();
        // Extract visible text — strip tags, scripts, styles
        websiteContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 8000); // Limit to avoid token overflow
      }
    } catch {
      websiteContent = '(Could not fetch website)';
    }
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `You are an AI business consultant for Next Generation Learners (NGL), a company that builds custom AI-powered software solutions for businesses. NGL analyzes a business, identifies where AI and automation can save time, increase revenue, or reduce costs, and then builds custom software to solve those problems.

BUSINESS TO ANALYZE:
Name: ${name}
${url ? `Website: ${url}` : ''}
${industry ? `Industry: ${industry}` : ''}
${notes ? `Additional context: ${notes}` : ''}

${websiteContent ? `WEBSITE CONTENT (extracted text):\n${websiteContent}\n` : ''}

Based on everything you can gather, provide a thorough business analysis in this exact JSON format:

{
  "business_summary": "2-3 sentences about what this business does and who they serve",
  "industry": "their industry category",
  "current_pain_points": [
    {"problem": "specific problem they likely face", "impact": "how it hurts their business (time, money, customers)"}
  ],
  "ai_opportunities": [
    {
      "solution": "what to build",
      "description": "2-3 sentences on what it does",
      "impact": "estimated business impact (e.g., save 10hrs/week, increase leads by 30%)",
      "complexity": "simple|medium|complex",
      "priority": "high|medium|low"
    }
  ],
  "proposal_pitch": "A 3-4 sentence pitch you could send this business owner explaining why they should talk to you. Written in a warm, direct tone — not salesy. Reference their specific business.",
  "estimated_value": "rough estimate of annual value this could bring them (saved time, revenue increase, cost reduction)",
  "next_step": "the specific first action to take to reach out to this business"
}

Be SPECIFIC to this business — no generic advice. Focus on 3-5 high-impact opportunities. Think about what would actually make them money or save them serious time. Return ONLY valid JSON.`
      }]
    });

    const output = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = output.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ error: 'Analysis failed — could not parse results' }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      ok: true,
      business: name,
      url: url || '',
      analysis,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
