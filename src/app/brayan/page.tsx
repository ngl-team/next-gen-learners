import type { Metadata } from 'next';
import BrayanPage from './BrayanPage';

export const metadata: Metadata = {
  title: 'Brayan Tenesaca',
  description: 'Brayan Tenesaca — builder, Babson ’28.',
  alternates: { canonical: '/brayan' },
  openGraph: {
    title: 'Brayan Tenesaca',
    description: 'Brayan Tenesaca — builder, Babson ’28.',
    locale: 'en_US',
  },
};

export default function Page() {
  return <BrayanPage />;
}
