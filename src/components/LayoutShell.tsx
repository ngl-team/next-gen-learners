'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGame = pathname.startsWith('/games');
  const isSuperintendent = pathname.startsWith('/superintendent');
  const isTransfer = pathname.startsWith('/transfer');
  const isNst = pathname.startsWith('/NST') || pathname.startsWith('/nst');
  const isDh = pathname.startsWith('/danburyhackerspace');
  const isNelson = pathname.startsWith('/nelson');
  const hide = isGame || isSuperintendent || isTransfer || isNst || isDh || isNelson;

  return (
    <>
      {!hide && <Navbar />}
      <div className="relative z-[1]">
        {children}
      </div>
      {!hide && (
        <footer className="relative z-[1] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-white text-sm font-bold uppercase tracking-[0.14em] mb-3">
              Next Generation Learners
            </p>
            <p className="text-white/60 text-sm">
              &copy; 2026 Next Generation Learners. Founded at Babson College.
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
