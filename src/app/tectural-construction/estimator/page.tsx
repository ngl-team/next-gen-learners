import type { Metadata } from 'next';
import TecturalEstimator from './TecturalEstimator';

export const metadata: Metadata = {
  title: 'Tectural · Instant Roof Estimate',
  description: 'Enter your address and see an instant roof estimate. Built for Tectural Construction.',
  alternates: { canonical: '/tectural-construction/estimator' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TecturalEstimator />;
}
