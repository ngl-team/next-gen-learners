export type Service = { label: string; body: string };
export type Role = { org: string; role: string; sub: string };
export type Testimonial = { quote: string; name: string; role: string; where: string };
export type Recognition = { year: string; body: string; org: string };
export type Stat = { num: number; suffix: string; label: string; sub: string };
export type ContactRow = { k: string; v: string; v2?: string; href: string | null };

export type NelsonContent = {
  lang: 'en' | 'es';
  altLang: 'en' | 'es';
  altHref: string;
  altLabel: string;
  switchAria: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  hero: {
    eyebrow: string;
    nameFirst: string;
    nameSecond: string;
    tag: string;
    metaRole: string;
    metaRoleVal: string;
    metaOrg: string;
    metaOrgVal: string;
    metaLang: string;
    metaLangVal: string;
    ctaPrimary: string;
    ctaGhost: string;
    photoBadge: string;
    photoAlt: string;
  };
  work: {
    eyebrow: string;
    body: string;
  };
  stats: Stat[];
  services: {
    eyebrow: string;
    h1: string;
    h2Italic: string;
    h3: string;
    lead: string;
    items: Service[];
  };
  receipts: {
    eyebrow: string;
    h1: string;
    h2Italic: string;
    lead: string;
    items: Testimonial[];
  };
  caseStudy: {
    eyebrow: string;
    h1: string;
    h2Italic: string;
    body: string;
    stats: { num: string; label: string }[];
  };
  roles: {
    eyebrow: string;
    h1: string;
    h2Italic: string;
    lead: string;
    items: Role[];
  };
  recognition: {
    eyebrow: string;
    headline: string;
    items: Recognition[];
  };
  throughline: {
    eyebrow: string;
    h1: string;
    h2Italic: string;
    paragraphs: string[];
  };
  reach: {
    eyebrow: string;
    h1: string;
    h2Italic: string;
    body: string;
    ctaPrimary: string;
    ctaGhost: string;
    contact: ContactRow[];
  };
  footer: {
    bio: string;
    sourcesLabel: string;
    sources: { label: string; href: string }[];
    giftedByLabel: string;
    giftedByName: string;
    company: string;
    disclaimer: string;
  };
};

const SHARED_SOURCES = [
  { label: 'CT SBDC profile', href: 'https://ctsbdc.uconn.edu/person/nelson-merchan/' },
  { label: 'Greater Danbury Chamber', href: 'https://www.danburychamber.com/community/ctsbdc/' },
  { label: 'Westfair Hispanic Innovators', href: 'https://ctsbdc.uconn.edu/news_events/ctsbdc-advisor-nelson-merchan-honored-as-innovator/' },
  { label: 'Patch: Habitat board', href: 'https://patch.com/connecticut/danbury/nelson-merchan-elected-habitat-board-directors' },
  { label: "Aquila's Nest case study", href: 'https://ctsbdc.uconn.edu/success_stories/aquilas-nest-vineyards/' },
];

