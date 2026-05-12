"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
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

interface Take {
  transcript: string;
  metrics: AudioMetrics;
  videoMetrics: VideoMetrics | null;
  questions: string[];
  report: CoachReport;
  videoEnabled: boolean;
}

interface CompareResult {
  reflection: string;
  deltas: {
    pitch_stddev: number;
    volume_rms: number;
    duration_sec: number;
    question_count: number;
  };
}

type Stage = "setup" | "recording" | "stopped" | "gated" | "analyzing" | "report" | "comparing" | "comparison";

/* Web Speech API typing - kept minimal to avoid global pollution */
interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}
interface RecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { results: ArrayLike<ArrayLike<SpeechRecognitionResult>>; resultIndex: number }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionCtor = new () => RecognitionLike;

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
const QUESTION_STARTS = /^(what|who|where|when|why|how|which|do|does|did|can|could|would|will|is|are|am|was|were|should|shall)\b/i;

function extractQuestions(transcript: string): string[] {
  if (!transcript) return [];
  const sentences = transcript
    .replace(/\n+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  return sentences.filter(s => s.endsWith("?") || QUESTION_STARTS.test(s));
}

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "0";
}

function fmtDelta(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "0";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}`;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function CoachPage() {
  /* Stage + setup */
  const [stage, setStage] = useState<Stage>("setup");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  /* Recording state */
  const [elapsed, setElapsed] = useState(0);
  const [liveVolume, setLiveVolume] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  /* Take state */
  const [currentTakeNumber, setCurrentTakeNumber] = useState<1 | 2>(1);
  const [take1, setTake1] = useState<Take | null>(null);
  const [take2, setTake2] = useState<Take | null>(null);
  const [comparison, setComparison] = useState<CompareResult | null>(null);
  const [activeTakeView, setActiveTakeView] = useState<1 | 2>(1);

  /* Refs (do not trigger renders) */
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sampleTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && mediaStreamRef.current && videoEnabled) {
      node.srcObject = mediaStreamRef.current;
      node.play().catch(() => { /* autoplay can fail silently */ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEnabled]);

  /* Metric accumulators */
  const pitchSamplesRef = useRef<number[]>([]);
  const volumeSamplesRef = useRef<number[]>([]);
  const motionSamplesRef = useRef<number[]>([]);
  const finalTranscriptRef = useRef<string>("");

  /* Motion tracking */
  const motionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const motionTimerRef = useRef<number | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const MOTION_W = 80;
  const MOTION_H = 60;
  const MOTION_ACTIVE_THRESHOLD = 4;

  /* Detect speech recognition support on mount */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    if (!w.SpeechRecognition && !w.webkitSpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      stopAllStreams();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─────────────────────────────────────────
     MEDIA: stream + analyser teardown
     ───────────────────────────────────────── */
  const stopAllStreams = useCallback(() => {
    if (sampleTimerRef.current) {
      window.clearInterval(sampleTimerRef.current);
      sampleTimerRef.current = null;
    }
    if (motionTimerRef.current) {
      window.clearInterval(motionTimerRef.current);
      motionTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    prevFrameDataRef.current = null;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch { /* noop */ }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch { /* noop */ }
      sourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch { /* noop */ }
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  /* ─────────────────────────────────────────
     START RECORDING
     ───────────────────────────────────────── */
  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
    pitchSamplesRef.current = [];
    volumeSamplesRef.current = [];
    motionSamplesRef.current = [];
    prevFrameDataRef.current = null;
    recordedChunksRef.current = [];
    setElapsed(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabled ? { width: 320, height: 240 } : false,
      });
      mediaStreamRef.current = stream;
      setStage("recording");

      if (videoEnabled && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => { /* autoplay can fail silently */ });
      }

      /* MediaRecorder keeps audio in browser memory only */
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;

      /* Web Audio analyser */
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const freqBuf = new Float32Array(analyser.frequencyBinCount);
      const timeBuf = new Uint8Array(analyser.fftSize);
      const sampleRate = ctx.sampleRate;
      const binHz = sampleRate / analyser.fftSize;

      sampleTimerRef.current = window.setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatFrequencyData(freqBuf);
        analyserRef.current.getByteTimeDomainData(timeBuf);

        /* Spectral centroid as pitch proxy */
        let weighted = 0;
        let total = 0;
        for (let i = 0; i < freqBuf.length; i++) {
          const mag = Math.pow(10, freqBuf[i] / 20);
          weighted += mag * i * binHz;
          total += mag;
        }
        const centroid = total > 0 ? weighted / total : 0;
        if (centroid > 50 && centroid < 4000) pitchSamplesRef.current.push(centroid);

        /* RMS volume from time-domain */
        let sumSq = 0;
        for (let i = 0; i < timeBuf.length; i++) {
          const v = (timeBuf[i] - 128) / 128;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / timeBuf.length);
        volumeSamplesRef.current.push(rms);
        setLiveVolume(rms);
      }, 100);

      /* Local motion tracking via frame differencing (only when video is on) */
      if (videoEnabled) {
        const canvas = motionCanvasRef.current ?? document.createElement("canvas");
        canvas.width = MOTION_W;
        canvas.height = MOTION_H;
        motionCanvasRef.current = canvas;
        const cctx = canvas.getContext("2d", { willReadFrequently: true });

        motionTimerRef.current = window.setInterval(() => {
          const video = videoRef.current;
          if (!video || !cctx || video.readyState < 2) return;
          try {
            cctx.drawImage(video, 0, 0, MOTION_W, MOTION_H);
            const frame = cctx.getImageData(0, 0, MOTION_W, MOTION_H).data;
            const prev = prevFrameDataRef.current;
            if (prev && prev.length === frame.length) {
              let diffSum = 0;
              /* Sample every 4th pixel for speed; skip alpha channel */
              for (let i = 0; i < frame.length; i += 16) {
                diffSum += Math.abs(frame[i] - prev[i]);
                diffSum += Math.abs(frame[i + 1] - prev[i + 1]);
                diffSum += Math.abs(frame[i + 2] - prev[i + 2]);
              }
              const sampled = frame.length / 16;
              const meanDiff = diffSum / (sampled * 3);
              motionSamplesRef.current.push(meanDiff);
            }
            prevFrameDataRef.current = new Uint8ClampedArray(frame);
          } catch { /* readback can throw if video not ready; ignore */ }
        }, 200);
      }

      /* Web Speech transcription */
      const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
      const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (Recognition) {
        const rec = new Recognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        rec.onresult = (e) => {
          let interim = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const res = e.results[i];
            const piece = res[0].transcript;
            if (res[0].isFinal) {
              finalTranscriptRef.current += piece + " ";
            } else {
              interim += piece;
            }
          }
          setTranscript(finalTranscriptRef.current);
          setInterimTranscript(interim);
        };
        rec.onerror = () => { /* swallow; transcript may be partial */ };
        rec.onend = () => {
          /* If we are still recording, restart to keep listening */
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            try { rec.start(); } catch { /* noop */ }
          }
        };
        try { rec.start(); } catch { /* noop */ }
        recognitionRef.current = rec;
      }

      /* Elapsed timer */
      startTimeRef.current = Date.now();
      elapsedTimerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - startTimeRef.current) / 1000);
      }, 250);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not access microphone or camera.";
      setError(`${msg} Check browser permissions and try again.`);
      stopAllStreams();
      setStage("setup");
    }
  }, [stopAllStreams, videoEnabled]);

  /* ─────────────────────────────────────────
     STOP RECORDING
     ───────────────────────────────────────── */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch { /* noop */ }
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    }
    if (sampleTimerRef.current) {
      window.clearInterval(sampleTimerRef.current);
      sampleTimerRef.current = null;
    }
    if (motionTimerRef.current) {
      window.clearInterval(motionTimerRef.current);
      motionTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setStage("stopped");
  }, []);

  /* ─────────────────────────────────────────
     COMPUTE METRICS
     ───────────────────────────────────────── */
  const computeMetrics = useCallback((): AudioMetrics => {
    const pitches = pitchSamplesRef.current;
    const volumes = volumeSamplesRef.current;
    const pitch_avg = pitches.length
      ? pitches.reduce((a, b) => a + b, 0) / pitches.length
      : 0;
    const pitch_stddev = pitches.length
      ? Math.sqrt(pitches.reduce((acc, v) => acc + (v - pitch_avg) ** 2, 0) / pitches.length)
      : 0;
    const volume_rms = volumes.length
      ? volumes.reduce((a, b) => a + b, 0) / volumes.length
      : 0;
    return {
      pitch_avg,
      pitch_stddev,
      volume_rms,
      duration_sec: elapsed,
    };
  }, [elapsed]);

  const computeVideoMetrics = useCallback((): VideoMetrics | null => {
    if (!videoEnabled) return null;
    const samples = motionSamplesRef.current;
    if (samples.length === 0) {
      return { motion_avg: 0, motion_stddev: 0, motion_active_pct: 0, frame_samples: 0 };
    }
    const motion_avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const motion_stddev = Math.sqrt(
      samples.reduce((acc, v) => acc + (v - motion_avg) ** 2, 0) / samples.length
    );
    const activeCount = samples.filter(v => v > MOTION_ACTIVE_THRESHOLD).length;
    const motion_active_pct = (activeCount / samples.length) * 100;
    return {
      motion_avg,
      motion_stddev,
      motion_active_pct,
      frame_samples: samples.length,
    };
  }, [videoEnabled]);

  /* ─────────────────────────────────────────
     PRIVACY GATE OPEN
     ───────────────────────────────────────── */
  const openPrivacyGate = useCallback(() => {
    if (!transcript.trim()) {
      setError("No transcript captured. Try recording again with a clearer mic.");
      return;
    }
    setStage("gated");
  }, [transcript]);

  /* ─────────────────────────────────────────
     SEND TO MODEL
     ───────────────────────────────────────── */
  const sendForAnalysis = useCallback(async () => {
    setStage("analyzing");
    setError(null);
    const metrics = computeMetrics();
    const videoMetrics = computeVideoMetrics();
    const questions = extractQuestions(transcript);
    try {
      const res = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          questions,
          audio_metrics: metrics,
          video_metrics: videoMetrics,
          video_enabled: videoEnabled,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      const data = await res.json();
      const take: Take = {
        transcript,
        metrics,
        videoMetrics,
        questions,
        report: data.report,
        videoEnabled,
      };
      if (currentTakeNumber === 1) {
        setTake1(take);
        setActiveTakeView(1);
      } else {
        setTake2(take);
        setActiveTakeView(2);
      }
      setStage("report");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      setStage("stopped");
    }
  }, [computeMetrics, computeVideoMetrics, currentTakeNumber, transcript, videoEnabled]);

  /* ─────────────────────────────────────────
     START TAKE 2
     ───────────────────────────────────────── */
  const startTake2 = useCallback(() => {
    setCurrentTakeNumber(2);
    setStage("setup");
    setTranscript("");
    setInterimTranscript("");
    setElapsed(0);
    setError(null);
  }, []);

  /* ─────────────────────────────────────────
     RUN COMPARISON
     ───────────────────────────────────────── */
  const runComparison = useCallback(async () => {
    if (!take1 || !take2) return;
    setStage("comparing");
    setError(null);
    try {
      const res = await fetch("/api/coach/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          take1: {
            transcript: take1.transcript,
            audio_metrics: take1.metrics,
            experiment: take1.report.tone.experiment,
            question_count: take1.report.questions.count,
          },
          take2: {
            transcript: take2.transcript,
            audio_metrics: take2.metrics,
            experiment: take1.report.tone.experiment,
            question_count: take2.report.questions.count,
          },
        }),
      });
      if (!res.ok) throw new Error("Comparison request failed");
      const data: CompareResult = await res.json();
      setComparison(data);
      setStage("comparison");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Comparison failed";
      setError(msg);
      setStage("report");
    }
  }, [take1, take2]);

  /* ─────────────────────────────────────────
     RESET (Save and finish clears in-memory state)
     ───────────────────────────────────────── */
  const resetAll = useCallback(() => {
    stopAllStreams();
    setStage("setup");
    setCurrentTakeNumber(1);
    setTake1(null);
    setTake2(null);
    setComparison(null);
    setTranscript("");
    setInterimTranscript("");
    setElapsed(0);
    setError(null);
    finalTranscriptRef.current = "";
    pitchSamplesRef.current = [];
    volumeSamplesRef.current = [];
    recordedChunksRef.current = [];
  }, [stopAllStreams]);

  /* ─────────────────────────────────────────
     BEACON STATE
     ───────────────────────────────────────── */
  const beacon = useMemo(() => {
    if (stage === "analyzing" || stage === "comparing") {
      return { color: "#F59E0B", text: "Transcript only sent to your district's model" };
    }
    if ((take1 || take2) && (stage === "report" || stage === "comparison")) {
      return { color: "#F59E0B", text: "Transcript only sent to your district's model" };
    }
    return { color: "#10B981", text: "All audio and video on this laptop only" };
  }, [stage, take1, take2]);

  /* ─────────────────────────────────────────
     CURRENT VIEW
     ───────────────────────────────────────── */
  const activeTake = activeTakeView === 1 ? take1 : take2;
  const displayTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : "");

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#FAFBFF", color: "#1E1B4B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* ── Header + Beacon ── */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: ".7rem", fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "#4F46E5" }}>
              Next Generation Learners
            </span>
            <span style={{ fontSize: ".65rem", color: "#94A3B8" }}>· Coach preview for Danbury Public Schools</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 6px" }}>Teacher Coach</h1>
          <p style={{ color: "#64748B", fontSize: ".95rem", margin: 0, lineHeight: 1.5 }}>
            Record. Reflect. Iterate. Your data stays yours.
          </p>

          <div style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            border: `1px solid ${beacon.color}40`,
            background: `${beacon.color}10`,
            borderRadius: 999,
          }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: beacon.color,
              boxShadow: `0 0 0 4px ${beacon.color}25`,
            }} />
            <span style={{ fontSize: ".78rem", fontWeight: 600, color: "#1E1B4B" }}>{beacon.text}</span>
          </div>
        </header>

        {error && (
          <div style={{
            marginBottom: 20,
            padding: "12px 16px",
            border: "1px solid #FCA5A5",
            background: "#FEF2F2",
            borderRadius: 12,
            color: "#991B1B",
            fontSize: ".85rem",
          }}>
            {error}
          </div>
        )}

        {/* ── Recording Panel ── */}
        {(stage === "setup" || stage === "recording" || stage === "stopped" || stage === "gated") && (
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#94A3B8" }}>
                  Take {currentTakeNumber}
                </div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0" }}>
                  {stage === "recording" ? "Recording" : stage === "stopped" ? "Recording complete" : "Set up your take"}
                </h2>
              </div>
              {stage === "setup" && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".8rem", color: "#475569", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={videoEnabled}
                    onChange={(e) => setVideoEnabled(e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  Record video for movement feedback
                </label>
              )}
            </div>

            {!speechSupported && (
              <div style={{ padding: "10px 14px", background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 10, marginBottom: 16, fontSize: ".8rem", color: "#92400E" }}>
                Live transcription requires Chrome or Edge. Recording still works, but the transcript will be empty.
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: videoEnabled && (stage === "recording" || stage === "stopped") ? "1fr 280px" : "1fr", gap: 20, alignItems: "start" }}>
              <div>
                {/* Big record button */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                  {stage !== "recording" ? (
                    <button
                      onClick={startRecording}
                      style={recordButtonStyle(false)}
                      aria-label="Start recording"
                    >
                      <span style={{ display: "block", width: 22, height: 22, background: "white", borderRadius: 999 }} />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      style={recordButtonStyle(true)}
                      aria-label="Stop recording"
                    >
                      <span style={{ display: "block", width: 20, height: 20, background: "white", borderRadius: 3 }} />
                    </button>
                  )}
                  <div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      {Math.floor(elapsed / 60).toString().padStart(2, "0")}:{Math.floor(elapsed % 60).toString().padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: ".75rem", color: "#64748B" }}>
                      {stage === "recording" ? "Tap the square to stop" : stage === "stopped" ? `${transcript.split(/\s+/).filter(Boolean).length} words captured` : "Tap the red circle to start"}
                    </div>
                  </div>
                </div>

                {/* Live audio meter */}
                {(stage === "recording" || stage === "stopped") && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
                      Live audio
                    </div>
                    <div style={{ height: 12, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(100, liveVolume * 400)}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
                        transition: "width 80ms linear",
                      }} />
                    </div>
                  </div>
                )}

                {/* Live transcript */}
                {(stage === "recording" || stage === "stopped") && (
                  <div>
                    <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
                      Live transcript
                    </div>
                    <div style={{
                      minHeight: 120,
                      maxHeight: 200,
                      overflowY: "auto",
                      padding: 14,
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: 10,
                      fontSize: ".88rem",
                      lineHeight: 1.6,
                      color: "#1E1B4B",
                    }}>
                      {displayTranscript || <span style={{ color: "#94A3B8" }}>Speak to see your words appear here. Nothing is sent anywhere yet.</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Video preview */}
              {videoEnabled && (stage === "recording" || stage === "stopped") && (
                <div>
                  <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
                    Camera preview
                  </div>
                  <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#0F172A", aspectRatio: "4 / 3" }}>
                    <video
                      ref={videoCallbackRef}
                      muted
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
                    />
                    {stage === "recording" && (
                      <div style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        background: "rgba(239, 68, 68, 0.92)",
                        borderRadius: 999,
                        color: "white",
                        fontSize: ".68rem",
                        fontWeight: 700,
                      }}>
                        <span style={{ width: 6, height: 6, background: "white", borderRadius: 999 }} />
                        REC
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: ".7rem", color: "#94A3B8", marginTop: 6 }}>
                    Video stays in this browser. It is not uploaded.
                  </div>
                </div>
              )}
            </div>

            {/* Stopped state actions */}
            {stage === "stopped" && (
              <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={openPrivacyGate} style={primaryBtn}>
                  Get coaching feedback
                </button>
                <button onClick={startRecording} style={secondaryBtn}>
                  Re-record
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── Analyzing state ── */}
        {stage === "analyzing" && (
          <section style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 6 }}>Analyzing your take</div>
            <div style={{ fontSize: ".85rem", color: "#64748B" }}>
              Only the transcript and metric numbers crossed to the model. The audio stayed here.
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{
                width: 36,
                height: 36,
                margin: "0 auto",
                borderRadius: 999,
                border: "3px solid #E2E8F0",
                borderTopColor: "#4F46E5",
                animation: "coach-spin 0.9s linear infinite",
              }} />
            </div>
            <style>{`@keyframes coach-spin { to { transform: rotate(360deg); } }`}</style>
          </section>
        )}

        {/* ── Report ── */}
        {(stage === "report" || stage === "comparison" || stage === "comparing") && activeTake && (
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#94A3B8" }}>
                  Take {activeTakeView} report
                </div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 0" }}>Coaching feedback</h2>
              </div>
              {take2 && take1 && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setActiveTakeView(1)} style={tabBtn(activeTakeView === 1)}>Take 1</button>
                  <button onClick={() => setActiveTakeView(2)} style={tabBtn(activeTakeView === 2)}>Take 2</button>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              <FeedbackCard title="Tone of voice" card={activeTake.report.tone} />
              {activeTake.videoEnabled && activeTake.report.movement ? (
                <MovementCard card={activeTake.report.movement} metrics={activeTake.videoMetrics} />
              ) : (
                <div style={subtleCardStyle}>
                  <div style={cardTitleStyle}>Movement</div>
                  <div style={{ fontSize: ".82rem", color: "#64748B", lineHeight: 1.5, marginTop: 8 }}>
                    Video disabled for this take. Record with video to receive movement feedback.
                  </div>
                </div>
              )}
              <FeedbackCard title="Intonation" card={activeTake.report.intonation} />
              <QuestionsCardView card={activeTake.report.questions} />
            </div>

            <div style={{ marginTop: 14, padding: "10px 14px", background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: 10, fontSize: ".75rem", color: "#475569", lineHeight: 1.55 }}>
              <strong style={{ color: "#1E1B4B" }}>v1 note on the Questions card:</strong> this take measures every question asked in the room. v2 will separate teacher voice from student voices using a local Whisper model so we can credit student questions specifically.
            </div>

            {/* Actions */}
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!take2 && (
                <button onClick={startTake2} style={primaryBtn}>
                  Record take 2
                </button>
              )}
              {take2 && stage !== "comparison" && (
                <button onClick={runComparison} style={primaryBtn} disabled={stage === "comparing"}>
                  {stage === "comparing" ? "Comparing..." : "Compare takes"}
                </button>
              )}
              <button onClick={resetAll} style={secondaryBtn}>
                Save and finish
              </button>
            </div>
            <div style={{ marginTop: 10, fontSize: ".7rem", color: "#94A3B8" }}>
              &quot;Save and finish&quot; clears this report from memory. There is no server copy to delete.
            </div>
          </section>
        )}

        {/* ── Comparison ── */}
        {stage === "comparison" && take1 && take2 && comparison && (
          <section style={{ ...cardStyle, marginTop: 16 }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#94A3B8" }}>
              Take 1 vs Take 2
            </div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "4px 0 14px" }}>What you tried to apply</h2>
            <div style={{ padding: "12px 14px", background: "#EEF2FF", borderRadius: 10, fontSize: ".88rem", color: "#1E1B4B", marginBottom: 18 }}>
              {take1.report.tone.experiment}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 18 }}>
              <DeltaTile label="Pitch variance" t1={take1.metrics.pitch_stddev} t2={take2.metrics.pitch_stddev} suffix=" Hz" />
              <DeltaTile label="Volume RMS" t1={take1.metrics.volume_rms} t2={take2.metrics.volume_rms} digits={3} />
              <DeltaTile label="Duration" t1={take1.metrics.duration_sec} t2={take2.metrics.duration_sec} suffix="s" />
              <DeltaTile label="Questions asked" t1={take1.report.questions.count} t2={take2.report.questions.count} digits={0} />
            </div>

            <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
              Did Take 2 move the needle?
            </div>
            <p style={{ fontSize: ".92rem", lineHeight: 1.65, color: "#1E1B4B", margin: 0 }}>
              {comparison.reflection}
            </p>

            <div style={{ marginTop: 22 }}>
              <button onClick={resetAll} style={secondaryBtn}>Save and finish</button>
            </div>
          </section>
        )}

        {/* ── Architecture diagram footer ── */}
        <section style={{ marginTop: 36 }}>
          <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>
            How the data flows
          </div>
          <ArchitectureDiagram />
          <p style={{ marginTop: 14, fontSize: ".82rem", color: "#475569", lineHeight: 1.6 }}>
            Your district controls every layer. No vendor has standing access. This is the same backbone we built for Superintendent Roach.
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 18, color: "#475569", fontSize: ".82rem", lineHeight: 1.7 }}>
            <li>Audio and video are captured by the teacher&apos;s browser and never uploaded.</li>
            <li>Transcription, waveform analysis, and timers run on the teacher&apos;s laptop.</li>
            <li>Only the transcript text and a handful of numeric metrics cross to the district&apos;s model.</li>
            <li>Nothing is retained for training. There is no shared library, no evaluation pipeline.</li>
          </ul>
        </section>
      </div>

      <PrivacyGate
        open={stage === "gated"}
        transcript={transcript}
        videoEnabled={videoEnabled}
        onCancel={() => setStage("stopped")}
        onConfirm={sendForAnalysis}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */
function FeedbackCard({ title, card }: { title: string; card: CoachCard }) {
  return (
    <div style={subtleCardStyle}>
      <div style={cardTitleStyle}>{title}</div>
      <div style={{ marginTop: 10 }}>
        <CardRow label="Observation" text={card.observation} />
        <CardRow label="Pattern" text={card.pattern} />
        <CardRow label="Try next time" text={card.experiment} highlight />
      </div>
    </div>
  );
}

function MovementCard({ card, metrics }: { card: CoachCard; metrics: VideoMetrics | null }) {
  return (
    <div style={subtleCardStyle}>
      <div style={cardTitleStyle}>Movement</div>
      {metrics && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, marginBottom: 4 }}>
          <Pill text={`${metrics.motion_active_pct.toFixed(0)}% active frames`} primary />
          <Pill text={`avg intensity ${metrics.motion_avg.toFixed(1)}`} />
          <Pill text={`${metrics.frame_samples} frames sampled`} />
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <CardRow label="Observation" text={card.observation} />
        <CardRow label="Pattern" text={card.pattern} />
        <CardRow label="Try next time" text={card.experiment} highlight />
      </div>
      {metrics && (
        <div style={{ marginTop: 8, fontSize: ".7rem", color: "#94A3B8", lineHeight: 1.45 }}>
          Motion intensity is measured by local frame differencing on your laptop. The numbers above cross to the model. The frames themselves never leave the browser.
        </div>
      )}
    </div>
  );
}

function CardRow({ label, text, highlight = false }: { label: string; text: string; highlight?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: highlight ? "#4F46E5" : "#94A3B8", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: ".84rem", lineHeight: 1.5, color: "#1E1B4B" }}>{text}</div>
    </div>
  );
}

function QuestionsCardView({ card }: { card: QuestionsCard }) {
  return (
    <div style={subtleCardStyle}>
      <div style={cardTitleStyle}>Questions</div>
      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <Pill text={`${card.count} total`} primary />
          <Pill text={`${card.types.recall} recall`} />
          <Pill text={`${card.types.inferential} inferential`} />
          <Pill text={`${card.types.open_ended} open-ended`} />
          <Pill text={`${card.types.clarifying} clarifying`} />
        </div>
        {card.examples && card.examples.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 4 }}>
              Examples
            </div>
            {card.examples.slice(0, 3).map((q, i) => (
              <div key={i} style={{ fontSize: ".8rem", color: "#334155", lineHeight: 1.5, marginBottom: 4 }}>
                &ldquo;{q.text}&rdquo; <span style={{ color: "#94A3B8", fontSize: ".7rem" }}>· {q.type}</span>
              </div>
            ))}
          </div>
        )}
        <CardRow label="Observation" text={card.observation} />
        <CardRow label="Pattern" text={card.pattern} />
        <CardRow label="Try next time" text={card.experiment} highlight />
      </div>
    </div>
  );
}

function Pill({ text, primary = false }: { text: string; primary?: boolean }) {
  return (
    <span style={{
      fontSize: ".7rem",
      fontWeight: 700,
      padding: "3px 9px",
      borderRadius: 999,
      background: primary ? "#4F46E5" : "#F1F5F9",
      color: primary ? "white" : "#475569",
    }}>
      {text}
    </span>
  );
}

function DeltaTile({ label, t1, t2, digits = 1, suffix = "" }: { label: string; t1: number; t2: number; digits?: number; suffix?: string }) {
  const delta = t2 - t1;
  return (
    <div style={{ padding: "12px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10 }}>
      <div style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#1E1B4B", fontVariantNumeric: "tabular-nums" }}>
        {fmt(t1, digits)}{suffix} <span style={{ color: "#94A3B8", fontWeight: 500 }}>→</span> {fmt(t2, digits)}{suffix}
      </div>
      <div style={{ marginTop: 4, fontSize: ".75rem", fontWeight: 600, color: delta === 0 ? "#94A3B8" : delta > 0 ? "#10B981" : "#EF4444" }}>
        {fmtDelta(delta, digits)}{suffix}
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 18 }}>
      <svg viewBox="0 0 760 220" width="100%" style={{ display: "block" }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4F46E5" />
          </marker>
        </defs>
        {/* Teacher laptop region */}
        <rect x="20" y="20" width="340" height="180" rx="14" fill="#EEF2FF" stroke="#C7D2FE" />
        <text x="40" y="46" fontSize="12" fontWeight="700" fill="#4338CA" fontFamily="sans-serif">TEACHER LAPTOP</text>
        <rect x="40" y="60" width="140" height="38" rx="8" fill="white" stroke="#C7D2FE" />
        <text x="110" y="84" textAnchor="middle" fontSize="11" fill="#1E1B4B" fontFamily="sans-serif">Webcam + mic</text>
        <rect x="200" y="60" width="140" height="38" rx="8" fill="white" stroke="#C7D2FE" />
        <text x="270" y="84" textAnchor="middle" fontSize="11" fill="#1E1B4B" fontFamily="sans-serif">Audio analysis</text>
        <rect x="40" y="112" width="140" height="38" rx="8" fill="white" stroke="#C7D2FE" />
        <text x="110" y="136" textAnchor="middle" fontSize="11" fill="#1E1B4B" fontFamily="sans-serif">Transcription</text>
        <rect x="200" y="112" width="140" height="38" rx="8" fill="white" stroke="#C7D2FE" />
        <text x="270" y="136" textAnchor="middle" fontSize="11" fill="#1E1B4B" fontFamily="sans-serif">Privacy gate</text>
        <text x="40" y="180" fontSize="10" fill="#64748B" fontFamily="sans-serif">Audio and video stay here.</text>

        {/* Arrow */}
        <line x1="360" y1="110" x2="430" y2="110" stroke="#4F46E5" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="395" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4F46E5" fontFamily="sans-serif">transcript</text>
        <text x="395" y="124" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4F46E5" fontFamily="sans-serif">+ metrics only</text>

        {/* District tenant region */}
        <rect x="440" y="20" width="300" height="180" rx="14" fill="#F0FDF4" stroke="#BBF7D0" />
        <text x="460" y="46" fontSize="12" fontWeight="700" fill="#15803D" fontFamily="sans-serif">DISTRICT TENANT</text>
        <rect x="460" y="60" width="260" height="38" rx="8" fill="white" stroke="#BBF7D0" />
        <text x="590" y="84" textAnchor="middle" fontSize="11" fill="#1E1B4B" fontFamily="sans-serif">Claude (district-controlled)</text>
        <rect x="460" y="112" width="260" height="38" rx="8" fill="white" stroke="#BBF7D0" />
        <text x="590" y="136" textAnchor="middle" fontSize="11" fill="#1E1B4B" fontFamily="sans-serif">Structured report</text>
        <text x="460" y="180" fontSize="10" fill="#64748B" fontFamily="sans-serif">Not retained for training.</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRIVACY GATE MODAL
   ═══════════════════════════════════════════ */
function PrivacyGate({
  open,
  transcript,
  videoEnabled,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  transcript: string;
  videoEnabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (!open) setChecked(false);
  }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.55)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, maxWidth: 720, width: "100%", padding: 28, boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 6px" }}>Before we analyze</h3>
        <p style={{ fontSize: ".88rem", color: "#475569", margin: "0 0 20px", lineHeight: 1.55 }}>
          Review what crosses to the model. Nothing else moves until you confirm.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 18 }}>
          <PrivacyColumn
            color="#10B981"
            heading="Stays on your laptop"
            items={[
              "Audio recording",
              videoEnabled ? "Video recording" : "Video was off",
              "Raw waveform samples",
            ]}
          />
          <PrivacyColumn
            color="#F59E0B"
            heading="Crosses to district model"
            items={[
              "Transcript text",
              "Pitch variance, pace, volume range",
              videoEnabled ? "Motion intensity numbers (no frames)" : "No video data this take",
              "Question count and types",
            ]}
          />
          <PrivacyColumn
            color="#4F46E5"
            heading="Never collected anywhere"
            items={[
              "Student names",
              "Student voices",
              "Identifying audio",
            ]}
          />
        </div>
        <details style={{ marginBottom: 16, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
          <summary style={{ fontSize: ".82rem", fontWeight: 700, color: "#1E1B4B", cursor: "pointer" }}>
            Preview the transcript that will be sent
          </summary>
          <div style={{ marginTop: 10, maxHeight: 160, overflowY: "auto", fontSize: ".82rem", color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {transcript || "(empty)"}
          </div>
        </details>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 10, marginBottom: 16, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{ marginTop: 3 }}
          />
          <span style={{ fontSize: ".82rem", color: "#1E1B4B", lineHeight: 1.5 }}>
            I have reviewed the transcript and confirm no student names or identifying info are in it.
          </span>
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={secondaryBtn}>Cancel and keep everything local</button>
          <button onClick={onConfirm} disabled={!checked} style={{ ...primaryBtn, opacity: checked ? 1 : 0.5, cursor: checked ? "pointer" : "not-allowed" }}>
            Send transcript only and analyze
          </button>
        </div>
        <p style={{ marginTop: 14, fontSize: ".72rem", color: "#94A3B8", lineHeight: 1.55, margin: "14px 0 0" }}>
          Your district controls the model. Nothing is retained for training. You can clear this analysis at any time with the &ldquo;Save and finish&rdquo; button.
        </p>
      </div>
    </div>
  );
}

function PrivacyColumn({ color, heading, items }: { color: string; heading: string; items: string[] }) {
  return (
    <div style={{ padding: "12px 14px", border: `1px solid ${color}30`, background: `${color}08`, borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
        <span style={{ fontSize: ".7rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#1E1B4B" }}>{heading}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: ".8rem", color: "#334155", lineHeight: 1.55 }}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #E2E8F0",
  borderRadius: 16,
  padding: 22,
  marginBottom: 16,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

const subtleCardStyle: React.CSSProperties = {
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  padding: 16,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: ".95rem",
  fontWeight: 800,
  color: "#1E1B4B",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 18px",
  fontSize: ".88rem",
  fontWeight: 700,
  background: "#4F46E5",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  padding: "10px 18px",
  fontSize: ".88rem",
  fontWeight: 700,
  background: "white",
  color: "#1E1B4B",
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  cursor: "pointer",
};

function recordButtonStyle(active: boolean): React.CSSProperties {
  return {
    width: 64,
    height: 64,
    borderRadius: 999,
    border: "none",
    background: active ? "#1E1B4B" : "#EF4444",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: active ? "0 0 0 6px rgba(30, 27, 75, 0.12)" : "0 0 0 6px rgba(239, 68, 68, 0.15)",
    transition: "background 0.2s, box-shadow 0.2s",
  };
}

function tabBtn(active: boolean): React.CSSProperties {
  return {
    padding: "6px 12px",
    fontSize: ".75rem",
    fontWeight: 700,
    background: active ? "#1E1B4B" : "transparent",
    color: active ? "white" : "#64748B",
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    cursor: "pointer",
  };
}
