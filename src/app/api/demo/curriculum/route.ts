import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const grade = formData.get('grade')?.toString() || '';
  const subject = formData.get('subject')?.toString() || '';
  const standard = formData.get('standard')?.toString() || '';
  const pog_attribute = formData.get('pog_attribute')?.toString() || '';
  const language_function = formData.get('language_function')?.toString() || '';
  const las_level = formData.get('las_level')?.toString() || '';
  const pdfFile = formData.get('pdf');

  if (!grade) return NextResponse.json({ error: 'Grade is required' }, { status: 400 });
  if (!subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
  if (!standard) return NextResponse.json({ error: 'Content standard or learning target is required' }, { status: 400 });
  if (!pog_attribute) return NextResponse.json({ error: 'Portrait of the Graduate attribute is required' }, { status: 400 });
  if (!language_function) return NextResponse.json({ error: 'Language function is required' }, { status: 400 });
  if (!las_level) return NextResponse.json({ error: 'LAS Links level is required' }, { status: 400 });

  let pdfBase64: string | null = null;
  let pdfName = '';
  if (pdfFile && pdfFile instanceof File && pdfFile.size > 0) {
    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }
    if (pdfFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF must be under 25 MB' }, { status: 400 });
    }
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    pdfBase64 = buffer.toString('base64');
    pdfName = pdfFile.name;
  }

  const prompt = `You are an instructional designer building curriculum unit starters for K-12 districts that weave together Common Core State Standards (CCSS), Portrait of the Graduate attributes, and Constructing Meaning language functions for multilingual learners.

Your output gives a curriculum administrator something they can hand to teachers as a real first draft so teacher hours go to customization rather than scaffolding from scratch.

ANCHOR: COMMON CORE STATE STANDARDS

Treat the Common Core State Standards as authoritative. If the content standard provided is a CCSS code (for example 5.NF.B.4, RL.4.1, MP.3), stay faithful to the exact language and rigor of that standard. Do not paraphrase down. The unit must let students perform what the standard says they should be able to perform, at the grade-level cognitive demand the standard requires.

${pdfBase64 ? `YEAR-LONG CURRICULUM CONTEXT

The district's year-long curriculum is attached as a PDF (filename: ${pdfName}). Before writing the unit:
1. Read the attached PDF.
2. Locate where this specific standard sits in the year-long arc.
3. Identify what students have already learned in prior units and what they will need to be ready for in subsequent units.
4. Make the unit starter consistent with the trajectory, vocabulary, models, and routines already established in the year-long curriculum.
5. If the attached PDF references CCSS, treat its alignment as authoritative for sequencing.

` : ''}INPUTS

Grade: ${grade}
Subject: ${subject}
Content standard or learning target: ${standard}
Portrait of the Graduate attribute to actualize: ${pog_attribute}
Language function to embed (Constructing Meaning): ${language_function}
Multilingual learner LAS Links proficiency level to scaffold for: ${las_level}

OUTPUT FORMAT (return as markdown)

# 1-Week Unit Starter

## Unit Overview
2 to 3 sentences describing what students will know and be able to do by the end of the week.${pdfBase64 ? ' Reference where this unit sits in the year-long arc (the unit immediately before and after, if visible in the attached PDF).' : ''}

## Standard Alignment
Restate the standard in plain language. Explain in 2 to 3 sentences what mastery looks like at this grade level under CCSS. If the standard provided maps to a specific CCSS code, name the code explicitly.

## Portrait of the Graduate: ${pog_attribute}
How does this unit make students into a ${pog_attribute}? Give 3 specific student experiences embedded during the week. Each experience should describe an observable student behavior. Avoid abstract adjectives.

## Language Function in Action: ${language_function}
Students will perform the function "${language_function}" repeatedly during this unit.
- 3 sentence frames calibrated to LAS Links ${las_level}
- 2 exemplar student responses at LAS Links ${las_level} using those frames
- The cognitive demand this targets (Bloom's level and why it matches the CCSS rigor)

## 5-Day Unit Flow
For Day 1 through Day 5, provide:
- **Focus**: one sentence
- **Key Activity**: 1 to 2 sentences with a concrete activity
- **Language Function Moment**: the specific point in the day students perform "${language_function}" out loud or in writing
- **LAS Links ${las_level} Scaffold**: a specific support for multilingual learners at this proficiency level

## Multilingual Learner Scaffolds (Across the Week)
- Vocabulary pre-teach list of 6 to 8 academic and content terms with student-friendly definitions
- One visual or graphic organizer to use across all 5 days, described concretely enough that a teacher could sketch it
- Partner or grouping suggestion that supports language acquisition

## Formative Assessment
A short end-of-week task where students demonstrate the standard by performing "${language_function}". Include:
- The prompt students see
- An exemplar response at LAS Links ${las_level}
- What the teacher is looking for (3 success criteria tied to the CCSS rigor)

## In-Time Acceleration Note
Name the most likely prerequisite gap students arriving at this standard might have. Reference the prior CCSS standard this builds on if you can identify it. Give a 10-minute Day 1 mini-task that backfills the gap without slowing the week.

CONSTRAINTS

- Be specific. Generic curriculum-speak weakens this. Name actual activities, frames, and examples.
- Never water down the CCSS standard. Scaffolds are about access at grade level.
- The ${pog_attribute} attribute should show up as student behaviors that an observer could watch happen.
- Do not use em dashes. Use periods or regular dashes.
- Do not use the "X, not Y" comma construction in a single sentence. Use two sentences or rewrite.`;

  type ContentBlock =
    | { type: 'text'; text: string }
    | {
        type: 'document';
        source: { type: 'base64'; media_type: 'application/pdf'; data: string };
      };

  const content: ContentBlock[] = [];
  if (pdfBase64) {
    content.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
    });
  }
  content.push({ type: 'text', text: prompt });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content }],
    });

    const generatedOutput = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ generated_output: generatedOutput, prompt_used: prompt });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 });
  }
}
