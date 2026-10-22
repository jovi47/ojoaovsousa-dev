export const content = {
  'pt-br': {
    lang: 'pt-BR', short: 'PT', flag: '🇧🇷',
    title: 'João Victor · jovi47 | Software, IA e ideias em movimento',
    description: 'João Victor, desenvolvedor freelancer. Elixir, Java, IA aplicada, RAG, agentes, automações e experiências 3D para transformar ideias em produtos.',
    nav: { work: 'Projetos', expertise: 'O que construo', about: 'Sobre', contact: 'Vamos conversar' },
    ui: { skip: 'Pular para o conteúdo', theme: 'Alternar tema', motion: 'Alternar movimento', pause: 'Pausar movimento', resume: 'Retomar movimento', menu: 'Abrir menu', prev: 'Projeto anterior', next: 'Próximo projeto', visit: 'Visitar projeto', details: 'Ver detalhes', close: 'Fechar', back: 'Voltar', play: 'Explorar o playground', reset: 'Recomeçar', privacy: 'Privacidade', terms: 'Termos de uso', language: 'Escolher idioma' },
    hero: {
      eyebrow: 'João Victor · desenvolvedor freelancer', titleTop: 'Peça por peça.', titleBottom: 'Ideias ganham vida.',
      description: 'Construo software, conecto IA ao trabalho real e exploro novas formas de interagir. Do primeiro problema ao produto que faz sentido usar.',
      primary: 'Vamos construir juntos', secondary: 'Conheça meu trabalho', note: 'Elixir · Java · IA aplicada · 3D', studioLabel: 'Oficina de ideias', studioStatus: 'Curiosidade em movimento'
    },
    work: {
      kicker: 'Trabalho real', title: 'Da ideia à experiência.', description: 'Dois projetos que criei, com propósitos próprios e atenção ao que as pessoas precisam fazer.',
      cases: [
        { id: 'horagora', name: 'HorAgora', category: 'SaaS de agendamento', headline: 'Da agenda do negócio à escolha do cliente.', description: 'Sistema de agendamento online para barbearias, salões e estúdios, com uma agenda para profissionais independentes ou equipes e um link para reservar.', url: 'https://horagora.com.br', tags: ['SaaS', 'Agendamento', 'Reserva online'], role: 'Criação e desenvolvimento', delivery: 'Produto e experiência de reserva', detail: 'O negócio organiza serviços, duração, preços e disponibilidade e compartilha seu link. O cliente escolhe o serviço e o horário antes de confirmar a reserva. A apresentação pública conecta a proposta do produto a demonstrações das experiências do negócio e do cliente.' },
        { id: 'andrea', name: 'Andréa Sousa Consultoria', category: 'Site de serviços', headline: 'Clareza para dar o primeiro passo.', description: 'Site de consultoria tributária que apresenta serviços de isenção e restituição de IR e facilita a solicitação de análise.', url: 'https://andreasousaconsultoria.com.br', tags: ['Site institucional', 'Serviços', 'Contato'], role: 'Criação e desenvolvimento do site', delivery: 'Site público', detail: 'A experiência reúne apresentação da especialista, serviços, etapas do atendimento, dúvidas frequentes e formulário de solicitação. O visitante encontra informações para entender o serviço e iniciar o contato, com políticas acessíveis e controles de preferência de métricas.' }
      ]
    },
    expertise: {
      kicker: 'O que construo', title: 'Tecnologia com um motivo.', description: 'Escolho as peças pelo problema. O objetivo é entregar algo útil, compreensível e possível de evoluir.',
      items: [
        { title: 'Software que sustenta o produto', body: 'Aplicações e serviços com Elixir e Java, integrando regras de negócio, APIs e os fluxos que fazem a operação acontecer.', tags: ['Elixir', 'Java', 'APIs'] },
        { title: 'IA aplicada ao contexto', body: 'RAG, agentes e harnesses que conectam modelos a fontes, ferramentas e verificações úteis para a tarefa.', tags: ['IA aplicada', 'RAG', 'Agentes'] },
        { title: 'Automações que tiram atrito', body: 'Conecto etapas e sistemas para reduzir trabalho repetitivo, com atenção a falhas, limites e acompanhamento.', tags: ['Automações', 'Integrações', 'Fluxos'] },
        { title: 'Interfaces para explorar', body: 'Experiências web e 3D que tornam uma ideia visível e convidam à interação, sem perder de vista o uso real.', tags: ['Web', '3D', 'Interação'] }
      ]
    },
    method: { kicker: 'Como trabalho', title: 'Entender. Construir. Refinar.', steps: [
      { title: 'Começar pelo problema', body: 'Alinhamos objetivo, contexto e limites para definir uma entrega que valha a pena.' },
      { title: 'Montar a primeira versão', body: 'Transformo o escopo em algo concreto, com decisões claras e espaço para você acompanhar.' },
      { title: 'Testar e ajustar', body: 'Validamos o uso, corrigimos o que importa e combinamos os próximos passos.' }
    ] },
    about: { kicker: 'Quem está por aqui', title: 'Sou João Victor. Pode chamar de jovi47.', paragraphs: [
      'Gosto de entender como as coisas funcionam e de montar algo novo com esse aprendizado. LEGO faz parte desse prazer pessoal: experimentar uma peça, mudar a combinação e descobrir uma construção que antes era só uma ideia.',
      'Levo essa curiosidade para o software. Trabalho com Elixir, Java, IA aplicada e automações, e me entusiasmo com 3D e experiências interativas. O que me move é conectar técnica e imaginação a um problema que merece solução.'
    ], signature: 'Curiosidade para explorar. Cuidado para entregar.' },
    game: { kicker: 'Uma pausa para construir', title: 'Entre no playground.', description: 'Explore o espaço e encontre três peças da minha forma de criar. Uma pequena brincadeira com a mesma curiosidade que levo ao trabalho.', start: 'Começar a explorar', instructions: 'Use as setas, WASD ou os controles na tela para se mover. Reúna as três peças e siga até a saída iluminada no canto inferior direito.', up: 'Mover para cima', left: 'Mover para a esquerda', right: 'Mover para a direita', down: 'Mover para baixo', reset: 'Recomeçar exploração', exit: 'Sair do playground', initial: 'Encontre as três peças.', position: 'Posição', remaining: 'Peças restantes', exitLabel: 'Saída', exitPrompt: 'Três peças reunidas! Vá até a saída no canto inferior direito.', coordinates: 'coluna {x}, linha {y}', blocked: 'Fim do caminho. Tente outra direção.', collected: 'Peça encontrada!', win: 'Construção completa. Vamos criar a próxima?', pieces: [
      { name: 'Curiosidade', body: 'Toda boa construção começa com uma pergunta.' },
      { name: 'Conexão', body: 'As peças certas fazem mais quando trabalham juntas.' },
      { name: 'Cuidado', body: 'Testar, ajustar e dar atenção ao que será usado.' }
    ] },
    contact: { kicker: 'Vamos conversar', title: 'Qual é a sua próxima ideia?', description: 'Conte o que você quer construir, melhorar ou automatizar. A conversa começa pelo seu contexto.', whatsapp: 'Conversar no WhatsApp', email: 'Enviar um e-mail', availability: 'Projetos e colaborações · escopo e disponibilidade sob consulta' },
    footer: { line: 'João Victor · jovi47 · desenvolvedor freelancer', credit: 'Construído com curiosidade, peça por peça.' },
    guide: { hero: 'Pode chegar. A bancada tem espaço para mais uma boa ideia.', work: 'Pode olhar de perto. Essas peças já viraram projetos de verdade.', expertise: 'A caixa de ferramentas é variada. A escolha tem motivo.', method: 'Antes de encaixar, vale conferir se a peça resolve o problema.', about: 'Por trás do código tem alguém que ainda gosta de montar coisas.', play: 'Aqui pode explorar. Prometo não deixar peça para você pisar.', contact: 'A próxima construção pode começar com um simples olá.' },
    privacy: {
      title: 'Privacidade', intro: 'João Victor (jovi47) é o responsável pelo tratamento de dados neste portfólio. Contato: jovi47profissional@gmail.com. Última atualização: 2026-10-22 UTC.', sections: [
        { title: 'Navegação e preferências', body: 'O site não tem formulário próprio, publicidade, analytics ou scripts de rastreamento. Preferências de tema e movimento podem ser salvas no localStorage do navegador e removidas pelos seus controles de armazenamento. O playground não solicita dados pessoais nem registra partidas.' },
        { title: 'Hospedagem e prévia', body: 'Esta versão é uma prévia privada do responsável, disponibilizada pelo Sites/OpenAI. A plataforma pode processar endereço IP, registros técnicos e dados de sessão, inclusive cookies necessários à autenticação, conforme suas próprias políticas. A configuração para uma futura publicação na Vercel está preparada, mas não significa que o site já esteja publicado nesse provedor. Os prazos dos registros da plataforma seguem as políticas aplicáveis do provedor.' },
        { title: 'Contato e finalidade', body: 'Ao escrever por e-mail ou WhatsApp, você compartilha dados de contato e o conteúdo da conversa. Essas informações são usadas para responder à solicitação e, quando cabível, realizar procedimentos preliminares a uma contratação a seu pedido. O contato não gera inscrição automática em marketing. Evite enviar dados sensíveis desnecessários.' },
        { title: 'Conservação e direitos', body: 'Dados de contato são mantidos pelo tempo necessário para responder, conduzir a relação contratual ou cumprir obrigações legais aplicáveis. Você pode solicitar acesso, correção ou exclusão pelo e-mail jovi47profissional@gmail.com. Cada solicitação considera os direitos aplicáveis e eventuais deveres legais de conservação.' },
        { title: 'Serviços externos', body: 'Links de WhatsApp, Gmail, GitHub, LinkedIn e dos projetos levam a serviços externos somente quando você os abre. As políticas desses destinos se aplicam ao uso deles. Esta página descreve o funcionamento deste portfólio e será revista quando esse funcionamento mudar.' }
      ]
    },
    terms: {
      title: 'Termos de uso', intro: 'Este é um portfólio informativo de João Victor (jovi47). Ao explorar o site, considere as condições abaixo.', sections: [
        { title: 'Serviços e propostas', body: 'Conteúdos e conversas iniciais não criam contratação automática. Escopo, preço, prazo, responsabilidades e condições de cada serviço dependem de proposta e acordo por escrito.' },
        { title: 'Projetos e materiais', body: 'Os projetos apresentados fazem parte do trabalho de João Victor. Marcas, imagens e materiais de terceiros pertencem a seus titulares. Sua presença identifica os projetos e não implica endosso ou transferência de direitos.' },
        { title: 'Inspiração pessoal', body: 'LEGO é mencionado como interesse pessoal de João Victor. Este portfólio é independente e não tem afiliação, patrocínio ou aprovação do LEGO Group.' },
        { title: 'Playground e links', body: 'O playground é uma experiência recreativa, sem compras ou coleta de dados de jogadores. Links externos levam a serviços com termos próprios. Conteúdo e disponibilidade dos sites vinculados podem mudar.' },
        { title: 'Contato', body: 'Para esclarecer o conteúdo ou comunicar um problema, escreva para jovi47profissional@gmail.com. Estas condições descrevem o projeto e não constituem parecer jurídico.' }
      ]
    }
  },
  en: {
    lang: 'en-GB', short: 'EN', flag: '🇬🇧',
    title: 'João Victor · jovi47 | Software, AI and ideas in motion',
    description: 'João Victor, freelance developer. Elixir, Java, applied AI, RAG, agents, automations and 3D experiences that turn ideas into products.',
    nav: { work: 'Work', expertise: 'What I build', about: 'About', contact: 'Let’s talk' },
    ui: { skip: 'Skip to content', theme: 'Switch theme', motion: 'Toggle motion', pause: 'Pause motion', resume: 'Resume motion', menu: 'Open menu', prev: 'Previous project', next: 'Next project', visit: 'Visit project', details: 'View details', close: 'Close', back: 'Back', play: 'Explore the playground', reset: 'Start again', privacy: 'Privacy', terms: 'Terms of use', language: 'Choose language' },
    hero: { eyebrow: 'João Victor · freelance developer', titleTop: 'Piece by piece.', titleBottom: 'Ideas come to life.', description: 'I build software, connect AI to real work and explore new ways to interact. From the first question to a product that makes sense to use.', primary: 'Let’s build together', secondary: 'Explore my work', note: 'Elixir · Java · Applied AI · 3D', studioLabel: 'Idea workshop', studioStatus: 'Curiosity in motion' },
    work: {
      kicker: 'Real work', title: 'From idea to experience.', description: 'Two projects I created, each with its own purpose and attention to what people need to do.', cases: [
        { id: 'horagora', name: 'HorAgora', category: 'Scheduling SaaS', headline: 'From the business diary to the customer’s choice.', description: 'An online scheduling system for barbershops, salons and studios, with one schedule for solo professionals or teams and a shareable booking link.', url: 'https://horagora.com.br', tags: ['SaaS', 'Scheduling', 'Online booking'], role: 'Creation and development', delivery: 'Product and booking experience', detail: 'Businesses organise services, duration, prices and availability, then share their booking link. Customers choose a service and a time before confirming their booking. The public website connects the product’s proposition to demonstrations of both business and customer experiences.' },
        { id: 'andrea', name: 'Andréa Sousa Consultoria', category: 'Services website', headline: 'Clarity for the first step.', description: 'A tax consultancy website presenting income-tax exemption and refund services, with a clear route to request an assessment.', url: 'https://andreasousaconsultoria.com.br', tags: ['Business website', 'Services', 'Contact'], role: 'Website creation and development', delivery: 'Public website', detail: 'The experience brings together the specialist’s introduction, services, process, FAQs and an enquiry form. Visitors can understand the service and make contact, with accessible policies and analytics preference controls.' }
      ]
    },
    expertise: { kicker: 'What I build', title: 'Technology with a purpose.', description: 'I choose the pieces to fit the problem. The aim is something useful, understandable and ready to evolve.', items: [
      { title: 'Software behind the product', body: 'Applications and services with Elixir and Java, connecting business rules, APIs and the workflows that keep operations moving.', tags: ['Elixir', 'Java', 'APIs'] },
      { title: 'AI grounded in context', body: 'RAG, agents and harnesses connecting models to the sources, tools and checks that a task needs.', tags: ['Applied AI', 'RAG', 'Agents'] },
      { title: 'Automation that removes friction', body: 'Connecting steps and systems to reduce repetitive work, with attention to failures, limits and visibility.', tags: ['Automation', 'Integrations', 'Workflows'] },
      { title: 'Interfaces to explore', body: 'Web and 3D experiences that make an idea visible and invite interaction, while keeping real use in focus.', tags: ['Web', '3D', 'Interaction'] }
    ] },
    method: { kicker: 'How I work', title: 'Understand. Build. Refine.', steps: [
      { title: 'Start with the problem', body: 'We align on the goal, context and constraints to define a worthwhile delivery.' },
      { title: 'Build the first version', body: 'I turn the scope into something tangible, with clear decisions and room for your feedback.' },
      { title: 'Test and adjust', body: 'We validate real use, address what matters and agree on the next steps.' }
    ] },
    about: { kicker: 'Who’s behind this', title: 'I’m João Victor. You can call me jovi47.', paragraphs: [
      'I enjoy understanding how things work and building something new with what I learn. LEGO is part of that personal enjoyment: trying a piece, changing the combination and discovering a build that was once just an idea.',
      'I bring that curiosity to software. I work with Elixir, Java, applied AI and automation, and I’m excited by 3D and interactive experiences. What drives me is connecting craft and imagination to a problem worth solving.'
    ], signature: 'Curiosity to explore. Care to deliver.' },
    game: { kicker: 'A little room to build', title: 'Step into the playground.', description: 'Explore the space and find three pieces of the way I create. A small game with the curiosity I bring to my work.', start: 'Start exploring', instructions: 'Use the arrow keys, WASD or the on-screen controls to move. Collect all three pieces, then reach the glowing exit in the bottom-right corner.', up: 'Move up', left: 'Move left', right: 'Move right', down: 'Move down', reset: 'Restart exploration', exit: 'Leave playground', initial: 'Find the three pieces.', position: 'Position', remaining: 'Pieces remaining', exitLabel: 'Exit', exitPrompt: 'Three pieces collected! Head to the exit in the bottom-right corner.', coordinates: 'column {x}, row {y}', blocked: 'End of the path. Try another direction.', collected: 'Piece found!', win: 'Build complete. Shall we create the next one?', pieces: [
      { name: 'Curiosity', body: 'Every good build starts with a question.' },
      { name: 'Connection', body: 'The right pieces do more when they work together.' },
      { name: 'Care', body: 'Test, adjust and pay attention to what people will use.' }
    ] },
    contact: { kicker: 'Let’s talk', title: 'What’s your next idea?', description: 'Tell me what you want to build, improve or automate. Your context is where the conversation starts.', whatsapp: 'Chat on WhatsApp', email: 'Send an email', availability: 'Projects and collaborations · scope and availability on enquiry' },
    footer: { line: 'João Victor · jovi47 · freelance developer', credit: 'Built with curiosity, piece by piece.' },
    guide: { hero: 'Come on in. There’s room on the workbench for another good idea.', work: 'Take a closer look. These pieces became real projects.', expertise: 'Plenty of tools in the box. Each choice has a reason.', method: 'Before it clicks into place, let’s check it solves the problem.', about: 'Behind the code is someone who still loves building things.', play: 'Explore freely. I promise there are no pieces to step on.', contact: 'The next build could start with a simple hello.' },
    privacy: { title: 'Privacy', intro: 'João Victor (jovi47) is the controller responsible for personal data on this portfolio. Contact: jovi47profissional@gmail.com. Last updated: 2026-10-22 UTC.', sections: [
      { title: 'Browsing and preferences', body: 'The website has no own contact form, advertising, analytics or tracking scripts. Theme and motion preferences may be stored in your browser’s localStorage and removed through its storage controls. The playground does not request personal data or record game sessions.' },
      { title: 'Hosting and preview', body: 'This version is a private preview for the owner, provided through Sites/OpenAI. The platform may process IP addresses, technical logs and session data, including cookies required for authentication, under its own policies. Configuration for a future Vercel deployment is prepared; this does not mean the website is already published with that provider. Platform log retention follows the provider’s applicable policies.' },
      { title: 'Contact and purpose', body: 'When you write by email or WhatsApp, you share contact details and the conversation’s content. This information is used to respond and, where relevant, take steps towards a contract at your request. Contacting me does not automatically subscribe you to marketing. Please avoid sending unnecessary sensitive data.' },
      { title: 'Retention and rights', body: 'Contact data is retained as needed to respond, manage a contractual relationship or meet applicable legal obligations. You can request access, correction or deletion at jovi47profissional@gmail.com. Requests are considered in light of applicable rights and any legal retention duties.' },
      { title: 'External services', body: 'Links to WhatsApp, Gmail, GitHub, LinkedIn and project websites lead to external services only when you open them. Their policies govern your use of those destinations. This notice describes the portfolio’s operation and will be reviewed when that operation changes.' }
    ] },
    terms: { title: 'Terms of use', intro: 'This is an informational portfolio by João Victor (jovi47). Please consider the following conditions when exploring the website.', sections: [
      { title: 'Services and proposals', body: 'Website content and initial conversations do not automatically create a service contract. Scope, price, schedule, responsibilities and service conditions require a written proposal and agreement.' },
      { title: 'Projects and materials', body: 'The projects shown are part of João Victor’s work. Third-party brands, images and materials belong to their respective owners. Their presence identifies the projects and does not imply endorsement or transfer of rights.' },
      { title: 'Personal inspiration', body: 'LEGO is mentioned as a personal interest of João Victor. This independent portfolio is not affiliated with, sponsored by or approved by the LEGO Group.' },
      { title: 'Playground and links', body: 'The playground is a recreational experience with no purchases or collection of player data. External links lead to services with their own terms. Linked websites’ content and availability may change.' },
      { title: 'Contact', body: 'For clarification or to report a problem, email jovi47profissional@gmail.com. These conditions describe the project and do not constitute legal advice.' }
    ] }
  },
  es: {
    lang: 'es', short: 'ES', flag: '🇪🇸',
    title: 'João Victor · jovi47 | Software, IA e ideas en movimiento',
    description: 'João Victor, desarrollador freelance. Elixir, Java, IA aplicada, RAG, agentes, automatizaciones y experiencias 3D para convertir ideas en productos.',
    nav: { work: 'Proyectos', expertise: 'Qué construyo', about: 'Sobre mí', contact: 'Hablemos' },
    ui: { skip: 'Saltar al contenido', theme: 'Cambiar tema', motion: 'Alternar movimiento', pause: 'Pausar movimiento', resume: 'Reanudar movimiento', menu: 'Abrir menú', prev: 'Proyecto anterior', next: 'Siguiente proyecto', visit: 'Visitar proyecto', details: 'Ver detalles', close: 'Cerrar', back: 'Volver', play: 'Explorar el playground', reset: 'Empezar de nuevo', privacy: 'Privacidad', terms: 'Términos de uso', language: 'Elegir idioma' },
    hero: { eyebrow: 'João Victor · desarrollador freelance', titleTop: 'Pieza a pieza.', titleBottom: 'Las ideas cobran vida.', description: 'Construyo software, conecto la IA con el trabajo real y exploro nuevas formas de interactuar. Desde la primera pregunta hasta un producto que tenga sentido usar.', primary: 'Construyamos juntos', secondary: 'Conoce mi trabajo', note: 'Elixir · Java · IA aplicada · 3D', studioLabel: 'Taller de ideas', studioStatus: 'Curiosidad en movimiento' },
    work: { kicker: 'Trabajo real', title: 'De la idea a la experiencia.', description: 'Dos proyectos que creé, cada uno con su propósito y atención a lo que las personas necesitan hacer.', cases: [
      { id: 'horagora', name: 'HorAgora', category: 'SaaS de reservas', headline: 'De la agenda del negocio a la elección del cliente.', description: 'Sistema de reservas online para barberías, salones y estudios, con una agenda para profesionales independientes o equipos y un enlace para reservar.', url: 'https://horagora.com.br', tags: ['SaaS', 'Agenda', 'Reservas online'], role: 'Creación y desarrollo', delivery: 'Producto y experiencia de reserva', detail: 'El negocio organiza servicios, duración, precios y disponibilidad y comparte su enlace. El cliente elige el servicio y la hora antes de confirmar la reserva. El sitio público conecta la propuesta del producto con demostraciones de las experiencias del negocio y del cliente.' },
      { id: 'andrea', name: 'Andréa Sousa Consultoria', category: 'Sitio de servicios', headline: 'Claridad para dar el primer paso.', description: 'Sitio de consultoría tributaria que presenta servicios de exención y devolución del impuesto sobre la renta y permite solicitar un análisis.', url: 'https://andreasousaconsultoria.com.br', tags: ['Sitio corporativo', 'Servicios', 'Contacto'], role: 'Creación y desarrollo del sitio', delivery: 'Sitio público', detail: 'La experiencia reúne la presentación de la especialista, servicios, etapas de atención, preguntas frecuentes y formulario de solicitud. El visitante encuentra información para entender el servicio e iniciar el contacto, con políticas accesibles y controles de preferencias de métricas.' }
    ] },
    expertise: { kicker: 'Qué construyo', title: 'Tecnología con un propósito.', description: 'Elijo las piezas según el problema. El objetivo es entregar algo útil, comprensible y que pueda evolucionar.', items: [
      { title: 'Software que sostiene el producto', body: 'Aplicaciones y servicios con Elixir y Java, conectando reglas de negocio, APIs y los flujos que hacen funcionar la operación.', tags: ['Elixir', 'Java', 'APIs'] },
      { title: 'IA conectada al contexto', body: 'RAG, agentes y harnesses que conectan modelos con las fuentes, herramientas y verificaciones que necesita cada tarea.', tags: ['IA aplicada', 'RAG', 'Agentes'] },
      { title: 'Automatizaciones que reducen fricción', body: 'Conecto pasos y sistemas para reducir el trabajo repetitivo, prestando atención a fallos, límites y seguimiento.', tags: ['Automatizaciones', 'Integraciones', 'Flujos'] },
      { title: 'Interfaces para explorar', body: 'Experiencias web y 3D que hacen visible una idea e invitan a interactuar, sin perder de vista el uso real.', tags: ['Web', '3D', 'Interacción'] }
    ] },
    method: { kicker: 'Cómo trabajo', title: 'Entender. Construir. Afinar.', steps: [
      { title: 'Empezar por el problema', body: 'Alineamos objetivo, contexto y límites para definir una entrega que merezca la pena.' },
      { title: 'Montar la primera versión', body: 'Convierto el alcance en algo concreto, con decisiones claras y espacio para tus comentarios.' },
      { title: 'Probar y ajustar', body: 'Validamos el uso, corregimos lo que importa y acordamos los siguientes pasos.' }
    ] },
    about: { kicker: 'Quién está detrás', title: 'Soy João Victor. Puedes llamarme jovi47.', paragraphs: [
      'Me gusta entender cómo funcionan las cosas y construir algo nuevo con lo que aprendo. LEGO forma parte de ese disfrute personal: probar una pieza, cambiar la combinación y descubrir una construcción que antes era solo una idea.',
      'Llevo esa curiosidad al software. Trabajo con Elixir, Java, IA aplicada y automatizaciones, y me entusiasman el 3D y las experiencias interactivas. Me mueve conectar técnica e imaginación con un problema que merece solución.'
    ], signature: 'Curiosidad para explorar. Cuidado para entregar.' },
    game: { kicker: 'Una pausa para construir', title: 'Entra en el playground.', description: 'Explora el espacio y encuentra tres piezas de mi forma de crear. Un pequeño juego con la curiosidad que llevo al trabajo.', start: 'Empezar a explorar', instructions: 'Usa las flechas, WASD o los controles en pantalla para moverte. Reúne las tres piezas y llega a la salida iluminada de la esquina inferior derecha.', up: 'Mover hacia arriba', left: 'Mover a la izquierda', right: 'Mover a la derecha', down: 'Mover hacia abajo', reset: 'Reiniciar exploración', exit: 'Salir del playground', initial: 'Encuentra las tres piezas.', position: 'Posición', remaining: 'Piezas restantes', exitLabel: 'Salida', exitPrompt: '¡Tres piezas reunidas! Ve a la salida de la esquina inferior derecha.', coordinates: 'columna {x}, fila {y}', blocked: 'Fin del camino. Prueba otra dirección.', collected: '¡Pieza encontrada!', win: 'Construcción completa. ¿Creamos la siguiente?', pieces: [
      { name: 'Curiosidad', body: 'Toda buena construcción empieza con una pregunta.' },
      { name: 'Conexión', body: 'Las piezas adecuadas hacen más cuando trabajan juntas.' },
      { name: 'Cuidado', body: 'Probar, ajustar y atender a lo que las personas usarán.' }
    ] },
    contact: { kicker: 'Hablemos', title: '¿Cuál es tu próxima idea?', description: 'Cuéntame qué quieres construir, mejorar o automatizar. La conversación empieza por tu contexto.', whatsapp: 'Hablar por WhatsApp', email: 'Enviar un correo', availability: 'Proyectos y colaboraciones · alcance y disponibilidad previa consulta' },
    footer: { line: 'João Victor · jovi47 · desarrollador freelance', credit: 'Construido con curiosidad, pieza a pieza.' },
    guide: { hero: 'Adelante. En la mesa de trabajo cabe otra buena idea.', work: 'Mira de cerca. Estas piezas ya se convirtieron en proyectos reales.', expertise: 'Hay muchas herramientas. Cada elección tiene su motivo.', method: 'Antes de encajar la pieza, veamos si resuelve el problema.', about: 'Detrás del código hay alguien que aún disfruta construyendo cosas.', play: 'Explora con calma. Prometo no dejar piezas para que las pises.', contact: 'La próxima construcción puede empezar con un simple hola.' },
    privacy: { title: 'Privacidad', intro: 'João Victor (jovi47) es el responsable del tratamiento de datos personales en este portafolio. Contacto: jovi47profissional@gmail.com. Última actualización: 2026-10-22 UTC.', sections: [
      { title: 'Navegación y preferencias', body: 'El sitio no tiene formulario propio, publicidad, analytics ni scripts de seguimiento. Las preferencias de tema y movimiento pueden guardarse en el localStorage del navegador y eliminarse desde sus controles de almacenamiento. El playground no solicita datos personales ni registra partidas.' },
      { title: 'Alojamiento y vista previa', body: 'Esta versión es una vista previa privada del responsable, ofrecida mediante Sites/OpenAI. La plataforma puede procesar direcciones IP, registros técnicos y datos de sesión, incluidas cookies necesarias para la autenticación, según sus propias políticas. La configuración para una futura publicación en Vercel está preparada; esto no significa que el sitio ya esté publicado en ese proveedor. La conservación de los registros de la plataforma sigue las políticas aplicables del proveedor.' },
      { title: 'Contacto y finalidad', body: 'Al escribir por correo o WhatsApp, compartes tus datos de contacto y el contenido de la conversación. Esta información se utiliza para responder y, cuando corresponda, realizar gestiones previas a un contrato a petición tuya. El contacto no supone una suscripción automática a marketing. Evita enviar datos sensibles innecesarios.' },
      { title: 'Conservación y derechos', body: 'Los datos de contacto se conservan el tiempo necesario para responder, gestionar una relación contractual o cumplir obligaciones legales aplicables. Puedes solicitar acceso, corrección o eliminación en jovi47profissional@gmail.com. Cada solicitud considera los derechos aplicables y posibles deberes legales de conservación.' },
      { title: 'Servicios externos', body: 'Los enlaces a WhatsApp, Gmail, GitHub, LinkedIn y los sitios de los proyectos llevan a servicios externos solo cuando los abres. Sus políticas se aplican al uso de esos destinos. Esta página describe el funcionamiento del portafolio y se revisará cuando cambie.' }
    ] },
    terms: { title: 'Términos de uso', intro: 'Este es un portafolio informativo de João Victor (jovi47). Al explorar el sitio, ten en cuenta las siguientes condiciones.', sections: [
      { title: 'Servicios y propuestas', body: 'Los contenidos y las conversaciones iniciales no crean una contratación automática. El alcance, precio, plazo, responsabilidades y condiciones de cada servicio requieren una propuesta y un acuerdo por escrito.' },
      { title: 'Proyectos y materiales', body: 'Los proyectos presentados forman parte del trabajo de João Victor. Las marcas, imágenes y materiales de terceros pertenecen a sus titulares. Su presencia identifica los proyectos y no implica respaldo ni cesión de derechos.' },
      { title: 'Inspiración personal', body: 'LEGO se menciona como interés personal de João Victor. Este portafolio es independiente y no tiene afiliación, patrocinio ni aprobación del LEGO Group.' },
      { title: 'Playground y enlaces', body: 'El playground es una experiencia recreativa, sin compras ni recopilación de datos de jugadores. Los enlaces externos llevan a servicios con términos propios. El contenido y la disponibilidad de los sitios enlazados pueden cambiar.' },
      { title: 'Contacto', body: 'Para aclaraciones o para comunicar un problema, escribe a jovi47profissional@gmail.com. Estas condiciones describen el proyecto y no constituyen asesoramiento jurídico.' }
    ] }
  }
};
