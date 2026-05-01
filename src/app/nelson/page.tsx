import type { Metadata } from 'next';
import NelsonPage from './NelsonPage';
import { EN } from './content';

export const metadata: Metadata = {
  title: EN.meta.title,
  description: EN.meta.description,
  alternates: {
    canonical: '/nelson',
    languages: {
      en: '/nelson',
      es: '/nelson/es',
    },
  },
  openGraph: {
    title: EN.meta.ogTitle,
    description: EN.meta.ogDescription,
    images: ['/nelson-merchan.jpg'],
    locale: 'en_US',
  },
};

export default function Page() {
  return <NelsonPage content={EN} />;
}
