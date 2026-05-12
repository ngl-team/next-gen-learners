import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

interface AudioMetrics {
  pitch_avg: number;
  pitch_stddev: number;
  volume_rms: number;
  duration_sec: number;
}

interface TakeSnapshot {
  transcript: string;
  audio_metrics: AudioMetrics;
  experiment: string;
  question_count: number;
}

interface CompareRequest {
  take1: TakeSnapshot;
  take2: TakeSnapshot;
}

export async function POST(req: NextRequest) {
  let body: CompareRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.take1 || !body.take2) {
    return NextResponse.json({ error: 'Both takes are required' }, { status: 400 });
  }

  const prompt = `You are a teaching coach reviewing two consecutive takes of the same lesson delivery from one teacher. Between takes, the teacher tried to apply this experiment: "${body.take1.experiment}".

Take 1 transcript: """${body.take1.transcript}"""
Take 1 metrics: pitch ${body.take1.audio_metrics.pitch_avg.toFixed(1)} Hz, pitch stddev ${body.take1.audio_metrics.pitch_stddev.toFixed(1)}, volume RMS ${body.take1.audio_metrics.volume_rms.toFixed(3)}, ${body.take1.audio_metrics.duration_sec.toFixed(1)}s, ${body.take1.question_count} questions.

Take 2 transcript: """${body.take2.transcript}"""
Take 2 metrics: pitch ${body.take2.audio_metrics.pitch_avg.toFixed(1)} Hz, pitch stddev ${body.take2.audio_metrics.pitch_stddev.toFixed(1)}, volume RMS ${body.take2.audio_metrics.volume_rms.toFixed(3)}, ${body.take2.audio_metrics.duration_sec.toFixed(1)}s, ${body.take2.question_count} questions.

Write one short paragraph (3 to 5 sentences) answering: did Take 2 move the needle on the specific experiment? Be specific about what changed and what did not. Encourage the next attempt. Do not use em dashes. Do not use the "X, not Y" rhetorical comma pattern. Return only the paragraph, no headers or labels.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const reflection = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

    const deltas = {
      pitch_stddev: body.take2.audio_metrics.pitch_stddev - body.take1.audio_metrics.pitch_stddev,
      volume_rms: body.take2.audio_metrics.volume_rms - body.take1.audio_metrics.volume_rms,
      duration_sec: body.take2.audio_metrics.duration_sec - body.take1.audio_metrics.duration_sec,
      question_count: body.take2.question_count - body.take1.question_count,
    };

    return NextResponse.json({ reflection, deltas });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `Comparison failed: ${errorMessage}` }, { status: 500 });
  }
}
