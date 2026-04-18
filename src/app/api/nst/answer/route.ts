import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, getClass } from '@/lib/nst';

export async function POST(req: NextRequest) {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });
  const { question_id, class_key, answer, mode = 'study' } = await req.json();
  const cls = getClass(class_key);
  if (!cls) return NextResponse.json({ error: 'class not found' }, { status: 404 });
  const question = cls.questions.find((q) => q.id === question_id);
  if (!question) return NextResponse.json({ error: 'question not found' }, { status: 404 });

  let correct: boolean | null = null;
  let feedback: Record<string, unknown> | null = null;
  if (question.type === 'mc') {
    const picked = Number(answer);
    correct = Number.isFinite(picked) && picked === question.answer;
    feedback = {
      correct_index: question.answer,
      correct_text: question.choices?.[question.answer ?? 0] ?? '',
    };
  } else {
    feedback = { rubric: question.rubric || '' };
  }

  await initDb();
  await db.execute({
    sql: `INSERT INTO nst_answers (user_id, question_id, class_key, answer, correct, mode, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(user_id, question_id, mode) DO UPDATE SET
            answer = excluded.answer,
            correct = excluded.correct,
            updated_at = excluded.updated_at`,
    args: [
      user.id,
      question_id,
      class_key,
      String(answer ?? ''),
      correct === null ? null : correct ? 1 : 0,
      mode,
    ],
  });

  return NextResponse.json({ ok: true, correct, feedback });
}
