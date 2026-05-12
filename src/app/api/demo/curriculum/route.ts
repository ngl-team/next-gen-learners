import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { grade, subject, standard, pog_attribute, language_function, wida_level } = data;

  if (!grade) return NextResponse.json({ error: 'Grade is required' }, { status: 400 });
  if (!subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
  if (!standard) return NextResponse.json({ error: 'Content standard or learning target is required' }, { status: 400 });
  if (!pog_attribute) return NextResponse.json({ error: 'Portrait of the Graduate attribute is required' }, { status: 400 });
  if (!language_function) return NextResponse.json({ error: 'Language function is required' }, { status: 400 });
  if (!wida_level) return NextResponse.json({ error: 'WIDA level is required' }, { status: 400 });

  const prompt = `You are an instructional designer building curriculum unit starters for K-12 districts that have to weave together state content standards, Portrait of the Graduate attributes, and Constructing Meaning language functions for multilingual learners.

Your output gives a curriculum administrator something they can hand to teachers as a real first draft so teacher hours go to customization rather than scaffolding from scratch.

INPUTS

Grade: ${grade}
Subject: ${subject}
Content standard or learning target: ${standard}
Portrait of the Graduate attribute to actualize: ${pog_attribute}
Language function to embed (Constructing Meaning): ${language_function}
Multilingual learner WIDA proficiency level to scaffold for: ${wida_level}

OUTPUT FORMAT (return as markdown)

# 1-Week Unit Starter

## Unit Overview
2 to 3 sentences describing what students will know and be able to do by the end of the week.

## Standard Alignment
Restate the standard or learning target in plain language. Explain in 2 to 3 sentences what mastery looks like in this grade and subject.

## Portrait of the Graduate: ${pog_attribute}
How does this unit make students into a ${pog_attribute}? Give 3 specific student experiences embedded during the week. Each experience should describe an observable student behavior. Avoid abstract adjectives.

## Language Function in Action: ${language_function}
Students will perform the function "${language_function}" repeatedly during this unit.
- 3 sentence frames calibrated to WIDA ${wida_level}
- 2 exemplar student responses at WIDA ${wida_level} using those frames
- The cognitive demand this targets (Bloom's level and why it matches)

## 5-Day Unit Flow
For Day 1 through Day 5, provide:
- **Focus**: one sentence
- **Key Activity**: 1 to 2 sentences with a concrete activity
- **Language Function Moment**: the specific point in the day students perform "${language_function}" out loud or in writing
- **WIDA ${wida_level} Scaffold**: a specific support for multilingual learners at this level

## Multilingual Learner Scaffolds (Across the Week)
- Vocabulary pre-teach list of 6 to 8 academic and content terms with student-friendly definitions
- One visual or graphic organizer to use across all 5 days, described concretely enough that a teacher could sketch it
- Partner or grouping suggestion that supports language acquisition

## Formative Assessment
A short end-of-week task where students demonstrate the standard by performing "${language_function}". Include:
- The prompt students see
- An exemplar response at WIDA ${wida_level}
- What the teacher is looking for (3 success criteria)

## In-Time Acceleration Note
Name the most likely prerequisite gap students arriving at this standard might have. Give a 10-minute Day 1 mini-task that backfills it without slowing the week.

CONSTRAINTS

- Be specific. Generic curriculum-speak weakens this. Name actual activities, frames, and examples.
- Never water down the standard. Scaffolds are about access at grade level.
- The ${pog_attribute} attribute should show up as student behaviors that an observer could watch happen.
- Do not use em dashes. Use periods or regular dashes.
- Do not use the "X, not Y" comma construction in a single sentence. Use two sentences or rewrite.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedOutput = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ generated_output: generatedOutput });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 });
  }
}