export const EN: NelsonContent = {
  lang: 'en',
  altLang: 'es',
  altHref: '/nelson/es',
  altLabel: 'ES',
  switchAria: 'Cambiar a español',
  meta: {
    title: 'Nelson Merchan. Greater Danbury’s entry point for entrepreneurs.',
    description:
      'Nelson Merchan is a Business Advisor with the Connecticut Small Business Development Center. For more than a decade, he has been the first call entrepreneurs in Danbury, Ridgefield, New Milford, and Southbury make when they want to build something real.',
    ogTitle: 'Nelson Merchan',
    ogDescription:
      'For more than a decade, Greater Danbury’s entrepreneurs have started with one phone call. This is his.',
  },
  hero: {
    eyebrow: 'Greater Danbury · Western Connecticut',
    nameFirst: 'Nelson',
    nameSecond: 'Merchan.',
    tag: "Greater Danbury's entry point for entrepreneurs. For more than a decade, the first call when someone in Western Connecticut decides to build something real.",
    metaRole: 'Role',
    metaRoleVal: 'Business Advisor',
    metaOrg: 'Org',
    metaOrgVal: 'CT SBDC · UConn',
    metaLang: 'Languages',
    metaLangVal: 'English / Spanish',
    ctaPrimary: 'Start the conversation',
    ctaGhost: 'See the work',
    photoBadge: 'CT SBDC · UConn',
    photoAlt: 'Nelson Merchan, Business Advisor at the Connecticut Small Business Development Center',
  },
  work: {
    eyebrow: 'The work',
    body: 'Nelson advises Greater Danbury entrepreneurs at no cost. He is the version of Connecticut’s Small Business Development Center that picks up the phone.',
  },
  stats: [
    { num: 100, suffix: '+', label: 'Small businesses advised', sub: 'one-on-one, per public record' },
    { num: 19, suffix: ' yrs', label: 'Building CLICROI', sub: 'founded 2006' },
    { num: 16, suffix: ' yrs', label: 'Counseling Connecticut', sub: 'SCORE since 2010, SBDC for over a decade' },
    { num: 2, suffix: ' langs', label: 'English & Spanish', sub: 'fluent advising in both' },
  ],
  services: {
    eyebrow: 'What he does',
    h1: 'No-cost.',
    h2Italic: 'Confidential.',
    h3: 'The kind of help most founders never know is free.',
    lead: 'The CT SBDC is a partnership between UConn and the U.S. Small Business Administration. Every meeting with Nelson is paid for by that mandate. Founders bring the work. He brings two decades of Connecticut market knowledge, a network of bankers, and the patience to walk a plan through five revisions.',
    items: [
      {
        label: 'Start it right',
        body: 'Business plan review, market validation, and the unglamorous structural decisions that decide whether a company survives year three.',
      },
      {
        label: 'Fund it',
        body: 'Loan and grant guidance. Banker introductions. The quiet preparation that turned a vineyard pitch into a $190,000 financing package and 29 jobs.',
      },
      {
        label: 'Grow it',
        body: 'Marketing strategy, social media, export pathways, and the kind of long-arc mentorship that lasts a decade after the first meeting.',
      },
    ],
  },
  receipts: {
    eyebrow: 'The receipts',
    h1: 'The people who built things',
    h2Italic: 'with him in the room.',
    lead: 'Six businesses across Greater Danbury and Western Connecticut, in their own words. Pulled from public CT SBDC records and the Greater Danbury Chamber of Commerce.',
    items: [
      {
        quote: 'The advisor Nelson Merchan didn’t just step in as an advisor; he became a mentor who genuinely cared about our goals and our journey.',
        name: 'Dominika Smaga',
        role: 'Owner, Rehydrate IV Infusion',
        where: 'Shelton, CT',
      },
      {
        quote: 'Nelson is a very attentive and trusted business advisor. He’s my go-to person for every business decision I’d like to bounce off of from an experienced and empathetic advisor.',
        name: 'Neviana Zhgaba',
        role: 'Co-Owner, Aquila’s Nest Vineyards',
        where: 'Sandy Hook, CT',
      },
      {
        quote: 'The SBDC and Nelson Merchan have been an integral factor in the success of our company. Receiving great quality advice, even before we launched, allowed us to create an intelligent and comprehensive business plan that works.',
        name: 'Michael Sauvageau',
        role: 'Founder, Noteworthy Chocolates',
        where: 'Bethel, CT',
      },
      {
        quote: 'Our local CTSBDC contact, Nelson Merchan, is an energetic, thoughtful and well-informed resource for our business. Always enthusiastic, with constant information and support for starting successful businesses.',
        name: 'Jim Barber',
        role: 'Co-Founder, Luke’s Toy Factory',
        where: 'Danbury, CT',
      },
      {
        quote: 'A mind expander who applies success stories from various companies and maintains wide contacts with state resources.',
        name: 'Martha Yaney',
        role: 'Vista Group International',
        where: 'Norwalk, CT',
      },
      {
        quote: 'Nelson’s knowledge and love of the Greater Danbury community shows up in every meeting. Ideas, connections, information, and encouragement.',
        name: 'Andrea Gartner',
        role: 'Owner, Pour Me Coffee & Wine Café',
        where: 'Danbury, CT',
      },
    ],
  },
  caseStudy: {
    eyebrow: 'One of many',
    h1: 'A vineyard in Sandy Hook walked in with a plan.',
    h2Italic: 'Nelson walked them out with $190,000 and a building permit.',
    body: "Nelson reviewed the business plan, evaluated funding paths, introduced the founders to local banks, and shepherded the working capital application through approval. Aquila's Nest Vineyards opened with a $120,000 SBA 7(a) loan and a $70,000 commercial bank loan secured. The facility has since exceeded its business goals and created twenty-nine jobs in Western Connecticut.",
    stats: [
      { num: '$190K', label: 'Financing secured' },
      { num: '29', label: 'Jobs created' },
      { num: '7(a)', label: 'SBA loan structure' },
      { num: '1', label: 'Patient advisor' },
    ],
  },
  roles: {
    eyebrow: 'Roles & affiliations',
    h1: 'One man.',
    h2Italic: 'Six chairs.',
    lead: "Nelson's reach is structural. He sits on the boards and committees that decide where Greater Danbury invests its civic energy. The same network entrepreneurs benefit from when he routes them somewhere only a board seat can open.",
    items: [
      { org: 'CT Small Business Development Center', role: 'Business Advisor', sub: 'University of Connecticut. Greater Danbury, Ridgefield, New Milford, Southbury corridor.' },
      { org: 'CLICROI, LLC', role: 'Founder', sub: 'Hispanic online marketing. Founded 2006.' },
      { org: 'Western CT SCORE Chapter', role: 'Former Chairman', sub: 'Volunteer counselor since 2010.' },
      { org: 'Housatonic Habitat for Humanity', role: 'Board of Directors', sub: 'Workforce housing in Greater Danbury.' },
      { org: 'WCSU Foundation', role: 'Board Member', sub: 'Western Connecticut State University.' },
      { org: 'Friends of the Danbury Library', role: 'Co-President', sub: "Civic stewardship of the library that hosts the city’s innovation center." },
    ],
  },
  recognition: {
    eyebrow: 'Recognition',
    headline: 'Three awards in twelve years.',
    items: [
      { year: '2025', body: 'Hispanic Innovators Honoree', org: 'Westfair Business Journal' },
      { year: '2024', body: 'Community Impact Leaders Award', org: 'KeyBank' },
      { year: '2013', body: 'Connecticut Home-Based Business Champion', org: 'U.S. Small Business Administration' },
    ],
  },
  throughline: {
    eyebrow: 'The Danbury throughline',
    h1: '158 Main Street is a small building.',
    h2Italic: 'The decade that came out of it is not.',
    paragraphs: [
      'In 2012, CT Next funded the launch of Danbury Hackerspace inside the Danbury Library. CT SBDC moved into the same building. SCORE Western Connecticut moved into the same building. For more than a decade those three organizations have shared an address with a coffee shop and a public library, and the shared address turned into a shared phone tree.',
      "Nelson has been on the SBDC end of that phone tree since the start. The Hackerspace member who needs a banker, the SBDC client who needs a laser cutter, the volunteer at SCORE who needs a translator: he is one of the people who routes them. Greater Danbury’s entrepreneur ecosystem is not a building. It is the people who answer when the building forwards the call.",
      "Fourteen years on, that ecosystem is being asked to scale statewide. Whoever does that work will start by knowing the names already on the door. Nelson's is one of the first.",
    ],
  },
  reach: {
    eyebrow: 'Reach him',
    h1: "If you're a Greater Danbury entrepreneur,",
    h2Italic: 'start here.',
    body: 'CT SBDC advising is free, confidential, and publicly funded. Email Nelson directly, sign up through the official portal, or stop by the Greater Danbury Chamber of Commerce.',
    ctaPrimary: 'Email Nelson',
    ctaGhost: 'Request free advising',
    contact: [
      { k: 'Email', v: 'nelson.2.merchan@uconn.edu', href: 'mailto:nelson.2.merchan@uconn.edu' },
      { k: 'Office', v: 'Greater Danbury Chamber of Commerce', v2: '1 Ives Street #301, Danbury, CT 06810', href: 'https://maps.google.com/?q=1+Ives+Street+Danbury+CT' },
      { k: 'Phone', v: '(203) 743-5565', href: 'tel:+12037435565' },
      { k: 'LinkedIn', v: 'linkedin.com/in/panelrecruitment', href: 'https://www.linkedin.com/in/panelrecruitment' },
      { k: 'Hours', v: 'Mon–Fri, 8:30am–4:30pm', href: null },
    ],
  },
  footer: {
    bio: 'Business Advisor, Connecticut Small Business Development Center. Greater Danbury, Connecticut.',
    sourcesLabel: 'Sources for this page',
    sources: SHARED_SOURCES,
    giftedByLabel: 'Site gifted by',
    giftedByName: 'Brayan Tenesaca',
    company: 'Next Generation Learners.',
    disclaimer: 'Independent tribute page. Not officially affiliated with the University of Connecticut or CT SBDC. All quotes and facts cited from public sources above.',
  },
};

