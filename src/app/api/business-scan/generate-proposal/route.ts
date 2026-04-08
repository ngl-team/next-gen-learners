import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { upsertProposal } from '@/lib/db';

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  const { isAuthenticated } = await import('@/lib/auth');
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { name, url, industry, notes, contactName } = await req.json();
  if (!name) return NextResponse.json({ error: 'Business name is required' }, { status: 400 });

  let websiteContent = '';
  if (url) {
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NGL-Scanner/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (resp.ok) {
        const html = await resp.text();
        websiteContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 10000);
      }
    } catch {
      websiteContent = '(Could not fetch website)';
    }
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 6000,
      messages: [{
        role: 'user',
        content: `You are an AI consultant for Next Generation Learners (NGL), founded by Ryan Vincent. NGL builds custom AI-powered software for businesses. You need to generate a FULL proposal page for a business.

BUSINESS TO ANALYZE:
Name: ${name}
${url ? `Website: ${url}` : ''}
${industry ? `Industry: ${industry}` : ''}
${contactName ? `Contact: ${contactName}` : ''}
${notes ? `Notes: ${notes}` : ''}

${websiteContent ? `WEBSITE CONTENT:\n${websiteContent}\n` : ''}

Generate a JSON object with ALL of these sections. Be extremely specific to THIS business — reference their actual products, services, and situation. No generic advice.

{
  "hero_badge": "Built for [contact/business name]",
  "hero_title": "A compelling 3-5 word headline about what you'll do for them",
  "hero_subtitle": "1-2 sentences that hook them — reference their specific situation",
  "free_tools": [
    {
      "color": "accent|primary|warm|cyan|violet|rose",
      "title": "Name of free tool/advice",
      "description": "1-2 sentences intro",
      "bullets": ["specific actionable bullet point with bold lead", "another one", "etc"]
    }
  ],
  "pain_points": [
    {
      "emoji": "relevant emoji",
      "label": "SHORT LABEL",
      "text": "2-3 sentences about this specific pain point for THEIR business"
    }
  ],
  "solutions": [
    {
      "title": "What to build",
      "description": "2-3 sentences on what it does and why it matters for them",
      "complexity": "simple|medium|complex"
    }
  ],
  "before_after": [
    {
      "before": "How they do it now",
      "after": "How it works with your software"
    }
  ],
  "engagement_options": [
    {
      "tier": "Starter|Growth|Full Build",
      "description": "what's included",
      "bullets": ["deliverable 1", "deliverable 2"]
    }
  ],
  "guarantee": "A bold guarantee statement specific to their business",
  "cta_headline": "A compelling call to action headline",
  "cta_text": "1-2 sentences driving them to take action"
}

Make the free_tools section EXTREMELY valuable — like you're giving away the playbook for free. This is what makes the proposal different from a cold pitch. You're leading with value. Include 3-5 free tools.

Include 3-4 pain points, 3-4 solutions, 3-4 before/after comparisons, and 2-3 engagement tiers.

Return ONLY valid JSON.`
      }]
    });

    const output = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
    }

    const proposal = JSON.parse(jsonMatch[0]);

    // Generate the slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // Build the HTML page
    const html = buildProposalHTML(name, url || '', proposal);

    // Save to database
    await upsertProposal({
      slug,
      business_name: name,
      business_url: url || '',
      html,
      proposal_data: JSON.stringify(proposal),
    });

    return NextResponse.json({
      ok: true,
      slug,
      proposal,
      url: `/p/${slug}`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildProposalHTML(businessName: string, businessUrl: string, p: Record<string, unknown>): string {
  const esc = (s: string) => s?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') || '';
  const colorMap: Record<string, { bg: string; fg: string }> = {
    accent: { bg: 'rgba(16,185,129,0.15)', fg: '#10B981' },
    primary: { bg: 'rgba(79,70,229,0.1)', fg: '#4F46E5' },
    warm: { bg: 'rgba(245,158,11,0.12)', fg: '#F59E0B' },
    cyan: { bg: 'rgba(6,182,212,0.12)', fg: '#06B6D4' },
    violet: { bg: 'rgba(124,58,237,0.1)', fg: '#7C3AED' },
    rose: { bg: 'rgba(251,113,133,0.1)', fg: '#FB7185' },
  };
  const painEmojiBgs = ['rgba(251,113,133,0.1)', 'rgba(6,182,212,0.12)', 'rgba(245,158,11,0.12)', 'rgba(124,58,237,0.1)'];

  const freeTools = (p.free_tools as Array<Record<string, unknown>> || []).map((t, i) => {
    const c = colorMap[t.color as string] || colorMap.primary;
    const labels = ['Free Tool', 'Free Strategy', 'Free Framework', 'Free Playbook', 'Free Audit'];
    return `
    <div class="engage-card fade-up">
      <span class="engage-tag" style="background:${c.bg};color:${c.fg}">${labels[i % labels.length]}</span>
      <h4>${esc(t.title as string)}</h4>
      <p>${esc(t.description as string)}</p>
      <ul>${(t.bullets as string[] || []).map(b => `<li>${b}</li>`).join('')}</ul>
    </div>`;
  }).join('');

  const painPoints = (p.pain_points as Array<Record<string, unknown>> || []).map((pp, i) => `
    <div class="problem-card fade-up">
      <div class="pc-icon" style="background:${painEmojiBgs[i % painEmojiBgs.length]}">${esc(pp.emoji as string)}</div>
      <div class="pc-label">${esc(pp.label as string)}</div>
      <div class="pc-text">${esc(pp.text as string)}</div>
    </div>`).join('');

  const solutions = (p.solutions as Array<Record<string, unknown>> || []).map(s => `
    <div class="sol-card fade-up">
      <h4>${esc(s.title as string)}</h4>
      <p>${esc(s.description as string)}</p>
    </div>`).join('');

  const beforeAfter = (p.before_after as Array<Record<string, unknown>> || []).map(ba => `
    <div class="becomes-card fade-up">
      <div class="from">Before</div>
      <div style="font-size:0.82rem;color:var(--text-2);margin-bottom:12px">${esc(ba.before as string)}</div>
      <div class="from" style="color:var(--accent)">After</div>
      <div class="to">${esc(ba.after as string)}</div>
    </div>`).join('');

  const engagements = (p.engagement_options as Array<Record<string, unknown>> || []).map(e => {
    const tierColors: Record<string, string> = { Starter: 'var(--accent-glow)', Growth: 'var(--indigo-glow)', 'Full Build': 'var(--violet-glow)' };
    const tierFg: Record<string, string> = { Starter: 'var(--accent)', Growth: 'var(--primary)', 'Full Build': 'var(--secondary)' };
    return `
    <div class="engage-card fade-up">
      <span class="engage-tag" style="background:${tierColors[e.tier as string] || 'var(--indigo-glow)'};color:${tierFg[e.tier as string] || 'var(--primary)'}">${esc(e.tier as string)}</span>
      <h4>${esc(e.tier as string)}</h4>
      <p>${esc(e.description as string)}</p>
      <ul>${(e.bullets as string[] || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${esc(businessName)} — Next Generation Learners</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="description" content="A development proposal for ${esc(businessName)}. Built by Next Generation Learners."/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#FAFBFF;--surface:#FFFFFF;--surface-2:#F1F5F9;--border:#E2E8F0;--text:#1E1B4B;--text-2:#64748B;--text-3:#94A3B8;--primary:#4F46E5;--secondary:#7C3AED;--accent:#10B981;--accent-glow:rgba(16,185,129,0.15);--warm:#F59E0B;--warm-glow:rgba(245,158,11,0.12);--cyan:#06B6D4;--cyan-glow:rgba(6,182,212,0.12);--indigo-glow:rgba(79,70,229,0.1);--violet-glow:rgba(124,58,237,0.1);--rose:#FB7185;--rose-glow:rgba(251,113,133,0.1);--radius:12px;--radius-lg:20px;--radius-xl:24px}
    html{scroll-behavior:smooth}
    body{font-family:'Plus Jakarta Sans',-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    .container{max-width:820px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
    .section{padding:80px 0}
    nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.8);backdrop-filter:blur(24px);border-bottom:1px solid rgba(79,70,229,0.08);padding:14px 24px}
    nav .inner{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
    .nav-brand{font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--primary);font-weight:700;text-decoration:none}
    .nav-links{display:flex;gap:24px}
    .nav-link{font-size:0.8rem;color:var(--text-2);text-decoration:none;cursor:pointer;font-weight:500}
    .nav-link:hover{color:var(--primary)}
    .hero{position:relative;padding:100px 0 72px;text-align:center;overflow:hidden}
    .hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#4F46E5,#7C3AED,#06B6D4,#10B981,#4F46E5);background-size:400% 400%;z-index:0;border-radius:0 0 40px 40px;animation:gf 15s ease infinite}
    @keyframes gf{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .hero-content{position:relative;z-index:2}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:0.68rem;letter-spacing:0.16em;text-transform:uppercase;color:white;border:1px solid rgba(255,255,255,0.3);padding:8px 20px;border-radius:100px;margin-bottom:32px;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);font-weight:600}
    .hero-badge .pulse{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    .hero h1{font-size:clamp(2.2rem,5vw,3.4rem);font-weight:800;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;color:white}
    .hero-sub{font-size:1.05rem;color:rgba(255,255,255,0.8);max-width:560px;margin:0 auto;line-height:1.75;font-weight:300}
    .sh-label{font-size:0.65rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--primary);margin-bottom:12px;font-weight:700}
    .sh-title{font-size:clamp(1.6rem,3.5vw,2.2rem);font-weight:800;line-height:1.15;letter-spacing:-0.02em;margin-bottom:12px}
    .sh-desc{font-size:0.95rem;color:var(--text-2);max-width:560px;line-height:1.75;margin-bottom:40px}
    .problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .problem-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;transition:all 0.3s}
    .problem-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px -8px rgba(79,70,229,0.12)}
    .problem-card .pc-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:1.2rem}
    .problem-card .pc-label{font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--primary);margin-bottom:8px;font-weight:700}
    .problem-card .pc-text{font-size:0.88rem;color:var(--text-2);line-height:1.65}
    .sol-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:28px;margin-bottom:16px;transition:all 0.3s}
    .sol-card:hover{transform:translateY(-6px);box-shadow:0 20px 40px -12px rgba(79,70,229,0.15)}
    .sol-card h4{font-size:1rem;font-weight:700;margin-bottom:6px}
    .sol-card p{font-size:0.88rem;color:var(--text-2);line-height:1.65}
    .becomes-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .becomes-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;transition:all 0.3s}
    .becomes-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px -8px rgba(79,70,229,0.12)}
    .becomes-card .from{font-size:0.65rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;font-weight:600}
    .becomes-card .to{font-size:0.95rem;font-weight:700}
    .engage-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:32px;margin-bottom:16px;transition:all 0.3s}
    .engage-card:hover{transform:translateY(-4px);box-shadow:0 16px 32px -8px rgba(79,70,229,0.12)}
    .engage-card h4{font-size:1.05rem;font-weight:700;margin-bottom:8px}
    .engage-card p{font-size:0.88rem;color:var(--text-2);line-height:1.65}
    .engage-card ul{font-size:0.88rem;color:var(--text-2);line-height:1.9;padding-left:18px;margin-top:12px}
    .engage-card li::marker{color:var(--primary)}
    .engage-tag{display:inline-block;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;padding:5px 14px;border-radius:100px;font-weight:700;margin-bottom:16px}
    .guarantee{background:var(--indigo-glow);border:1px solid rgba(79,70,229,0.15);border-radius:var(--radius-xl);padding:32px;text-align:center;margin-top:24px}
    .guarantee .g-label{font-size:0.65rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--primary);margin-bottom:12px;font-weight:700}
    .guarantee .g-text{font-size:1.05rem;font-weight:700;line-height:1.6;max-width:520px;margin:0 auto}
    .cta-section{text-align:center;padding:80px 0 100px;position:relative;overflow:hidden}
    .cta-section .cta-bg{position:absolute;inset:0;background:linear-gradient(135deg,#4F46E5,#7C3AED,#06B6D4);border-radius:40px 40px 0 0;z-index:0}
    .cta-section .cta-content{position:relative;z-index:1}
    .cta-section h2{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-bottom:16px;letter-spacing:-0.02em;color:white}
    .cta-section p{font-size:0.92rem;color:rgba(255,255,255,0.75);max-width:460px;margin:0 auto 32px;line-height:1.7;font-weight:300}
    .cta-btn{display:inline-flex;align-items:center;gap:10px;background:white;color:var(--primary);font-weight:700;font-size:0.85rem;padding:14px 32px;border-radius:var(--radius);text-decoration:none;border:none;cursor:pointer;transition:all 0.2s}
    .cta-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.2)}
    footer{background:linear-gradient(135deg,#4F46E5,#7C3AED,#06B6D4);padding:48px 0;text-align:center}
    .footer-brand{font-size:0.8rem;letter-spacing:0.14em;text-transform:uppercase;color:white;font-weight:700;margin-bottom:6px}
    footer p{font-size:0.75rem;color:rgba(255,255,255,0.6);line-height:1.6}
    footer a{color:rgba(255,255,255,0.8);text-decoration:none}
    footer a:hover{color:white}
    .fade-up{opacity:0;transform:translateY(24px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1)}
    .fade-up.visible{opacity:1;transform:translateY(0)}
    @media(max-width:768px){.section{padding:60px 0}.hero{padding:72px 0 56px}.problem-grid,.becomes-grid{grid-template-columns:1fr}.nav-links{display:none}}
  </style>
</head>
<body>

<nav><div class="inner"><a href="/" class="nav-brand">Next Generation Learners</a><div class="nav-links"><a href="#free" class="nav-link">Free Tools</a><a href="#problem" class="nav-link">The Problem</a><a href="#solution" class="nav-link">What We'd Build</a><a href="#engagement" class="nav-link">The Deal</a></div></div></nav>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content container">
    <div class="hero-badge"><span class="pulse"></span>${esc(p.hero_badge as string)}</div>
    <h1>${esc(p.hero_title as string)}</h1>
    <p class="hero-sub">${esc(p.hero_subtitle as string)}</p>
  </div>
</div>

<div class="container">

  <div class="section" id="free">
    <div class="sh-label">Still Deciding?</div>
    <h2 class="sh-title">Even If You Don't Go With Us</h2>
    <p class="sh-desc">Here are things you can do right now for free. No strings. No pitch. Just value you can use today.</p>
    ${freeTools}
    <p style="font-size:0.92rem;color:var(--text-2);line-height:1.75;margin-top:28px;padding:20px 24px;background:var(--indigo-glow);border-radius:var(--radius-lg);border:1px solid rgba(79,70,229,0.15)" class="fade-up">Take all of this and run with it. If you want to hire someone else, hand them this page. If you want to do it yourself, you have the blueprint. And if you decide you want us to build it with you, the proposal is below.</p>
  </div>

  <div class="section" id="problem">
    <div class="sh-label">What We See</div>
    <h2 class="sh-title">Where You're Losing Time and Money</h2>
    <p class="sh-desc">After analyzing your business, here's what's holding you back — and what software can fix.</p>
    <div class="problem-grid">${painPoints}</div>
  </div>

  <div class="section" id="solution">
    <div class="sh-label">What We'd Build</div>
    <h2 class="sh-title">Custom Software for ${esc(businessName)}</h2>
    <p class="sh-desc">Every solution is built specifically for your business. No templates. No cookie-cutter apps.</p>
    ${solutions}
    <div class="becomes-grid" style="margin-top:32px">${beforeAfter}</div>
  </div>

  <div class="section" id="engagement">
    <div class="sh-label">The Deal</div>
    <h2 class="sh-title">How We Work Together</h2>
    <p class="sh-desc">Pick the level that makes sense. Every option includes direct access to our team.</p>
    ${engagements}
    <div class="guarantee">
      <div class="g-label">Our Guarantee</div>
      <div class="g-text">${esc(p.guarantee as string)}</div>
    </div>
  </div>

</div>

<div class="cta-section">
  <div class="cta-bg"></div>
  <div class="cta-content container">
    <h2>${esc(p.cta_headline as string)}</h2>
    <p>${esc(p.cta_text as string)}</p>
    <a href="mailto:contact@nextgenerationlearners.com?subject=Proposal: ${encodeURIComponent(businessName)}" class="cta-btn">Let's Talk →</a>
  </div>
</div>

<footer>
  <div class="container">
    <div class="footer-brand">Next Generation Learners</div>
    <p>Custom AI software for businesses that want to move faster.<br><a href="https://www.nextgenerationlearners.com">nextgenerationlearners.com</a></p>
  </div>
</footer>

<script>
const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
</script>
</body>
</html>`;
}
