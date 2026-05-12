import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

interface AudioMetrics {
  pitch_avg: number;
  pitch_stddev: number;
  volume_rms: number;
  duration_sec: number;
}

interface VideoMetrics {
  motion_avg: number;
  motion_stddev: number;
  motion_active_pct: number;
  frame_samples: number;
}

interface TeacherContext {
  grade_level?: string;
  subject?: string;
  lesson_focus?: string;
  lesson_plan_text?: string;
}

interface AnalyzeRequest {
  transcript: string;
  questions: string[];
  audio_metrics: AudioMetrics;
  video_metrics?: VideoMetrics | null;
  video_enabled: boolean;
  teacher_context?: TeacherContext;
  lesson_plan_pdf?: { name: string; data: string } | null;
}

interface CoachCard {
  observation: string;
  pattern: string;
  experiment: string;
}

interface QuestionsCard extends CoachCard {
  count: number;
  types: {
    recall: number;
    inferential: number;
    open_ended: number;
    clarifying: number;
  };
  examples: { text: string; type: string }[];
}

interface CoachReport {
  tone: CoachCard;
  movement: CoachCard | null;
  intonation: CoachCard;
  questions: QuestionsCard;
}

function buildPrompt(body: AnalyzeRequest): string {
  const { transcript, questions, audio_metrics, video_metrics, video_enabled, teacher_context, lesson_plan_pdf } = body;
  const m = audio_metrics;
  const motionLine = video_enabled && video_metrics
    ? `Motion metrics (from local frame differencing on the teacher's laptop, NOT the frames themselves): mean intensity ${video_metrics.motion_avg.toFixed(2)}, intensity stddev ${video_metrics.motion_stddev.toFixed(2)}, ${video_metrics.motion_active_pct.toFixed(1)}% of sampled frames had motion above threshold, across ${video_metrics.frame_samples} frame samples. Higher mean means more overall movement. Higher stddev means more variation (gesture bursts). Active percentage near 100 means almost constant motion; near 0 means mostly still.`
    : '';
  const movementInstruction = video_enabled
    ? `For the movement card, ground your observation in the motion metrics above. Do not invent body language details you cannot infer from intensity numbers alone (you do not see the frames). You may comment on: overall movement level, variation between gesture bursts and stillness, and whether stillness or motion may serve the teaching moment.`
    : `For movement: return null. The teacher recorded without video.`;

  const ctx = teacher_context || {};
  const hasAnyContext = Boolean(ctx.grade_level || ctx.subject || ctx.lesson_focus || ctx.lesson_plan_text || lesson_plan_pdf);
  const contextLines: string[] = [];
  if (ctx.grade_level) contextLines.push(`- Grade level: ${ctx.grade_level}`);
  if (ctx.subject) contextLines.push(`- Subject: ${ctx.subject}`);
  if (ctx.lesson_focus) contextLines.push(`- Lesson focus: ${ctx.lesson_focus}`);
  if (ctx.lesson_plan_text) contextLines.push(`- Lesson plan (pasted by teacher): """${ctx.lesson_plan_text}"""`);
  if (lesson_plan_pdf) contextLines.push(`- Lesson plan PDF attached as a document above. Read it to ground your coaching in what the teacher actually planned. Compare what was planned against what came through in the transcript.`);

  const contextBlock = hasAnyContext
    ? `Teacher context (provided by the teacher for this session):
${contextLines.join('\n')}

Tailor every observation, pattern, and experiment to this teacher's grade level, subject, and stated lesson focus. Developmentally appropriate language varies by grade. A second-grade reading lesson needs different coaching than a fifth-grade math lesson. Reference the lesson plan where it is relevant to what you observed.

`
    : `The teacher did not provide grade level, subject, or a lesson plan for this session. Keep coaching general and avoid assumptions about developmental level or content area.

`;

  return `You are a teaching coach reviewing one recorded lesson delivery. The teacher chose to share only the transcript, numeric metrics, and any lesson context they explicitly attached with their district's model. You will NEVER see student names; the teacher has confirmed none are in the transcript. Your goal is to help the teacher build capacity, not to evaluate them. This will never be used for evaluation.

${contextBlock}If any proper nouns slipped into the transcript, redact them as [student] in any examples you quote back. Do not name students.

Transcript: """${transcript}"""

Audio metrics: pitch average ${m.pitch_avg.toFixed(1)} Hz, pitch standard deviation ${m.pitch_stddev.toFixed(1)}, volume RMS ${m.volume_rms.toFixed(3)}, duration ${m.duration_sec.toFixed(1)} seconds.

${motionLine}

Questions extracted from transcript: ${JSON.stringify(questions)}
Note: the transcript captures every voice the microphone picked up, primarily the teacher. v1 does not distinguish teacher questions from student questions. Frame your questions feedback as "your questioning practice" rather than as a count of student questions specifically.

Video was ${video_enabled ? 'enabled' : 'disabled'}.

${movementInstruction}

Return JSON only, no prose before or after, this exact shape:
{
  "tone": { "observation": "...", "pattern": "...", "experiment": "..." },
  "movement": ${video_enabled ? '{ "observation": "...", "pattern": "...", "experiment": "..." }' : 'null'},
  "intonation": { "observation": "...", "pattern": "...", "experiment": "..." },
  "questions": {
    "count": <number>,
    "types": { "recall": <n>, "inferential": <n>, "open_ended": <n>, "clarifying": <n> },
    "examples": [{ "text": "...", "type": "recall|inferential|open_ended|clarifying" }],
    "observation": "...",
    "pattern": "...",
    "experiment": "..."
  }
}

Rules:
- Each observation, pattern, and experiment field is one sentence.
- Be specific. No platitudes.
- The experiment must be doable in one next recording.
- Do not use em dashes. Use regular dashes or rewrite.
- Do not use the rhetorical pattern "we do X, not Y" or "X, not Y".
${video_enabled ? '' : '- Movement is null. Do not infer movement from audio alone.'}`;
}

function extractJson(text: string): CoachReport {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in model response');
  return JSON.parse(candidate.slice(start, end + 1)) as CoachReport;
}

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.transcript || body.transcript.trim().length < 5) {
    return NextResponse.json({ error: 'Transcript is empty or too short' }, { status: 400 });
  }
  if (!body.audio_metrics) {
    return NextResponse.json({ error: 'Audio metrics are required' }, { status: 400 });
  }

  try {
    const promptText = buildPrompt(body);
    const content: Anthropic.Messages.ContentBlockParam[] = [];
    if (body.lesson_plan_pdf?.data) {
      content.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: body.lesson_plan_pdf.data,
        },
      });
    }
    content.push({ type: 'text', text: promptText });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const report = extractJson(raw);

    if (!body.video_enabled) report.movement = null;

    return NextResponse.json({ report });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Analysis failed: ${errorMessage}` }, { status: 500 });
  }
}
