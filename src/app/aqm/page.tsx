import type { Metadata } from 'next';
import AqmPage from './AqmPage';

export const metadata: Metadata = {
  title: 'AQM 2000 Final Prep',
  description: 'Personal study tool for AQM 2000 — practice quiz, R code reference, study guide, and trap drill.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AqmPage />;
}
