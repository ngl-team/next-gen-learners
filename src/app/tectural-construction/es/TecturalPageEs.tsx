import Mermaid from './Mermaid';

const MASTER_MMD = `flowchart TD
  subgraph FD["LA PUERTA DE ENTRADA"]
    direction LR
    WEB["Sitio web<br/>que usted edita"]
    PHONE["Teléfono +<br/>referencias"]
  end
  subgraph LEAD["CAPTURA DE CLIENTES"]
    direction LR
    FORM["Formulario web"]
    EST["Estimador IA interno<br/>elimina Instant Roofer"]
  end
  subgraph BRAIN["JARVIS - el cerebro en su laptop"]
    direction TB
    EMAIL["Asistente de correo<br/>SPRINT 1 - aquí empezamos"]
    VOICE["Perfil de voz +<br/>contactos"]
  end
  subgraph OPS["PANEL DE OPERACIONES"]
    direction LR
    CRM["Pipeline de trabajos<br/>estimado a instalación a factura"]
    INV["Factura automática<br/>al completar"]
  end
  subgraph OUT["RESULTADOS"]
    direction LR
    OWN["Usted es dueño<br/>de cada herramienta"]
    KILL["Suscripciones<br/>eliminadas"]
    TIME["Horas de vuelta<br/>cada semana"]
  end
  WEB --> FORM
  PHONE --> EMAIL
  FORM --> EST
  EST --> CRM
  EMAIL --> CRM
  EMAIL --> VOICE
  CRM --> INV
  INV --> OWN
  CRM --> KILL
  EMAIL --> TIME
  classDef front fill:#e0e7ff,stroke:#3730a3,color:#000
  classDef lead fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef brain fill:#22c55e,stroke:#15803d,color:#fff
  classDef brain2 fill:#dcfce7,stroke:#15803d,color:#000
  classDef ops fill:#fde68a,stroke:#92400e,color:#000
  classDef outcome fill:#fef3c7,stroke:#92400e,color:#000
  class WEB,PHONE front
  class FORM,EST lead
  class EMAIL brain
  class VOICE brain2
  class CRM,INV ops
  class OWN,KILL,TIME outcome`;

const EMAIL_MMD = `flowchart LR
  A["Llega un correo nuevo"] --> B["Jarvis en la laptop"]
  B --> C["Lee su perfil de voz<br/>+ respuestas anteriores"]
  C --> D["Redacta la respuesta<br/>en su voz"]
  D --> E["Usted edita 10 seg<br/>y envía"]
  B --> F["Clasificación:<br/>cliente / proveedor / equipo"]
  F --> G["Va a la<br/>carpeta correcta"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,F in
  class B,C,D ai
  class E,G out`;

const ESTIMATOR_MMD = `flowchart LR
  A["Dirección ingresada<br/>en web o por el equipo"] --> B["API de medición aérea"]
  B --> C["Área del techo + inclinación"]
  C --> D["Sus reglas de precios"]
  E["Costos de material<br/>madera / metal / EPDM / cobre"] --> D
  D --> F["Estimado PDF<br/>con su marca"]
  F --> G["Enviado al cliente<br/>+ guardado al expediente"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,E in
  class B,C,D ai
  class F,G out`;

const CRM_MMD = `flowchart TD
  A["Fuente del cliente<br/>teléfono / web / referencia"] --> B["Trabajo creado"]
  B --> C["Estimado generado<br/>con la herramienta del Sprint 2"]
  C --> D["Contrato firmado"]
  D --> E["Horario asignado<br/>+ equipo programado"]
  E --> F["Fotos de instalación<br/>+ lista de verificación"]
  F --> G["Factura se envía<br/>automáticamente"]
  G --> H["Pago entra<br/>y sincroniza con QuickBooks"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,D,F in
  class B,C,E,G ai
  class H out`;

const SITE_MMD = `flowchart LR
  A["Usted edita<br/>el contenido"] --> B["Editor visual simple"]
  B --> C["Se publica<br/>automáticamente"]
  C --> D["tecturalconstruction.com"]
  E["Estimador del<br/>Sprint 2"] --> D
  D --> F["Formulario de contacto"]
  F --> G["Va directo al<br/>asistente de correo"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,F in
  class B,C,E ai
  class D,G out`;

type Sprint = {
  num: string;
  title: string;
  badge: string;
  badgeColor: 'green' | 'gray';
  problem: string;
  plain: string;
  math: string;
  kills: string;
  ship: string;
  chart: string;
  idPrefix: string;
};

