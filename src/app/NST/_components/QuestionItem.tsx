'use client';

import { useEffect, useRef, useState } from 'react';

export type Question = {
  id: string;
  type: 'mc' | 'open';
  prompt: string;
  choices?: string[];
  answer?: number;
  rubric?: string;
  explanation?: string;
  class_key?: string;
  class_title?: string;
};

type Props = {
  q: Question;
  index: number;
  classKey: string;
  mode?: 'study' | 'exam' | 'review' | 'drill';
  initial?: { answer?: string; correct?: number | null };
  showTag?: boolean;
  initialBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
};

export default function QuestionItem({ q, index, classKey, mode = 'study', initial, showTag = false, initialBookmarked = false, onBookmarkChange }: Props) {
  const [picked, setPicked] = useState<number | null>(() => {
    if (q.type !== 'mc' || !initial?.answer) return null;
    const n = Number(initial.answer);
    return Number.isFinite(n) ? n : null;
  });
  const [correctIndex, setCorrectIndex] = useState<number | null>(() =>
    initial && initial.correct !== undefined ? (q.answer ?? null) : null
  );
  const [feedback, setFeedback] = useState<string | null>(() => {
    if (q.type !== 'mc' || initial?.correct == null) return null;
    return initial.correct ? 'correct' : 'incorrect';
  });
  const [text, setText] = useState<string>(initial?.answer ?? '');
  const [saved, setSaved] = useState('');
  const [showRubric, setShowRubric] = useState(false);
  const [bookmarked, setBookmarked] = useState<boolean>(initialBookmarked);
  const lastSave = useRef<number>(0);

  const effectiveClassKey = q.class_key || classKey;

  const toggleBookmark = async () => {
    const next = !bookmarked;
    setBookmarked(next);
    onBookmarkChange?.(next);
    try {
      await fetch('/api/nst/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: q.id, class_key: effectiveClassKey, on: next }),
      });
    } catch {
      setBookmarked(!next);
      onBookmarkChange?.(!next);
    }
  };

  const submitMc = (idx: number) => {
    setPicked(idx);
    if (typeof q.answer === 'number') {
      setCorrectIndex(q.answer);
      setFeedback(idx === q.answer ? 'correct' : 'incorrect');
    }
    fetch('/api/nst/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: q.id,
        class_key: effectiveClassKey,
        answer: String(idx),
        mode,
      }),
    }).catch(() => {});
  };

  const saveOpen = async (value: string) => {
    await fetch('/api/nst/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: q.id,
        class_key: effectiveClassKey,
        answer: value,
        mode,
      }),
    });
  };

  useEffect(() => {
    if (q.type !== 'open') return;
    const id = setTimeout(() => {
      if (text.length > 0 && Date.now() - lastSave.current > 3500) {
        lastSave.current = Date.now();
        saveOpen(text).then(() => {
          setSaved('Auto-saved.');
          setTimeout(() => setSaved(''), 1500);
        });
      }
    }, 4000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="q">
      <div className="qnum">
        Q{index + 1}
        <span className={`pill ${q.type}`}>{q.type === 'mc' ? 'MC' : 'Open'}</span>
        {showTag && q.class_title && <span className="tag">{q.class_title}</span>}
        <button
          className={`bookmark-btn ${bookmarked ? 'on' : ''}`}
          onClick={toggleBookmark}
          title={bookmarked ? 'Saved for review — click to remove' : 'Save for review'}
          aria-label={bookmarked ? 'Saved for review' : 'Save for review'}
        >
          {bookmarked ? '★ Saved' : '☆ Save for review'}
        </button>
      </div>
      <div className="prompt">{q.prompt}</div>
      {q.type === 'mc' ? (
        <>
          <div className="choices">
            {q.choices?.map((choice, i) => {
              let cls = 'choice';
              if (picked === i && feedback === 'correct') cls += ' correct';
              else if (picked === i && feedback === 'incorrect') cls += ' incorrect';
              else if (picked !== null && correctIndex === i && feedback === 'incorrect') cls += ' correct';
              return (
                <button key={i} className={cls} onClick={() => submitMc(i)}>
                  {choice}
                </button>
              );
            })}
          </div>
          <div className="feedback">
            {feedback === 'correct' && <span className="ok">Correct.</span>}
            {feedback === 'incorrect' && <span className="bad">Not quite. Correct answer highlighted.</span>}
          </div>
          {feedback && q.explanation && (
            <div className="explanation"><strong>Why:</strong> {q.explanation}</div>
          )}
        </>
      ) : (
        <>
          <div className="brevity-hint">Be concise. 3 words to 3 sentences per part — the professor grades for efficiency.</div>
          <textarea
            className="open-answer"
            placeholder="Type your answer (3 words to 3 sentences per part)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="open-actions">
            <button
              className="primary"
              onClick={async () => {
                await saveOpen(text);
                setSaved('Saved.');
                setTimeout(() => setSaved(''), 1800);
              }}
            >
              Save answer
            </button>
            <button className="ghost" onClick={() => setShowRubric((v) => !v)}>
              {showRubric ? 'Hide rubric' : 'Reveal rubric'}
            </button>
            <span className="saved-tag">{saved}</span>
          </div>
          {showRubric && q.rubric && (
            <div className="rubric">
              <strong>Rubric / model answer:</strong>
              <div>{q.rubric}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
