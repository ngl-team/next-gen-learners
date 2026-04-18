import type { Metadata } from 'next';
import './nst.css';

export const metadata: Metadata = {
  title: 'NST Final Prep — Next Generation Learners',
  description: 'Study app for NST1010 (Science & Technology of Space). Practice MC and open-response questions drawn from every class and lab.',
};

export default function NstLayout({ children }: { children: React.ReactNode }) {
  return <div className="nst">{children}</div>;
}
