import type { Metadata } from 'next';
import NelsonPage from '../NelsonPage';
import { ES } from '../content';

export const metadata: Metadata = {
  title: ES.meta.title,
  description: ES.meta.description,
  alternates: {
    canonical: '/nelson/es',
    languages: {
      en: '/nelson',
      es: '/nelson/es',
    },
  },
  openGraph: {
    title: ES.meta.ogTitle,
    description: ES.meta.ogDescription,
    images: ['/nelson-merchan.jpg'],
    locale: 'es_US',
  },
};

export default function Page() {
  return <NelsonPage content={ES} />;
}
