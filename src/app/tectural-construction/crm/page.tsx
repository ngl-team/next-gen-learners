import type { Metadata } from 'next';
import TecturalCRM from './TecturalCRM';

export const metadata: Metadata = {
  title: 'Tectural CRM · V1',
  description: 'Job pipeline dashboard for Tectural Construction. Built live, owned by Jamil.',
  alternates: { canonical: '/tectural-construction/crm' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TecturalCRM />;
}
