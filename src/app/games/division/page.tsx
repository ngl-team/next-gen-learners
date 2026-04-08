'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Problem {
  dividend: number;
  divisor: number;
  answer: number;
}

function generateProblem(): Problem {
  const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
  const answer = Math.floor(Math.random() * 9) + 2; // 2-10
  const dividend = divisor * answer; // always clean division
  return { dividend, divisor, answer };
}

const ENCOURAGEMENTS = [
  "Nice! 🔥",
  "You got it! 💪",
  "Easy money! 🎯",
  "Let's go! 🚀",
  "Too easy for you! ⚡",
  "On fire! 🔥🔥",
  "Big brain! 🧠",
  "Smooth! 😎",
];

const WRONG_MESSAGES = [
  "Almost! Try again 💪",
  "Not quite — you got this!",
  "So close! One more try",
  "Keep going! 🧠",
];

export default function DivisionGame() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'correct' | 'wrong' | ''>('');
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [popCorrect, setPopCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [selectedTime, setSelectedTime] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setInput('');
    setMessage('');
    setMessageType('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const startGame = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setGameOver(false);
    setGameStarted(true);
    nextProblem();
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameStarted, gameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !input.trim() || gameOver) return;

    const userAnswer = parseInt(input, 10);
    setTotalAnswered(prev => prev + 1);

    if (userAnswer === problem.answer) {
      const newStreak = streak + 1;
      const bonus = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setScore(prev => prev + (10 * bonus));
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      setTotalCorrect(prev => prev + 1);
      setMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
      setMessageType('correct');
      setPopCorrect(true);
      setTimeout(() => setPopCorrect(false), 400);
      setTimeout(() => nextProblem(), 600);
    } else {
      setStreak(0);
      setMessage(WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]);
      setMessageType('wrong');
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
      setInput('');
      inputRef.current?.focus();
    }
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="text-8xl mb-6">➗</div>
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
            Division Dash
          </h1>
          <p className="text-[#a5b4fc] text-lg mb-10">
            How many division facts can you nail before time runs out?<br />
            Two-digit ÷ one-digit. No calculator. Just you.
          </p>

          <p className="text-white/60 text-sm uppercase tracking-widest mb-4 font-semibold">Pick your time</p>
          <div className="flex gap-4 justify-center mb-8">
            {[30, 60, 120].map(sec => (
              <button
                key={sec}
                onClick={() => startGame(sec)}
                className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#818cf8] rounded-2xl text-white font-bold text-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {sec}s
                <span className="block text-xs font-normal text-white/50 mt-1">
                  {sec === 30 ? 'Sprint' : sec === 60 ? 'Classic' : 'Marathon'}
                </span>
              </button>
            ))}
          </div>

          <p className="text-white/30 text-xs">
            Streak bonuses: 3+ = 2x points · 5+ = 3x points
          </p>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-6">
            {score >= 200 ? '🏆' : score >= 100 ? '⭐' : '💪'}
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Time&apos;s Up!</h2>
          <p className="text-[#a5b4fc] text-lg mb-10">Here&apos;s how you did</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <p className="text-3xl font-extrabold text-[#818cf8]">{score}</p>
              <p className="text-white/50 text-sm mt-1">Points</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <p className="text-3xl font-extrabold text-[#34d399]">{totalCorrect}</p>
              <p className="text-white/50 text-sm mt-1">Correct</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <p className="text-3xl font-extrabold text-[#fbbf24]">{bestStreak}</p>
              <p className="text-white/50 text-sm mt-1">Best Streak</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <p className="text-3xl font-extrabold text-[#f472b6]">{accuracy}%</p>
              <p className="text-white/50 text-sm mt-1">Accuracy</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => startGame(selectedTime)}
              className="px-8 py-4 bg-[#818cf8] hover:bg-[#6366f1] text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Play Again
            </button>
            <button
              onClick={() => { setGameStarted(false); setGameOver(false); }}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Change Time
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  const timerPercent = (timeLeft / selectedTime) * 100;
  const timerColor = timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#fbbf24' : '#34d399';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-4">
      {/* Top bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Score</span>
            <span className={`text-2xl font-extrabold text-white transition-transform ${popCorrect ? 'scale-125' : 'scale-100'}`}>
              {score}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {streak >= 3 && (
              <span className="text-xs font-bold bg-[#fbbf24]/20 text-[#fbbf24] px-2 py-1 rounded-full">
                {streak >= 5 ? '3x' : '2x'} BONUS
              </span>
            )}
            <span className="text-white/60 text-sm">🔥 {streak}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold" style={{ color: timerColor }}>
              {timeLeft}s
            </span>
          </div>
        </div>
        {/* Timer bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
          />
        </div>
      </div>

      {/* Problem card */}
      {problem && (
        <div className={`bg-white/5 border border-white/10 rounded-3xl p-10 w-full max-w-md text-center backdrop-blur-sm ${shakeWrong ? 'animate-shake' : ''}`}>
          <div className="mb-8">
            <span className="text-7xl font-extrabold text-white tracking-tight">
              {problem.dividend}
            </span>
            <span className="text-4xl text-[#818cf8] font-bold mx-4">÷</span>
            <span className="text-7xl font-extrabold text-white tracking-tight">
              {problem.divisor}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="?"
              autoFocus
              className="w-32 text-center text-4xl font-extrabold bg-white/10 border-2 border-white/20 focus:border-[#818cf8] rounded-2xl py-3 text-white placeholder-white/20 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="submit" className="sr-only">Submit</button>
          </form>

          {/* Feedback */}
          <div className="h-10 mt-6 flex items-center justify-center">
            {message && (
              <p className={`text-lg font-bold animate-fade-in ${messageType === 'correct' ? 'text-[#34d399]' : 'text-[#f472b6]'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      <p className="text-white/20 text-xs mt-8">
        Type your answer and hit Enter
      </p>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