const SPRINTS: Sprint[] = [
  {
    num: '01',
    title: 'Asistente de correo',
    badge: 'AQUÍ EMPEZAMOS',
    badgeColor: 'green',
    problem: '"Estoy dos días atrasado en el correo."',
    plain:
      'Cada mañana Jarvis ya leyó los correos nuevos. Clientes, proveedores y el equipo quedan en su propia carpeta. Para las respuestas que necesitan redacción, Jarvis las escribe en su voz, aprendida de los correos anteriores. Usted lee, ajusta, y envía. Veinte minutos en vez de dos horas.',
    math: 'Cinco horas a la semana de vuelta. Más de veinte horas al mes. Al valor de su tiempo como dueño, el sprint se paga solo en el primer mes.',
    kills: 'El atraso de dos días en el correo. Los clientes que se pierden por no contestar a tiempo.',
    ship: 'Dos semanas. El mismo patrón ya entregado a un superintendente en Connecticut.',
    chart: EMAIL_MMD,
    idPrefix: 'email-es',
  },
  {
    num: '02',
    title: 'Estimador IA interno',
    badge: 'FASE 2',
    badgeColor: 'gray',
    problem: '"Me gusta Instant Roofer. No me gusta la suscripción."',
    plain:
      'Un cliente escribe una dirección. La herramienta saca la medida del techo de los datos aéreos, la pasa por las reglas de precios de Tectural (madera, metal, EPDM, cobre, Tesla Solar) y produce un estimado PDF con su marca. Usted es dueño de la fórmula, del formato, y de los datos. Cero suscripción para siempre.',
    math: 'Elimina $250 al mes directo. Tres mil al año. Treinta mil en diez años con una construcción de una sola vez.',
    kills: 'Instant Roofer a $250 al mes.',
    ship: 'Cuatro a seis semanas. Necesita conexión con la API de medición aérea y sus reglas de precios documentadas.',
    chart: ESTIMATOR_MMD,
    idPrefix: 'estimator-es',
  },
  {
    num: '03',
    title: 'Panel de trabajos + facturas',
    badge: 'FASE 3',
    badgeColor: 'gray',
    problem: '"Quiero un CRM como JobNimbus, con las facturas conectadas."',
    plain:
      'Un solo panel que usted abre cada mañana. Cada trabajo es una fila. Cuáles están en estimado, firmados, agendados, en la camioneta hoy, listos para facturar. Hace clic en un trabajo y ve las fotos, el contrato, el estado del pago. La factura se envía sola cuando el trabajo se marca como completado.',
    math: 'Un CRM como JobNimbus cuesta entre $400 y $800 al mes a su tamaño de equipo. Si lo elimina, son cuatro horas a la semana de papeleo de vuelta. El número real está cerca de $1,500 al mes recuperados.',
    kills: 'Las suscripciones tipo JobNimbus. El rastro de papel entre correo, mensajes, y el estimador.',
    ship: 'Seis a ocho semanas. Junta el Sprint 1 y el Sprint 2 en una sola pantalla.',
    chart: CRM_MMD,
    idPrefix: 'crm-es',
  },
  {
    num: '04',
    title: 'Sitio web que usted edita',
    badge: 'FASE 4',
    badgeColor: 'gray',
    problem: '"Nadie lo construye como yo lo quiero."',
    plain:
      'Un sitio limpio, hecho una vez, editado por usted con un editor sencillo. El estimador del Sprint 2 vive en la página principal y captura clientes apenas entran. El formulario de contacto va directo al asistente de correo. Ya no hay que esperar a un contratista para cambiar un título.',
    math: 'Elimina el gasto recurrente con el contratista de sitios web. La puerta de entrada empieza a convertir visitantes en vez de quedarse quieta.',
    kills: 'El pago recurrente al contratista de sitios web. La diferencia entre lo que usted quiere y lo que recibe.',
    ship: 'Tres a cuatro semanas, una vez que exista el Sprint 2.',
    chart: SITE_MMD,
    idPrefix: 'site-es',
  },
];

