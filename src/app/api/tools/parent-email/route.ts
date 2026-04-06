import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthenticated } from '@/lib/auth';
import { getClassroom, insertToolOutput } from '@/lib/db';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const data = await req.json();
  const { classroom_id, parent_name, student_name, situation, email_purpose, tone, additional_context } = data;

  if (!situation) return NextResponse.json({ error: 'Situation description is required' }, { status: 400 });
  if (!email_purpose) return NextResponse.json({ error: 'Email purpose is required' }, { status: 400 });

  const classroom = await getClassroom(Number(classroom_id));

  const prompt = `You are an experienced K-12 teacher who writes professional, empathetic parent communications. You know how to address sensitive topics while maintaining a positive partnership with families.

${classroom ? `CLASSROOM CONTEXT:
- Grade: ${classroom.grade}
- Subject: ${classroom.subject}` : ''}

PARENT NAME: ${parent_name || 'Parent/Guardian'}
STUDENT NAME: ${student_name || 'their child'}

SITUATION: ${situation}

PURPOSE OF THIS EMAIL: ${email_purpose}

TONE: ${tone || 'Professional, warm, and collaborative — like a teacher who is on the same team as the parent'}

${additional_context ? `ADDITIONAL CONTEXT: ${additional_context}` : ''}

Write a professional parent email that includes:

1. **Subject Line** — clear and non-alarming

2. **Greeting** — address the parent by name

3. **Opening** — start with something positive about the student (even if the email is about a concern)

4. **Main Content**
   - Clearly explain the situation or purpose
   - Be factual and specific — avoid vague language
   - If addressing a concern, frame it as something you want to work on together
   - If sharing good news, be specific about what the student did

5. **Action Items / Next Steps**
   - What do you need from the parent? (meeting, signature, support at home)
   - What are you doing on your end?
   - Suggest specific times or options if scheduling

6. **Closing** — reinforce the partnership, thank them for their time

GUIDELINES:
- Keep it under 300 words — parents skim emails
- Never blame the student or parent
- Use "I've noticed" not "Your child has a problem"
- Frame concerns as shared goals: "I want to make sure [student] succeeds, and I think we can work together on..."
- If it's a positive email, make it genuinely warm — parents love hearing good things
- Include your sign-off with name and title
- Make it ready to send — the teacher should only need to review and hit send`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedOutput = message.content[0].type === 'text' ? message.content[0].text : '';

    const id = await insertToolOutput({
      classroom_id: classroom_id ? Number(classroom_id) : 0,
      tool: 'parent-email',
      input_data: JSON.stringify({ parent_name, student_name, situation, email_purpose, tone, additional_context }),
      generated_output: generatedOutput,
    });

    return NextResponse.json({ id: Number(id), generated_output: generatedOutput });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 });
  }
}
