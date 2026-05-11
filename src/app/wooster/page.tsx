import type { Metadata } from 'next';
import WoosterPage from './WoosterPage';

export const metadata: Metadata = {
  title: 'Matt Byrnes · Wooster School — AI Cabinet Architecture',
  description:
    "The architecture for Wooster's next 100 years. Six agents. Two tiers. One framework, owned by Wooster, anchored at the March 8, 2027 Centennial Speaker Series.",
  alternates: { canonical: '/wooster' },
  openGraph: {
    title: 'Wooster · The Centennial AI Cabinet',
    description:
      'A six-agent architecture answering the March 17 framework brief, anchored at the March 8, 2027 Centennial Speaker Series.',
    locale: 'en_US',
  },
};

export default function Page() {
  return <WoosterPage />;
}
