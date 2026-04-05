'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  BookOpenIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function TypingEffect({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedChars < currentWord.length) {
      timeout = setTimeout(() => setDisplayedChars(displayedChars + 1), 80);
    } else if (!isDeleting && displayedChars === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedChars > 0) {
      timeout = setTimeout(() => setDisplayedChars(displayedChars - 1), 40);
    } else if (isDeleting && displayedChars === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedChars, isDeleting, currentWordIndex, words]);

  return (
    <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
      {words[currentWordIndex].substring(0, displayedChars)}
      <span className="typing-cursor" />
    </span>
  );
}

export default function Home() {
  useScrollReveal();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-28 md:py-36">
        {/* Floating Orbs */}
        <div className="orb orb-1 w-[400px] h-[400px] bg-[#4F46E5] top-[-100px] left-[-100px]" />
        <div className="orb orb-2 w-[300px] h-[300px] bg-[#7C3AED] top-[50%] right-[-80px]" />
        <div className="orb orb-3 w-[350px] h-[350px] bg-[#06B6D4] bottom-[-120px] left-[30%]" />
        <div className="orb orb-4 w-[250px] h-[250px] bg-[#10B981] top-[20%] left-[60%]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-[0.16em] px-5 py-2 rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              AI Literacy Programs
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white">
              Teaching Students to{' '}
              <TypingEffect words={['Think With AI', 'Build With AI', 'Lead With AI']} />
              <br />
              <span className="text-white/90">Not Just Use It.</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Hands-on AI literacy programs that connect technology to students&rsquo; real interests. We build tools for thinking, not shortcuts for answers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#programs">
                <button className="btn-shimmer bg-[#10B981] text-white px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#059669] hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:-translate-y-px transition-all duration-200">
                  View Programs
                </button>
              </Link>
              <Link href="/superintendents">
                <button className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-white/20 hover:-translate-y-px transition-all duration-200">
                  For Educators
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 max-w-4xl mx-auto mt-16 px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-white">
                  <CountUp end={3} />
                </div>
                <div className="text-white/60 text-xs uppercase tracking-[0.12em] mt-1 font-medium">Library Programs</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-white">
                  <CountUp end={4} />
                </div>
                <div className="text-white/60 text-xs uppercase tracking-[0.12em] mt-1 font-medium">Session Curriculum</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-white">
                  <CountUp end={50} suffix="+" />
                </div>
                <div className="text-white/60 text-xs uppercase tracking-[0.12em] mt-1 font-medium">Students Trained</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-white">
                  K-8
                </div>
                <div className="text-white/60 text-xs uppercase tracking-[0.12em] mt-1 font-medium">Grade Range</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-28 px-4 bg-[#FAFBFF]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="fade-up text-xs font-bold uppercase tracking-[0.22em] text-[#4F46E5] mb-3">Our Philosophy</p>
          <h2 className="fade-up text-3xl md:text-4xl font-extrabold mb-6 text-[#1E1B4B]">Different Means, Same End.</h2>
          <p className="fade-up text-base md:text-lg text-[#64748B] max-w-3xl mx-auto mb-14 leading-relaxed">
            Whether your child is interested in coding, digital art, music, or entrepreneurship, they will use their passion as a &quot;means&quot; to achieve the same &quot;end&quot;: AI Literacy and Critical Thinking. We achieve these ends through different means, where student education is tailored to their specific interests.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fade-up fade-up-delay-1 card-hover card-hover-indigo bg-white rounded-2xl p-7 border border-indigo-100 border-t-4 border-t-[#4F46E5]">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5 mx-auto">
                <LightBulbIcon className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <h4 className="text-lg font-bold text-[#1E1B4B]">Prompt Engineering</h4>
              <p className="text-[#64748B] text-sm mt-2">Learning to communicate clearly with AI tools through precise, thoughtful prompts.</p>
            </div>
            <div className="fade-up fade-up-delay-2 card-hover card-hover-violet bg-white rounded-2xl p-7 border border-violet-100 border-t-4 border-t-[#7C3AED]">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-5 mx-auto">
                <ShieldCheckIcon className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <h4 className="text-lg font-bold text-[#1E1B4B]">Output Verification</h4>
              <p className="text-[#64748B] text-sm mt-2">Critical thinking skills to evaluate and verify what AI produces before trusting it.</p>
            </div>
            <div className="fade-up fade-up-delay-3 card-hover card-hover-emerald bg-white rounded-2xl p-7 border border-emerald-100 border-t-4 border-t-[#10B981]">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 mx-auto">
                <AcademicCapIcon className="w-6 h-6 text-[#10B981]" />
              </div>
              <h4 className="text-lg font-bold text-[#1E1B4B]">Ethical Reasoning</h4>
              <p className="text-[#64748B] text-sm mt-2">Understanding the ethical implications and responsibilities of using AI technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Selection Section */}
      <section id="programs" className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="fade-up text-xs font-bold uppercase tracking-[0.22em] text-[#4F46E5] mb-3 text-center">Programs</p>
          <h2 className="fade-up text-3xl md:text-4xl font-extrabold text-center mb-14 text-[#1E1B4B]">
            Choose Your Learning Path
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card A: Library Programs */}
            <div className="fade-up fade-up-delay-1 card-hover card-hover-indigo bg-[#FAFBFF] rounded-3xl overflow-hidden border border-indigo-100 flex flex-col justify-between">
              <div className="p-8 md:p-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-6">
                  <BookOpenIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#1E1B4B]">Library Programs</h3>
                <p className="text-[#64748B] text-base leading-relaxed">Hands-on workshops like the &apos;AI Thinkers &amp; Builders Club&apos; for public libraries. No prep required from staff.</p>
              </div>
              <div className="p-8 md:p-10 pt-0">
                <Link href="/libraries">
                  <button className="w-full btn-shimmer bg-[#4F46E5] text-white py-3.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#4338CA] hover:shadow-[0_8px_24px_rgba(79,70,229,0.3)] hover:-translate-y-px transition-all duration-200">
                    For Librarians
                  </button>
                </Link>
              </div>
            </div>

            {/* Card B: After School */}
            <div className="fade-up fade-up-delay-2 card-hover card-hover-violet bg-[#FAFBFF] rounded-3xl overflow-hidden border border-violet-100 flex flex-col justify-between">
              <div className="p-8 md:p-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mb-6">
                  <RocketLaunchIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#1E1B4B]">After School Accelerators</h3>
                <p className="text-[#64748B] text-base leading-relaxed">Structured multi-week programs for schools and parent-enrolled students. Turn screen time into creation time.</p>
              </div>
              <div className="p-8 md:p-10 pt-0">
                <Link href="/after-school">
                  <button className="w-full btn-shimmer bg-[#7C3AED] text-white py-3.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#6D28D9] hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:-translate-y-px transition-all duration-200">
                    For Parents
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Organizations Section */}
      <section className="py-20 md:py-28 bg-[#FAFBFF]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="fade-up text-xs font-bold uppercase tracking-[0.22em] text-[#4F46E5] mb-3 text-center">Credibility</p>
          <h2 className="fade-up text-3xl font-extrabold text-center mb-4 text-[#1E1B4B]">Trusted Organizations</h2>
          <p className="fade-up text-center text-[#64748B] text-base mb-14">Empowering students through partnerships with leading schools and libraries.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Babson College', type: 'Founder & Student' },
              { name: 'Danbury Library', type: 'Pilot Program' },
              { name: 'Ridgefield Library', type: 'Spring Program' },
              { name: 'Wooster School', type: 'Student & Faculty' },
              { name: 'Woodstock Public Schools', type: 'Professional Dev' },
              { name: 'Danbury High School', type: 'AI Literacy' },
            ].map((partner, i) => (
              <div key={partner.name} className={`fade-up fade-up-delay-${Math.min(i + 1, 5)} card-hover bg-white rounded-2xl p-6 text-center border border-slate-100 cursor-default`}>
                <span className="text-base font-bold text-[#1E1B4B]">{partner.name}</span>
                <span className="block mt-2 text-xs font-medium text-[#4F46E5] bg-indigo-50 rounded-full px-3 py-1 inline-block mx-auto">{partner.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]" />
        {/* Floating decorative elements */}
        <div className="orb orb-1 w-[200px] h-[200px] bg-white/10 top-[-50px] right-[-50px]" />
        <div className="orb orb-2 w-[150px] h-[150px] bg-white/10 bottom-[-30px] left-[-30px]" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="fade-up text-xs font-bold uppercase tracking-[0.22em] text-white/60 mb-3">Stay Connected</p>
          <h2 className="fade-up text-3xl font-extrabold mb-4 text-white">Join the AI Literacy Journey</h2>
          <p className="fade-up text-white/70 text-base mb-8">Get weekly AI thinking prompts and program updates delivered to your inbox.</p>
          <div className="fade-up flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-5 py-3.5 rounded-xl bg-white text-[#1E1B4B] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 text-sm font-medium"
            />
            <button className="btn-shimmer bg-[#10B981] text-white px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#059669] hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:-translate-y-px transition-all duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      {/* Team Login */}
      <footer className="py-6 text-center border-t border-[#E2E8F0]">
        <a href="/dashboard" className="text-xs text-[#94A3B8] hover:text-[#4F46E5] transition-colors">Team Login</a>
      </footer>
    </main>
  );
}
