import type { Metadata } from 'next';
import TecturalPage from './TecturalPage';

export const metadata: Metadata = {
  title: 'Tectural Construction · The All-in-One System, Built In-House',
  description:
    "Four AI tools, mapped to Tectural's workflow. Owned by Jamil, not rented. Start with the email assistant. Ship the rest by end of summer.",
  alternates: { canonical: '/tectural-construction' },
  openGraph: {
    title: 'Tectural Construction · AI Built In-House',
    description:
      'The all-in-one system Jamil asked for. Email assistant, in-house estimator, job pipeline, custom site. He owns every tool.',
    locale: 'en_US',
  },
};

export default function Page() {
  return <TecturalPage />;
}
