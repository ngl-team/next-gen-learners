import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthenticated } from '@/lib/auth';
import { getClassroom, insertToolOutput } from '@/lib/db';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const data = await req.json();
  const { classroom_id, student_name, assignment_description, student_work_description, strengths, areas_for_growth, tone } = data;

  if (!assignment_description) return NextResponse.json({ error: 'Assignment description is required' }, { status: 400 });
  if (!student_work_description) return NextResponse.json({ error: 'Description of student work is required' }, { status: 400 });

  const classroom = await getClassroom(Number(classroom_id));

  const prompt = `You are an experienced K-12 teacher who writes thoughtful, growth-focused feedback on student work. Your feedback is specific, encouraging, and actionable.

${classroom ? `CLASSROOM CONTEXT:
- Grade: ${classroom.grade}
- Subject: ${classroom.subject}
- Special notes: ${classroom.special_notes || 'None'}` : ''}

STUDENT: ${student_name || 'Student'}

ASSIGNMENT: ${assignment_description}

DESCRIPTION OF STUDENT'S WORK: ${student_work_description}

${strengths ? `STRENGTHS THE TEACHER NOTICED: ${strengths}` : ''}
${areas_for_growth ? `AREAS FOR GROWTH THE TEACHER NOTICED: ${areas_for_growth}` : ''}

TONE: ${tone || 'Warm, encouraging, and specific — like a teacher who genuinely cares about this student\'s growth'}

Write feedback that includes:

1. **Opening** — Start with something specific the student did well. Name the exact thing, not just "good job."

2. **Strengths** (2-3 specific points)
   - What did the student do effectively?
   - What skills or understanding did they demonstrate?
   - Be precise — quote or reference specific parts of their work

3. **Areas for Growth** (1-2 specific points)
   - Frame as "next steps" not "mistakes"
   - Be specific about what to improve and HOW to improve it
   - Give a concrete strategy or example they can try

4. **Closing** — End with encouragement that connects to their growth, not just praise

GUIDELINES:
- Write in second person ("You did..." not "The student did...")
- Be specific — vague feedback like "great work" or "needs improvement" is useless
- Balance honesty with encouragement — students need to know what to fix
- Make feedback actionable — every critique should come with a strategy
- Match the language to the grade level
- Keep it to 150-250 words — long enough to be useful, short enough to be read`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedOutput = message.content[0].type === 'text' ? message.content[0].text : '';

    const id = await insertToolOutput({
      classroom_id: classroom_id ? Number(classroom_id) : 0,
      tool: 'student-feedback',
      input_data: JSON.stringify({ student_name, assignment_description, student_work_description, strengths, areas_for_growth, tone }),
      generated_output: generatedOutput,
    });

    return NextResponse.json({ id: Number(id), generated_output: generatedOutput });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 });
  }
}