export const ES: NelsonContent = {
  lang: 'es',
  altLang: 'en',
  altHref: '/nelson',
  altLabel: 'EN',
  switchAria: 'Switch to English',
  meta: {
    title: 'Nelson Merchan. El punto de entrada para emprendedores en Greater Danbury.',
    description:
      'Nelson Merchan es Asesor de Negocios del Connecticut Small Business Development Center. Hace más de una década, es la primera llamada que hacen los emprendedores de Danbury, Ridgefield, New Milford y Southbury cuando quieren construir algo real.',
    ogTitle: 'Nelson Merchan',
    ogDescription:
      'Hace más de una década, los emprendedores de Greater Danbury empiezan con una sola llamada. Esta es la suya.',
  },
  hero: {
    eyebrow: 'Greater Danbury · Connecticut Occidental',
    nameFirst: 'Nelson',
    nameSecond: 'Merchan.',
    tag: 'El punto de entrada para emprendedores en Greater Danbury. Hace más de una década, la primera llamada cuando alguien en Connecticut Occidental decide construir algo real.',
    metaRole: 'Cargo',
    metaRoleVal: 'Asesor de Negocios',
    metaOrg: 'Org.',
    metaOrgVal: 'CT SBDC · UConn',
    metaLang: 'Idiomas',
    metaLangVal: 'Español / Inglés',
    ctaPrimary: 'Iniciar la conversación',
    ctaGhost: 'Ver el trabajo',
    photoBadge: 'CT SBDC · UConn',
    photoAlt: 'Nelson Merchan, Asesor de Negocios del Connecticut Small Business Development Center',
  },
  work: {
    eyebrow: 'El trabajo',
    body: 'Nelson asesora sin costo a los emprendedores de Greater Danbury. Es la versión del Connecticut Small Business Development Center que contesta el teléfono.',
  },
  stats: [
    { num: 100, suffix: '+', label: 'Pequeños negocios asesorados', sub: 'uno a uno, según registros públicos' },
    { num: 19, suffix: ' años', label: 'Construyendo CLICROI', sub: 'fundada en 2006' },
    { num: 16, suffix: ' años', label: 'Asesorando a Connecticut', sub: 'SCORE desde 2010, SBDC por más de una década' },
    { num: 2, suffix: ' idiomas', label: 'Español e Inglés', sub: 'asesoría fluida en ambos' },
  ],
  services: {
    eyebrow: 'Lo que hace',
    h1: 'Sin costo.',
    h2Italic: 'Confidencial.',
    h3: 'El tipo de ayuda que la mayoría de fundadores no sabe que es gratuita.',
    lead: 'El CT SBDC es una alianza entre UConn y la U.S. Small Business Administration. Cada reunión con Nelson está cubierta por ese mandato. Los fundadores traen el trabajo. Él aporta dos décadas de conocimiento del mercado de Connecticut, una red de banqueros y la paciencia para revisar un plan cinco veces.',
    items: [
      {
        label: 'Empezar bien',
        body: 'Revisión del plan de negocio, validación de mercado y las decisiones estructurales poco glamorosas que deciden si una empresa sobrevive al tercer año.',
      },
      {
        label: 'Financiarlo',
        body: 'Orientación sobre préstamos y subvenciones. Presentaciones a banqueros. La preparación silenciosa que convirtió la propuesta de un viñedo en un paquete de financiamiento de $190,000 y 29 empleos.',
      },
      {
        label: 'Hacerlo crecer',
        body: 'Estrategia de marketing, redes sociales, rutas de exportación y el tipo de mentoría de largo plazo que dura una década después de la primera reunión.',
      },
    ],
  },
  receipts: {
    eyebrow: 'Las pruebas',
    h1: 'Las personas que construyeron cosas',
    h2Italic: 'con él en la sala.',
    lead: 'Seis negocios de Greater Danbury y Connecticut Occidental, en sus propias palabras. Tomado de registros públicos del CT SBDC y la Greater Danbury Chamber of Commerce. Traducido del inglés.',
    items: [
      {
        quote: 'El asesor Nelson Merchan no solo intervino como asesor; se convirtió en un mentor que se preocupaba genuinamente por nuestras metas y nuestro camino.',
        name: 'Dominika Smaga',
        role: 'Propietaria, Rehydrate IV Infusion',
        where: 'Shelton, CT',
      },
      {
        quote: 'Nelson es un asesor de negocios muy atento y de confianza. Es mi persona de cabecera para cada decisión de negocio que quiero consultar con un asesor experimentado y empático.',
        name: 'Neviana Zhgaba',
        role: "Cofundadora, Aquila’s Nest Vineyards",
        where: 'Sandy Hook, CT',
      },
      {
        quote: 'El SBDC y Nelson Merchan han sido un factor fundamental en el éxito de nuestra empresa. Recibir asesoría de gran calidad, incluso antes de lanzarnos, nos permitió crear un plan de negocios inteligente e integral que funciona.',
        name: 'Michael Sauvageau',
        role: 'Fundador, Noteworthy Chocolates',
        where: 'Bethel, CT',
      },
      {
        quote: 'Nuestro contacto local del CTSBDC, Nelson Merchan, es un recurso enérgico, reflexivo y bien informado para nuestro negocio. Siempre entusiasta, con información y apoyo constantes para iniciar negocios exitosos.',
        name: 'Jim Barber',
        role: "Cofundador, Luke’s Toy Factory",
        where: 'Danbury, CT',
      },
      {
        quote: 'Una persona que expande la mente: aplica historias de éxito de distintas empresas y mantiene amplios contactos con recursos del estado.',
        name: 'Martha Yaney',
        role: 'Vista Group International',
        where: 'Norwalk, CT',
      },
      {
        quote: 'El conocimiento y el cariño que Nelson tiene por la comunidad de Greater Danbury se notan en cada reunión. Ideas, conexiones, información y aliento.',
        name: 'Andrea Gartner',
        role: 'Propietaria, Pour Me Coffee & Wine Café',
        where: 'Danbury, CT',
      },
    ],
  },
  caseStudy: {
    eyebrow: 'Uno de muchos',
    h1: 'Un viñedo en Sandy Hook entró con un plan.',
    h2Italic: 'Nelson los acompañó hasta la salida con $190,000 y un permiso de construcción.',
    body: "Nelson revisó el plan de negocios, evaluó las opciones de financiamiento, presentó a los fundadores a los bancos locales y guió la solicitud de capital de trabajo hasta la aprobación. Aquila’s Nest Vineyards abrió con un préstamo SBA 7(a) de $120,000 y un préstamo comercial de $70,000 asegurados. Desde entonces, la operación ha superado sus metas de negocio y ha creado veintinueve empleos en Connecticut Occidental.",
    stats: [
      { num: '$190K', label: 'Financiamiento asegurado' },
      { num: '29', label: 'Empleos creados' },
      { num: '7(a)', label: 'Estructura del préstamo SBA' },
      { num: '1', label: 'Un asesor paciente' },
    ],
  },
  roles: {
    eyebrow: 'Cargos y afiliaciones',
    h1: 'Un hombre.',
    h2Italic: 'Seis sillas.',
    lead: 'El alcance de Nelson es estructural. Está en las juntas y comités que deciden dónde invierte Greater Danbury su energía cívica. La misma red de la que se benefician los emprendedores cuando él los dirige a un lugar que solo un asiento de junta puede abrir.',
    items: [
      { org: 'CT Small Business Development Center', role: 'Asesor de Negocios', sub: 'University of Connecticut. Corredor de Greater Danbury, Ridgefield, New Milford y Southbury.' },
      { org: 'CLICROI, LLC', role: 'Fundador', sub: 'Marketing en línea para hispanos. Fundada en 2006.' },
      { org: 'Western CT SCORE Chapter', role: 'Ex Presidente', sub: 'Consejero voluntario desde 2010.' },
      { org: 'Housatonic Habitat for Humanity', role: 'Junta Directiva', sub: 'Vivienda para la fuerza laboral en Greater Danbury.' },
      { org: 'WCSU Foundation', role: 'Miembro de la Junta', sub: 'Western Connecticut State University.' },
      { org: 'Friends of the Danbury Library', role: 'Copresidente', sub: 'Liderazgo cívico de la biblioteca que alberga el centro de innovación de la ciudad.' },
    ],
  },
  recognition: {
    eyebrow: 'Reconocimientos',
    headline: 'Tres premios en doce años.',
    items: [
      { year: '2025', body: 'Honrado entre los Hispanic Innovators', org: 'Westfair Business Journal' },
      { year: '2024', body: 'Premio Community Impact Leaders', org: 'KeyBank' },
      { year: '2013', body: 'Campeón del Negocio desde Casa de Connecticut', org: 'U.S. Small Business Administration' },
    ],
  },
  throughline: {
    eyebrow: 'El hilo conductor de Danbury',
    h1: '158 Main Street es un edificio pequeño.',
    h2Italic: 'La década que salió de allí no lo es.',
    paragraphs: [
      'En 2012, CT Next financió el lanzamiento de Danbury Hackerspace dentro de la Danbury Library. El CT SBDC se mudó al mismo edificio. SCORE Western Connecticut se mudó al mismo edificio. Por más de una década esas tres organizaciones han compartido dirección con un café y una biblioteca pública, y la dirección compartida se convirtió en una cadena de referidos compartida.',
      'Nelson ha estado del lado del SBDC de esa cadena desde el inicio. El miembro del Hackerspace que necesita un banquero, el cliente del SBDC que necesita un cortador láser, el voluntario de SCORE que necesita un traductor: él es una de las personas que los dirige. El ecosistema emprendedor de Greater Danbury no es un edificio. Son las personas que contestan cuando el edificio reenvía la llamada.',
      'Catorce años después, a ese ecosistema le piden escalar a todo el estado. Quien haga ese trabajo empezará por conocer los nombres que ya están en la puerta. El de Nelson es uno de los primeros.',
    ],
  },
  reach: {
    eyebrow: 'Cómo contactarlo',
    h1: 'Si eres emprendedor en Greater Danbury,',
    h2Italic: 'empieza aquí.',
    body: 'La asesoría del CT SBDC es gratuita, confidencial y financiada públicamente. Escríbele a Nelson directamente, regístrate en el portal oficial, o pasa por la Greater Danbury Chamber of Commerce.',
    ctaPrimary: 'Enviar correo a Nelson',
    ctaGhost: 'Solicitar asesoría gratuita',
    contact: [
      { k: 'Correo', v: 'nelson.2.merchan@uconn.edu', href: 'mailto:nelson.2.merchan@uconn.edu' },
      { k: 'Oficina', v: 'Greater Danbury Chamber of Commerce', v2: '1 Ives Street #301, Danbury, CT 06810', href: 'https://maps.google.com/?q=1+Ives+Street+Danbury+CT' },
      { k: 'Teléfono', v: '(203) 743-5565', href: 'tel:+12037435565' },
      { k: 'LinkedIn', v: 'linkedin.com/in/panelrecruitment', href: 'https://www.linkedin.com/in/panelrecruitment' },
      { k: 'Horario', v: 'Lun–Vie, 8:30am–4:30pm', href: null },
    ],
  },
  footer: {
    bio: 'Asesor de Negocios, Connecticut Small Business Development Center. Greater Danbury, Connecticut.',
    sourcesLabel: 'Fuentes de esta página',
    sources: SHARED_SOURCES,
    giftedByLabel: 'Sitio obsequiado por',
    giftedByName: 'Brayan Tenesaca',
    company: 'Next Generation Learners.',
    disclaimer: 'Página de tributo independiente. No tiene afiliación oficial con la University of Connecticut ni con el CT SBDC. Todas las citas y los hechos provienen de las fuentes públicas listadas arriba.',
  },
};
