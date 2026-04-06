import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthenticated } from '@/lib/auth';
import { getClassroom, insertToolOutput } from '@/lib/db';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const data = await req.json();
  const { classroom_id, lesson_topic, lesson_content, focus_areas } = data;

  if (!lesson_topic) return NextResponse.json({ error: 'Lesson topic is required' }, { status: 400 });
  if (!classroom_id) return NextResponse.json({ error: 'Classroom is required' }, { status: 400 });

  const classroom = await getClassroom(Number(classroom_id));
  if (!classroom) return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });

  const prompt = `You are an expert in differentiated instruction for K-12 classrooms. Adapt the following lesson for diverse learners.

CLASSROOM CONTEXT:
- Classroom: ${classroom.name}
- Grade: ${classroom.grade}
- Subject: ${classroom.subject}
- Class size: ${classroom.class_size} students
- Special notes about this class: ${classroom.special_notes || 'None provided'}

LESSON TO DIFFERENTIATE:
- Topic: ${lesson_topic}
- Lesson content/plan: ${lesson_content || 'Not provided — create differentiation strategies based on the topic alone'}
- Areas to focus on: ${focus_areas || 'All areas — ELL, advanced, and IEP students'}

Create a comprehensive differentiation guide with these sections:

1. **Lesson Overview** — brief summary of the original lesson and its objectives

2. **For Struggling Learners**
   - Modified objectives (what success looks like for these students)
   - Scaffolding strategies (graphic organizers, sentence starters, word banks)
   - Modified activities and assignments
   - Assessment accommodations

3. **For ELL Students**
   - Language supports (visual aids, bilingual resources, simplified instructions)
   - Vocabulary pre-teaching list
   - Modified activities that reduce language barriers while maintaining rigor
   - Ways to check understanding beyond written responses

4. **For Students on IEPs**
   - Common accommodation strategies for this type of lesson
   - Modified pacing suggestions
   - Alternative ways to demonstrate understanding
   - Sensory and attention considerations

5. **For Advanced/Gifted Learners**
   - Extension activities that go deeper, not just more work
   - Higher-order thinking challenges
   - Independent or leadership opportunities
   - Connections to real-world applications

6. **Flexible Grouping Suggestions**
   - How to group students for this lesson
   - Station rotation ideas if applicable

7. **Quick Reference Chart** — a simple table showing: learner type | key modification | assessment method

GUIDELINES:
- Be specific and practical — a teacher should be able to use this immediately
- Don't water down content for struggling learners — scaffold access to grade-level material
- For advanced learners, increase depth and complexity, not volume
- Include specific examples, not vague suggestions`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedOutput = message.content[0].type === 'text' ? message.content[0].text : '';

    const id = await insertToolOutput({
      classroom_id: Number(classroom_id),
      tool: 'differentiate',
      input_data: JSON.stringify({ lesson_topic, lesson_content, focus_areas }),
      generated_output: generatedOutput,
    });

    return NextResponse.json({ id: Number(id), generated_output: generatedOutput });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 });
  }
}
