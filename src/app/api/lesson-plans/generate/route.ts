import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthenticated } from '@/lib/auth';
import { getClassroom, insertLessonPlan } from '@/lib/db';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const data = await req.json();
  const { classroom_id, topic, objectives, additional_notes } = data;

  if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  if (!classroom_id) return NextResponse.json({ error: 'Classroom is required' }, { status: 400 });

  const classroom = await getClassroom(Number(classroom_id));
  if (!classroom) return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });

  const prompt = `You are an expert K-12 curriculum designer. Create a detailed, ready-to-use lesson plan for a teacher.

CLASSROOM CONTEXT:
- Classroom: ${classroom.name}
- Grade: ${classroom.grade}
- Subject: ${classroom.subject}
- Class size: ${classroom.class_size} students
- Special notes about this class: ${classroom.special_notes || 'None provided'}

LESSON REQUEST:
- Topic: ${topic}
- Learning objectives: ${objectives || 'Teacher wants you to suggest appropriate objectives'}
- Additional notes from teacher: ${additional_notes || 'None'}

Create a lesson plan with these sections:

1. **Lesson Title** — engaging and clear
2. **Grade & Subject**
3. **Duration** — suggest appropriate length
4. **Learning Objectives** — 2-4 specific, measurable objectives
5. **Materials Needed** — be specific and practical
6. **Lesson Outline**
   - Opening / Hook (with timing)
   - Direct Instruction (with timing)
   - Guided Practice (with timing)
   - Independent Practice (with timing)
   - Closing / Assessment (with timing)
7. **Differentiation**
   - For struggling learners
   - For advanced learners
   - For ELL students
8. **Assessment** — how to check understanding
9. **Extension Activities** — optional follow-up for next class

IMPORTANT GUIDELINES:
- Make it practical and immediately usable — a teacher should be able to print this and teach from it tomorrow
- Use age-appropriate language and activities for the grade level
- Include specific questions the teacher can ask
- Include specific examples and activities, not vague suggestions
- Follow the principle: "Your thinking comes first, AI supports second" — the plan should empower the teacher, not replace their judgment`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedPlan = message.content[0].type === 'text' ? message.content[0].text : '';

    const id = await insertLessonPlan({
      classroom_id: Number(classroom_id),
      topic,
      objectives: objectives || '',
      additional_notes: additional_notes || '',
      generated_plan: generatedPlan,
    });

    return NextResponse.json({ id: Number(id), generated_plan: generatedPlan });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate lesson plan: ${errorMessage}` }, { status: 500 });
  }
}
