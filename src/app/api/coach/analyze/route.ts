import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

interface AudioMetrics {
  pitch_avg: number;
  pitch_stddev: number;
  volume_rms: number;
  duration_sec: number;
}

interface AnalyzeRequest {
  transcript: string;
  questions: string[];
  audio_metrics: AudioMetrics;
  video_enabled: boolean;
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
  const { transcript, questions, audio_metrics, video_enabled } = body;
  const m = audio_metrics;
  return `You are a teaching coach reviewing one recorded lesson delivery. The teacher chose to share only the transcript and audio metrics with their district's model. You will NEVER see student names; the teacher has confirmed none are in the transcript. Your goal is to help the teacher build capacity, not to evaluate them. This will never be used for evaluation.

If any proper nouns slipped into the transcript, redact them as [student] in any examples you quote back. Do not name students.

Transcript: """${transcript}"""

Audio metrics: pitch average ${m.pitch_avg.toFixed(1)} Hz, pitch standard deviation ${m.pitch_stddev.toFixed(1)}, volume RMS ${m.volume_rms.toFixed(3)}, duration ${m.duration_sec.toFixed(1)} seconds.

Questions extracted from transcript: ${JSON.stringify(questions)}

Video was ${video_enabled ? 'enabled' : 'disabled'}.

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
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: buildPrompt(body) }],
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
