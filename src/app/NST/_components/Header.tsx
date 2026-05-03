'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header({ name }: { name: string | null }) {
  const router = useRouter();
  const logout = async () => {
    await fetch('/api/nst/logout', { method: 'POST' });
    router.push('/NST/login');
  };
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/NST">NST Final Prep</Link>
        {name && (
          <nav className="nav">
            <Link href="/NST">Dashboard</Link>
            <Link href="/NST/notecard">Notecard</Link>
            <Link href="/NST/flashcards">Flashcards</Link>
            <Link href="/NST/equations">Equations</Link>
            <Link href="/NST/drill">Drill open</Link>
            <Link href="/NST/saved">Saved ★</Link>
            <Link href="/NST/review">Review wrong</Link>
            <Link href="/NST/exam">Simulate Final</Link>
            <Link href="/NST/compare">Compare</Link>
            <span className="user">hi, {name}</span>
            <button className="logout" onClick={logout}>Logout</button>
          </nav>
        )}
      </div>
    </header>
  );
}