function SprintCard({ s }: { s: Sprint }) {
  const badgeBg = s.badgeColor === 'green' ? '#15803d' : '#475569';
  return (
    <section
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(15,23,42,0.10)',
        borderRadius: 20,
        padding: 'clamp(24px, 4vw, 40px)',
        marginBottom: 32,
        boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8', fontSize: 14, letterSpacing: '0.08em' }}>
          SPRINT {s.num}
        </span>
        <span
          style={{
            background: badgeBg,
            color: '#fff',
            fontSize: 11,
            letterSpacing: '0.12em',
            padding: '3px 10px',
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {s.badge}
        </span>
      </div>
      <h3
        style={{
          fontSize: 'clamp(24px, 3.5vw, 32px)',
          fontWeight: 700,
          color: '#0f172a',
          margin: '0 0 12px',
          lineHeight: 1.15,
        }}
      >
        {s.title}
      </h3>
      <p
        style={{
          fontSize: 18,
          color: '#475569',
          fontStyle: 'italic',
          margin: '0 0 24px',
        }}
      >
        {s.problem}
      </p>

      <div style={{ marginBottom: 24 }}>
        <Mermaid chart={s.chart} idPrefix={s.idPrefix} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            CÓMO FUNCIONA
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: 0 }}>{s.plain}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            CUÁNTO VALE
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: '0 0 16px' }}>{s.math}</p>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            QUÉ ELIMINA
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: '0 0 16px' }}>{s.kills}</p>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            TIEMPO DE ENTREGA
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: 0 }}>{s.ship}</p>
        </div>
      </div>
    </section>
  );
}

export default function TecturalPageEs() {
  return (
    <main
      style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        color: '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 24px 0',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <a
          href="/tectural-construction"
          style={{
            fontSize: 13,
            color: '#475569',
            textDecoration: 'none',
            border: '1px solid rgba(15,23,42,0.12)',
            padding: '6px 12px',
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          EN · English
        </a>
      </div>

      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #15803d 100%)',
          color: '#fff',
          padding: 'clamp(48px, 10vw, 96px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              color: '#86efac',
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            TECTURAL CONSTRUCTION · MAPA DE IA · MAYO 2026
          </p>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.05,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
            }}
          >
            El sistema todo-en-uno,
            <br />
            hecho en casa.
          </h1>
          <p
            style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 760,
              margin: 0,
            }}
          >
            Cuatro herramientas, conectadas a cómo Tectural ya trabaja. Correo,
            estimados, panel de trabajos, sitio personalizado. Usted es el dueño de
            cada una. Cero suscripciones para siempre. Antes de fin de verano, todo
            el sistema está en casa.
          </p>
        </div>
      </header>

      <section
        style={{
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            color: '#15803d',
            margin: '0 0 12px',
            fontWeight: 700,
          }}
        >
          EL CUADRO COMPLETO
        </p>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            margin: '0 0 12px',
            letterSpacing: '-0.01em',
          }}
        >
          Cómo se conectan las cuatro herramientas
        </h2>
        <p
          style={{
            fontSize: 17,
            color: '#475569',
            lineHeight: 1.55,
            maxWidth: 720,
            margin: '0 0 32px',
          }}
        >
          El nodo verde es donde empezamos. La fila amarilla es lo que usted recibe
          al final. Todo lo del medio se construye una vez y se queda con usted
          para siempre.
        </p>
        <Mermaid chart={MASTER_MMD} idPrefix="tectural-master-es" />
      </section>

      <section
        style={{
          padding: 'clamp(24px, 4vw, 48px) clamp(24px, 5vw, 64px) clamp(48px, 8vw, 96px)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            color: '#15803d',
            margin: '0 0 12px',
            fontWeight: 700,
          }}
        >
          LOS CUATRO SPRINTS
        </p>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            margin: '0 0 32px',
            letterSpacing: '-0.01em',
          }}
        >
          Uno se entrega primero. Los demás siguen.
        </h2>
        {SPRINTS.map((s) => (
          <SprintCard key={s.num} s={s} />
        ))}
      </section>

      <section
        style={{
          background: '#0f172a',
          color: '#fff',
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              color: '#86efac',
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            TRANSPARENCIA TOTAL
          </p>
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 34px)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0 0 20px',
            }}
          >
            Si toma este mapa y lo construye usted mismo, está bien.
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.82)',
              margin: '0 0 12px',
            }}
          >
            Déselo a su persona de IT. Contrate a alguien más. Tiene un camino para
            adelante de cualquier forma. Ese es el punto de esta página.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.82)',
              margin: 0,
            }}
          >
            La razón por la que me pagaría a mí para hacerlo es la velocidad.
            Asistente de correo en su laptop en dos semanas. El sistema completo
            antes de fin de verano. Usted es el dueño de cada pieza cuando salga.
          </p>
        </div>
      </section>

      <footer
        style={{
          background: '#F8FAFC',
          padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 64px)',
          textAlign: 'center',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <p style={{ fontSize: 14, color: '#475569', margin: '0 0 8px' }}>
          Hecho para Tectural. Mayo 2026.
        </p>
        <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}
          >
            brayan@nextgenerationlearners.com
          </a>
        </p>
      </footer>
    </main>
  );
}
