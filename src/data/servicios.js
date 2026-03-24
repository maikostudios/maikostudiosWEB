export const serviciosEmpresariales = [
    {
        id: 'agentes-ia',
        title: 'Agentes de IA Personalizados',
        description: 'Asistentes virtuales con ChatGPT y Gemini adaptados a tu negocio',
        longDescription: 'Asistentes virtuales con ChatGPT y Gemini adaptados a tu modelo de negocio. Automatización de atención al cliente, ventas y soporte técnico con integración a tus sistemas existentes (CRM, bases de datos, APIs).',
        icon: '/maiko_icons/svg/agentes_ia.svg',
        tags: [{ text: 'DESTACADO', color: 'primary' }],
        beneficios: [
            'Atención 24/7 automatizada',
            'Calificación de leads inteligente',
            'Reducción de costos operativos'
        ],
        tecnologias: ['ChatGPT API', 'Gemini', 'LangChain', 'Genkit']
    },
    {
        id: 'desarrollo-web',
        title: 'Desarrollo Web a Medida',
        description: 'Aplicaciones web escalables con Vue.js, React y Node.js',
        longDescription: 'Aplicaciones web personalizadas que optimizan tus procesos de negocio y mejoran la experiencia del usuario.',
        icon: '/maiko_icons/svg/desarrollo_web.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['Vue.js', 'React', 'Node.js']
    },
    {
        id: 'consultoria-analytics',
        title: 'Consultoría Tecnológica + Analytics',
        description: 'Estrategia digital y configuración de Google Analytics 4',
        longDescription: 'Asesoramiento experto para la transformación digital de tu empresa. Configuración de Google Analytics 4 para análisis de datos y toma de decisiones informadas.',
        icon: '/maiko_icons/svg/consultoria_analytics.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['Análisis', 'Estrategia', 'GA4', 'Implementación']
    },
    {
        id: 'integracion-sistemas',
        title: 'Integración de Sistemas',
        description: 'Conectamos tus aplicaciones existentes con nuevas soluciones',
        longDescription: 'Conectamos tus aplicaciones existentes con nuevas soluciones para un flujo de trabajo eficiente.',
        icon: '/maiko_icons/svg/soluciones_empresariales.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['APIs', 'Webhooks', 'Microservicios'],
        hideInLanding: true // This one is only in ServiciosView, wait, let me check. Ah, it wasn't in Servicios.vue.
    },
    {
        id: 'automatizacion-marketing',
        title: 'Automatización de Marketing',
        description: 'WhatsApp Business, redes sociales y generación de leads',
        longDescription: 'Automatización de mensajes en WhatsApp y redes sociales para generación de leads y aumento de ventas. Respuestas automáticas y seguimiento de clientes potenciales.',
        icon: '/maiko_icons/svg/automatizacion_marketing.svg',
        tags: [{ text: 'NUEVO', color: 'primary' }],
        beneficios: [],
        tecnologias: ['WhatsApp Business API', 'Meta Business Suite', 'n8n', 'Make']
    },
    {
        id: 'campanas-redes',
        title: 'Campañas en Redes Sociales',
        description: 'Facebook Ads, Instagram Ads, LinkedIn Ads y Google Ads',
        longDescription: 'Diseño y gestión de campañas publicitarias en redes sociales para aumentar tu visibilidad y captar clientes potenciales.',
        icon: '/maiko_icons/svg/campanas_redes_sociales.svg',
        tags: [{ text: 'NUEVO', color: 'primary' }],
        beneficios: [],
        tecnologias: ['Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'Google Ads']
    },
    {
        id: 'asesoria-legal',
        title: 'Asesoría Legal Empresarial',
        description: 'Derecho comercial, contratos tecnológicos y propiedad intelectual',
        longDescription: 'Respaldo jurídico especializado en derecho comercial, contratos tecnológicos y propiedad intelectual. Protege tu negocio digital desde el inicio.',
        icon: '/maiko_icons/svg/asesoria_legal.svg',
        isLegal: true,
        tags: [{ text: 'NUEVO', color: 'secondary' }],
        beneficios: [
            'Contratos tecnológicos a medida',
            'Protección de propiedad intelectual',
            'Cumplimiento normativo'
        ],
        tecnologias: [
            { text: 'Derecho Comercial', color: 'secondary' },
            { text: 'Propiedad Intelectual', color: 'secondary' },
            { text: 'Contratos', color: 'secondary' },
            { text: 'Compliance', color: 'secondary' }
        ]
    }
];

export const serviciosParticulares = [
    {
        id: 'diseno-web',
        title: 'Diseño Web para Emprendedores',
        description: 'Sitios web profesionales y landing pages responsive',
        longDescription: 'Sitios web profesionales y adaptables que reflejan la identidad de tu negocio y atraen clientes.',
        icon: '/maiko_icons/svg/diseno_web.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['Responsive', 'SEO', 'Performance']
    },
    {
        id: 'asistente-virtual',
        title: 'Asistente Virtual con IA',
        description: 'ChatGPT y Gemini Gems personalizados para tu negocio',
        longDescription: 'ChatGPT y Gemini Gems personalizados para tu negocio. Automatiza atención al cliente, reservas, consultas y más con inteligencia artificial.',
        icon: '/maiko_icons/svg/asistente_virtual_ia.svg',
        tags: [{ text: 'DESTACADO', color: 'secondary' }],
        beneficios: [
            'Configuración personalizada',
            'Sin conocimientos técnicos',
            'Soporte continuo'
        ],
        tecnologias: ['ChatGPT', 'Gemini Gems', 'Prompts personalizados']
    },
    {
        id: 'mentoria',
        title: 'Mentoría Tecnológica',
        description: 'Aprende desarrollo web con sesiones personalizadas',
        longDescription: 'Aprende desarrollo web con sesiones personalizadas y acelera tu carrera en tecnología.',
        icon: '/maiko_icons/svg/mentoria_tecnologica.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['JavaScript', 'Vue.js', 'Python']
    },
    {
        id: 'configuracion-analytics',
        title: 'Configuración de Analytics',
        description: 'Google Analytics 4, Tag Manager y dashboards',
        longDescription: 'Instalación y configuración de Google Analytics 4 para entender a tus visitantes y mejorar tu estrategia digital.',
        icon: '/maiko_icons/svg/configuracion_analiticas.svg',
        tags: [{ text: 'NUEVO', color: 'secondary' }],
        beneficios: [],
        tecnologias: ['GA4', 'Tag Manager', 'Looker Studio']
    },
    {
        id: 'automatizacion-contacto',
        title: 'Automatización de Contacto',
        description: 'WhatsApp Business, chatbots y formularios inteligentes',
        longDescription: 'Respuestas automáticas en WhatsApp Business y captura de leads con chatbots y formularios inteligentes.',
        icon: '/maiko_icons/svg/automatizacion_contacto.svg',
        tags: [{ text: 'NUEVO', color: 'secondary' }],
        beneficios: [],
        tecnologias: ['WhatsApp Business', 'Chatbots', 'Formularios']
    },
    {
        id: 'asesoria-legal-emprendedores',
        title: 'Asesoría Legal para Emprendedores',
        description: 'Contratos, constitución de empresas y protección legal',
        longDescription: 'Asesoría legal especializada para formalizar tu emprendimiento, proteger tu marca y crear contratos seguros.',
        icon: '/maiko_icons/svg/asesoria_legal.svg',
        isLegal: true,
        tags: [{ text: 'NUEVO', color: 'primary' }],
        beneficios: [
            'Constitución de empresas',
            'Contratos estándar',
            'Protección de marca'
        ],
        tecnologias: [
            { text: 'Derecho Emprendedor', color: 'primary' },
            { text: 'Contratos', color: 'primary' },
            { text: 'Propiedad Intelectual', color: 'primary' }
        ]
    },
    {
        id: 'soporte-tecnico',
        title: 'Soporte Técnico',
        description: 'Mantenimiento y actualizaciones de tus proyectos digitales',
        longDescription: 'Asistencia dedicada para mantener tus proyectos digitales funcionando de manera óptima.',
        icon: '/maiko_icons/svg/soporte_tecnico.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['Mantenimiento', 'Actualizaciones', 'Monitoreo']
    },
    {
        id: 'armado-pc',
        title: 'Armado de PC Gamers',
        description: 'Configuraciones personalizadas para gaming y trabajo profesional',
        longDescription: 'Configuraciones personalizadas para gaming, streaming y trabajo profesional con componentes de última generación.',
        icon: '/maiko_icons/svg/armado_pc_gamer.svg',
        tags: [],
        beneficios: [],
        tecnologias: ['Gaming', 'Streaming', 'Workstation']
    }
];
