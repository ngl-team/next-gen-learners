import type { Metadata } from 'next';
import TecturalPageEs from './TecturalPageEs';

export const metadata: Metadata = {
  title: 'Tectural Construction · El sistema todo-en-uno, hecho en casa',
  description:
    'Cuatro herramientas de IA, conectadas al flujo de trabajo de Tectural. Usted es el dueño de cada una. Empezamos con el asistente de correo. El resto se construye antes de fin de verano.',
  alternates: {
    canonical: '/tectural-construction/es',
    languages: {
      en: '/tectural-construction',
      es: '/tectural-construction/es',
    },
  },
  openGraph: {
    title: 'Tectural Construction · IA hecha en casa',
    description:
      'El sistema todo-en-uno que usted pidió. Asistente de correo, estimador interno, panel de trabajos, sitio personalizado. Usted es el dueño de todo.',
    locale: 'es_US',
  },
};

export default function Page() {
  return <TecturalPageEs />;
}
