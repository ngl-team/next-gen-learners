import type { Metadata } from 'next';
import CustomerPortal from './CustomerPortal';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: 'Your project · Tectural Construction',
    description: 'Track your roof or solar install with Tectural Construction.',
    alternates: { canonical: `/tectural-construction/customer/${id}` },
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerPortal id={id} />;
}
