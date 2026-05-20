export type Lang = 'es' | 'en'

export const translations: Record<Lang, Record<string, string>> = {
  es: {
    // Nav
    'nav.portfolio': 'Portfolio',
    'nav.projects': 'Proyectos',
    'nav.services': 'Servicios',
    'nav.contact': 'Contacto',
    'nav.cv': 'Descargar CV',

    // Hero
    'hero.greeting': '// HOLA, SOY',
    'hero.name': 'JAIME CEGARRA',
    'hero.role.5': 'Arquitecto de Software',
    'hero.role.3': 'Diseñador de Sistemas',
    'hero.role.2': 'AI-Driven Developer',
    'hero.role.4': 'AWS Cloud Certified',
    'hero.role.1': 'Ingeniero de Software',
    'hero.bio': 'Diseño y construyo sistemas de software con visión empresarial. Especializado en desarrollo impulsado por IA, arquitectura de soluciones y creación de productos desde cero.',
    'hero.cta.portfolio': 'Ver Portfolio',
    'hero.cta.cv': 'Descargar CV',
    'hero.stat.projects': 'Proyectos',
    'hero.stat.technologies': 'Tecnologías',
    'hero.stat.certified': 'AWS Certified',

    // About
    'about.label': '// SECCIÓN: SOBRE_MÍ',
    'about.title.1': 'Construyo sistemas que',
    'about.title.2': 'generan impacto',
    'about.p1': 'Ingeniero de software con una aproximación holística al desarrollo: desde la concepción de la idea hasta el despliegue en producción. Mi enfoque combina pensamiento sistémico, visión de negocio y las herramientas más avanzadas de inteligencia artificial.',
    'about.p2': 'He creado desde cero gestores de proyectos, compiladores, orquestadores de máquinas virtuales y marketplaces. Cada proyecto es una oportunidad para diseñar algo que no existía y resolver problemas complejos con soluciones elegantes.',
    'about.p3': 'Mi diferencial: capacidad de abstracción, pensamiento crítico y una ambición clara por construir productos que importen.',
    'about.experience': 'EXPERIENCIA',
    'about.experience.role': 'Software Developer — Maibound',
    'about.experience.desc': 'Creación de un orquestador de máquinas virtuales usando colas de Azure. Diseño e implementación completa desde cero.',
    'about.philosophy': 'FILOSOFÍA',
    'about.philosophy.text': '"No desarrollo código. Diseño sistemas, invento artefactos, creo soluciones."',

    // Tech Stack
    'tech.label': '// SECCIÓN: TECH_STACK',
    'tech.title': 'Tecnologías',
    'tech.backend': 'Backend',
    'tech.frontend': 'Frontend',
    'tech.cloud': 'Cloud & DevOps',
    'tech.ai': 'IA & Herramientas',
    'tech.other': 'Redes & Sistemas',

    // Projects
    'projects.label': '// SECCIÓN: PROYECTOS',
    'projects.title': 'Proyectos Destacados',
    'projects.viewAll': 'Ver todos los proyectos',
    'projects.private': 'PRIVADO',
    'projects.public': 'PÚBLICO',

    'project.manager.name': 'Gestor Proyectos',
    'project.manager.desc': 'Plataforma integral de gestión de proyectos con Next.js, React, TypeScript y Supabase. Vistas Kanban, Gantt y listas, integración con GitHub (commits, PRs, CI/CD), módulo de optimización cloud multi-nube y FinOps, chat en tiempo real y calendario drag-and-drop.',
    'project.compiler.name': 'Compilador MiniC',
    'project.compiler.desc': 'Compilador completo de un subconjunto de C con análisis léxico, sintáctico (recursivo descendente), AST, análisis semántico y generación de código MIPS. Desarrollado en C++.',
    'project.p2p.name': 'nanoFiles P2P',
    'project.p2p.desc': 'Sistema de compartición de archivos P2P con servidor de directorio, protocolo de control TCP y transferencia de archivos sobre UDP. Multithreading y protocolo binario propio.',
    'project.expenses.name': 'Gestor de Gastos',
    'project.expenses.desc': 'App de escritorio Java para gestión de gastos personales y compartidos. Categorización, estadísticas visuales, sistema de alertas, gestión de grupos y persistencia local con JSON. Proyecto universitario TDS.',
    'project.marketplace.name': 'Marketplace Responsive',
    'project.marketplace.desc': 'Marketplace full-stack con React, Node.js, Express y MySQL. CRUD de productos, autenticación JWT, búsqueda con filtros y diseño responsive con Bootstrap 5.',
    'project.orchestrator.name': 'Orquestador VM',
    'project.orchestrator.desc': 'Orquestador de máquinas virtuales usando colas de Azure. Desarrollado en prácticas profesionales en Maibound.',
    'project.kanban.name': 'Tablerello',
    'project.kanban.desc': 'Sistema de gestión de proyectos estilo Trello con tableros Kanban, invitaciones y flujos de trabajo. Arquitectura hexagonal pura con DDD, Spring Boot y persistencia JPA.',

    // Marquee
    'marquee.label': '// STACK: TECNOLOGÍAS',

    // Contact
    'contact.label': '// SECCIÓN: CONTACTO',
    'contact.title': 'Hablemos',
    'contact.subtitle': '¿Tienes un proyecto en mente? ¿Buscas un perfil que aporte visión y ejecución? Escríbeme.',
    'contact.name': 'Nombre',
    'contact.email': 'Email',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar Mensaje',
    'contact.direct': 'O escríbeme directamente a:',
    'contact.namePlaceholder': 'Tu nombre',
    'contact.emailPlaceholder': 'tu@email.com',
    'contact.subjectPlaceholder': 'Asunto del mensaje',
    'contact.messagePlaceholder': 'Cuéntame tu idea...',

    // Footer
    'footer.rights': '© 2026 JAIME CEGARRA. TODOS LOS DERECHOS RESERVADOS.',
    'footer.built': 'CONSTRUIDO CON VISIÓN.',

    // Services
    'services.title': 'Servicios',
    'services.coming': 'PRÓXIMAMENTE',
    'services.subtitle': 'Estoy preparando algo grande. Mientras tanto, no dudes en contactarme para cualquier proyecto o colaboración.',
    'services.cta': 'Contactar',

    // Projects page
    'projectsPage.title': 'Todos los Proyectos',
    'projectsPage.subtitle': 'Una selección de proyectos que demuestran mi capacidad de diseñar, construir y desplegar soluciones completas.',
    'projectsPage.filter.all': 'Todos',
    'projectsPage.back': 'Volver al inicio',

    // Project detail page
    'projectDetail.back': 'Volver a proyectos',
    'projectDetail.tech': 'Stack Técnico',
    'projectDetail.github': 'Ver en GitHub',
    'projectDetail.features': 'Características',
    'projectDetail.architecture': 'Arquitectura',
    'projectDetail.private': 'Repositorio privado',
  },

  en: {
    // Nav
    'nav.portfolio': 'Portfolio',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.cv': 'Download CV',

    // Hero
    'hero.greeting': '// HELLO, I AM',
    'hero.name': 'JAIME CEGARRA',
    'hero.role.1': 'Software Architect',
    'hero.role.2': 'Systems Designer',
    'hero.role.3': 'AI-Driven Developer',
    'hero.role.4': 'AWS Cloud Certified',
    'hero.role.5': 'Software Engineer',
    'hero.bio': 'I design and build software systems with a business-driven vision. Specialized in AI-powered development, solution architecture, and building products from scratch.',
    'hero.cta.portfolio': 'View Portfolio',
    'hero.cta.cv': 'Download CV',
    'hero.stat.projects': 'Projects',
    'hero.stat.technologies': 'Technologies',
    'hero.stat.certified': 'AWS Certified',

    // About
    'about.label': '// SECTION: ABOUT_ME',
    'about.title.1': 'I build systems that',
    'about.title.2': 'make an impact',
    'about.p1': 'Software engineer with a holistic approach to development: from idea conception to production deployment. My focus combines systems thinking, business vision, and the most advanced artificial intelligence tools.',
    'about.p2': 'I have built project managers, compilers, virtual machine orchestrators, and marketplaces from the ground up. Every project is a chance to design something that didn\'t exist and solve complex problems with elegant solutions.',
    'about.p3': 'My edge: abstraction capacity, critical thinking, and a clear ambition to build products that matter.',
    'about.experience': 'EXPERIENCE',
    'about.experience.role': 'Software Developer — Maibound',
    'about.experience.desc': 'Built a virtual machine orchestrator using Azure queues. Full end-to-end design and implementation from scratch.',
    'about.philosophy': 'PHILOSOPHY',
    'about.philosophy.text': '"I don\'t write code. I design systems, invent artifacts, create solutions."',

    // Tech Stack
    'tech.label': '// SECTION: TECH_STACK',
    'tech.title': 'Technologies',
    'tech.backend': 'Backend',
    'tech.frontend': 'Frontend',
    'tech.cloud': 'Cloud & DevOps',
    'tech.ai': 'AI & Tools',
    'tech.other': 'Networks & Systems',

    // Projects
    'projects.label': '// SECTION: PROJECTS',
    'projects.title': 'Featured Projects',
    'projects.viewAll': 'View all projects',
    'projects.private': 'PRIVATE',
    'projects.public': 'PUBLIC',

    'project.manager.name': 'Gestor Proyectos',
    'project.manager.desc': 'Full-featured project management platform with Next.js, React, TypeScript, and Supabase. Kanban, Gantt, and list views, GitHub integration (commits, PRs, CI/CD), multi-cloud FinOps optimization module, real-time chat, and drag-and-drop calendar.',
    'project.compiler.name': 'MiniC Compiler',
    'project.compiler.desc': 'Full compiler for a C subset with lexical analysis, recursive descent parsing, AST, semantic analysis, and MIPS code generation. Built in C++.',
    'project.p2p.name': 'nanoFiles P2P',
    'project.p2p.desc': 'P2P file-sharing system with directory server, TCP control protocol, and UDP file transfer. Custom binary protocol with multithreading.',
    'project.expenses.name': 'Expense Manager',
    'project.expenses.desc': 'Java desktop app for personal and shared expense management. Categorization, visual statistics, alert system, group management, and local JSON persistence. University TDS project.',
    'project.marketplace.name': 'DAWeb Marketplace',
    'project.marketplace.desc': 'Full-stack marketplace with React, Node.js, Express, and MySQL. Product CRUD, JWT auth, filtered search, and responsive Bootstrap 5 design.',
    'project.orchestrator.name': 'VM Orchestrator',
    'project.orchestrator.desc': 'Virtual machine orchestrator using Azure queues. Built during professional internship at Maibound.',
    'project.kanban.name': 'Tablerello',
    'project.kanban.desc': 'Trello-style project management with Kanban boards, invitations, and workflows. Pure hexagonal architecture with DDD, Spring Boot, and JPA persistence.',

    // Marquee
    'marquee.label': '// STACK: TECHNOLOGIES',

    // Contact
    'contact.label': '// SECTION: CONTACT',
    'contact.title': 'Let\'s Talk',
    'contact.subtitle': 'Have a project in mind? Looking for a profile that brings vision and execution? Write me.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.direct': 'Or write me directly at:',
    'contact.namePlaceholder': 'Your name',
    'contact.emailPlaceholder': 'you@email.com',
    'contact.subjectPlaceholder': 'Message subject',
    'contact.messagePlaceholder': 'Tell me about your idea...',

    // Footer
    'footer.rights': '© 2026 JAIME CEGARRA. ALL RIGHTS RESERVED.',
    'footer.built': 'BUILT WITH VISION.',

    // Services
    'services.title': 'Services',
    'services.coming': 'COMING SOON',
    'services.subtitle': 'I\'m preparing something big. In the meantime, feel free to contact me for any project or collaboration.',
    'services.cta': 'Contact',

    // Projects page
    'projectsPage.title': 'All Projects',
    'projectsPage.subtitle': 'A selection of projects that demonstrate my ability to design, build, and deploy complete solutions.',
    'projectsPage.filter.all': 'All',
    'projectsPage.back': '← Back to home',

    // Project detail page
    'projectDetail.back': '← Back to projects',
    'projectDetail.tech': 'Tech Stack',
    'projectDetail.github': 'View on GitHub',
    'projectDetail.features': 'Features',
    'projectDetail.architecture': 'Architecture',
    'projectDetail.private': 'Private repository',
  },
}
