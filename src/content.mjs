export const content = {
  'pt-br': {
    lang: 'pt-BR', short: 'PT', flag: '🇧🇷',
    title: 'João Victor | Desenvolvedor de software sob medida',
    description: 'Desenvolvedor de software sob medida: sistemas, sites, integrações e automações para o seu negócio. Conheça o trabalho de João Victor, engenheiro de software.',
    nav: { work: 'Projetos', expertise: 'O que construo', about: 'Sobre', contact: 'Vamos conversar' },
    ui: { skip: 'Pular para o conteúdo', theme: 'Alternar tema', motion: 'Alternar movimento', pause: 'Pausar movimento', resume: 'Retomar movimento', menu: 'Abrir menu', prev: 'Projeto anterior', next: 'Próximo projeto', visit: 'Ir para o site', details: 'Ver detalhes', close: 'Fechar', back: 'Voltar', play: 'Explorar o playground', reset: 'Recomeçar', privacy: 'Privacidade', terms: 'Termos de uso', language: 'Escolher idioma' },
    hero: {
      "eyebrow": "João Victor · engenheiro de software",
      "titleTop": "João Victor",
      "titleBottom": "Software feito para o seu negócio",
      "description": "Desenvolvo software sob medida, com sistemas, sites e automações para transformar ideias em soluções que as pessoas conseguem usar. Da definição do escopo à entrega, cada etapa tem um propósito claro.",
      "primary": "Conte seu projeto",
      "secondary": "Explore os projetos",
      "note": "Elixir · Java · IA aplicada · 3D",
      "studioLabel": "Oficina de ideias",
      "studioStatus": "Curiosidade em movimento"
    },
    work: {
      kicker: 'Trabalho real', title: 'Trabalhos realizados', description: 'Sistemas e sites construídos para uma necessidade real. Conheça cada solução e visite os projetos.',
      cases: [
        { id: 'horagora', quote: {"kind": "product", "text": "Sistema de agendamento online para barbearias, salões de beleza e profissionais autônomos. Sua agenda organizada, sem dor de cabeça com a gestão.", "attribution": "HorAgora · Sobre o produto"}, name: 'HorAgora', category: 'SaaS de agendamento', headline: 'Da agenda do negócio à escolha do cliente', description: 'Agendamento online para barbearias, salões e estúdios: o negócio organiza a agenda e compartilha um link para o cliente escolher serviço e horário.', url: 'https://horagora.com.br', tags: ['SaaS', 'Agendamento', 'Reserva online'], role: 'Criação e desenvolvimento', delivery: 'Produto e experiência de reserva', detail: 'Desenvolvi as experiências do negócio e do cliente. O negócio configura serviços, duração, preços e disponibilidade; o cliente acessa o link, escolhe o serviço e confirma um horário disponível. O site público apresenta o produto e demonstra esses dois caminhos.' },
        { id: 'andrea', quote: {"kind": "testimonial", "text": "Muito feliz com o resultado, hoje consegui me posicionar com mais autoridade na internet, além de gerenciar meus clientes de forma tranquila e segura, conforme LGPD", "attribution": "Andréa Sousa"}, name: 'Andréa Sousa Consultoria', category: 'Site de serviços', headline: 'Clareza para dar o primeiro passo', description: 'Um site para explicar serviços de consultoria tributária e orientar a solicitação de análise de isenção ou restituição de IR.', url: 'https://andreasousaconsultoria.com.br', tags: ['Site institucional', 'Serviços', 'Contato'], role: 'Criação e desenvolvimento do site', delivery: 'Site público', detail: 'Desenvolvi o site que reúne apresentação da especialista, serviços, etapas do atendimento, dúvidas frequentes e formulário de solicitação. Organizei as informações para explicar o serviço e orientar o primeiro contato, com políticas acessíveis e controles de preferência de métricas.' }
      ]
    },
    expertise: {
      kicker: 'O que construo', title: 'Tecnologia com um motivo', description: 'Escolho as peças pelo problema. O objetivo é entregar algo útil, compreensível e possível de evoluir.',
      items: [
        { title: 'Sistemas e sites', body: 'Aplicações e serviços que integram regras de negócio, APIs e os fluxos da operação. A tecnologia acompanha a necessidade do projeto.', tags: ['Elixir', 'Java', 'APIs'] },
        { title: 'IA no trabalho real', body: 'RAG, agentes e harnesses que conectam modelos a fontes, ferramentas e verificações úteis para a tarefa.', tags: ['IA aplicada', 'RAG', 'Agentes'] },
        { title: 'Automações úteis', body: 'Conecto etapas e sistemas para reduzir trabalho repetitivo, com atenção a falhas, limites e acompanhamento.', tags: ['Automações', 'Integrações', 'Fluxos'] },
        { title: 'Experiências web e 3D', body: 'Experiências web e 3D que tornam uma ideia visível e convidam à interação, sem perder de vista o uso real.', tags: ['Web', '3D', 'Interação'] },
        { title: 'Acessibilidade', body: 'Navegação por teclado, contraste, legibilidade e interfaces adaptadas a diferentes telas e formas de uso.', tags: ['Acessibilidade', 'Responsividade', 'Usabilidade'] },
        { title: 'SEO e indexação', body: 'Conteúdo organizado, metadados e sitemap para ajudar os buscadores a encontrar e compreender seu site.', tags: ['SEO', 'Conteúdo', 'Indexação'] }
      ]
    },
    building: {
      title: "Minha construção",
      description: "Da base técnica aos produtos e às novas possibilidades: quatro frentes que se conectam no meu trabalho.",
      floors: [
        {"name":"Fundamentos","tag":"BASE","title":"Lógica que vira software","body":"Java e Elixir fazem parte do meu repertório para construir sistemas e serviços. Projetos públicos em Java, como xadrez em terminal e uma aplicação JavaFX com JDBC, mostram essa base em prática.","skills":[{"name":"Java"},{"name":"Elixir"}]},
        {"name":"Produtos","tag":"PRODUTO","title":"Ideias que você pode explorar","body":"Criei o HorAgora, com agendamento online e reserva pelo cliente, e o site da Andréa Sousa Consultoria, que apresenta os serviços e recebe solicitações de análise. Dois contextos reais, duas experiências próprias.","skills":[{"name":"Web"}]},
        {"name":"IA aplicada","tag":"CONTEXTO","title":"IA conectada ao trabalho","body":"Trabalho com RAG para consultar fontes de conhecimento e com agentes e harnesses para organizar contexto, ferramentas, execução e verificação. A aplicação começa pelo processo que precisa de ajuda.","skills":[{"name":"IA aplicada"},{"name":"RAG"},{"name":"Harnesses e agentes"}]},
        {"name":"Exploração","tag":"POSSIBILIDADES","title":"Novas formas de dar vida","body":"Exploro geração 3D com IA e experiências interativas. A curiosidade de montar LEGO também está aqui: experimentar combinações e tornar uma ideia visível, sem confundir exploração com domínio completo.","skills":[{"name":"3D"}]}
      ]
    },
    skills: {
      "title": "Meu repertório",
      "description": "Do software à IA aplicada, escolho as ferramentas pelo problema que precisamos resolver.",
      "items": [
        {
          "name": "Elixir",
          "detail": "Aplicações, serviços e regras de negócio."
        },
        {
          "name": "Java",
          "detail": "Sistemas, APIs e integrações."
        },
        {
          "name": "IA aplicada",
          "detail": "Modelos conectados a tarefas e ferramentas."
        },
        {
          "name": "RAG",
          "detail": "Busca de contexto em bases de conhecimento."
        },
        {
          "name": "Harnesses e agentes",
          "detail": "Contexto, ferramentas, execução e verificação."
        },
        {
          "name": "Web",
          "detail": "Sites e experiências digitais para uso real."
        },
        {
          "name": "3D",
          "detail": "Exploração criativa e experimentos visuais."
        }
      ]
    },
    trust: {
      "title": "Como trabalho",
      "description": "Quatro compromissos para acompanhar o trabalho do começo aos próximos passos.",
      "items": [
        {
          "title": "Escopo explícito",
          "body": "Combinamos objetivo, entrega e limites antes de construir."
        },
        {
          "title": "Versões acompanháveis",
          "body": "Compartilho versões para você ver o trabalho e dar retorno."
        },
        {
          "title": "Validação de uso",
          "body": "Testamos os caminhos importantes e ajustamos o que precisa melhorar."
        },
        {
          "title": "Continuidade combinada",
          "body": "Alinhamos entrega, orientações e próximos passos conforme a proposta."
        }
      ]
    },
    method: { kicker: 'Como trabalho', title: 'Entender. Construir. Refinar', steps: [
      { title: 'Começar pelo problema', body: 'Alinhamos objetivo, contexto e limites para definir uma entrega que valha a pena.' },
      { title: 'Montar a primeira versão', body: 'Transformo o escopo em algo concreto, com decisões claras e espaço para você acompanhar.' },
      { title: 'Testar e ajustar', body: 'Validamos o uso, corrigimos o que importa e combinamos os próximos passos.' }
    ] },
    about: {
      "kicker": "Quem está por aqui",
      "title": "Prazer, João Victor",
      "paragraphs": [
        "Gosto de entender como as coisas funcionam e de montar algo novo com esse aprendizado. LEGO faz parte desse prazer pessoal: experimentar uma peça, mudar a combinação e descobrir uma construção que antes era só uma ideia.",
        "Levo essa curiosidade para o software. Trabalho com Elixir, Java, IA aplicada e automações, e me entusiasmo com 3D e experiências interativas. O que me move é conectar técnica e imaginação a um problema que merece solução."
      ],
      "signature": "Curiosidade para explorar. Cuidado para entregar."
    },
    world: {
      "guided": "Tour guiado",
      "exploded": "Vista explodida",
      "exploring": "Explorando a cidade",
      "location": "Localização",
      "loading": "Montando o miniworld 3D…",
      "failed": "Não foi possível abrir o mundo 3D. Você pode explorar os projetos e entrar em contato nesta página.",
      "projectNames": {
        "horagora": "HorAgora",
        "andrea": "Andréa Sousa Consultoria"
      },
      "canvasLabel": "Miniworld 3D com prédio de habilidades, projetos e área para construir uma interrogação.",
      "rotateLeft": "Girar à esquerda",
      "rotateRight": "Girar à direita",
      "explode": "Separar os andares",
      "reset": "Reiniciar o mundo",
      "explore": "Explorar a cidade",
      "back": "Voltar ao tour",
      "walk": "Caminhar",
      "questionGoal": "Explore a cidade e segure Construir para montar a interrogação. Ao completar, conte a ideia do seu projeto."
    },
    inquiry: {
      "title": "O que você quer construir?",
      "description": "Conte o que você quer construir. Vamos preparar um rascunho de e-mail para começar a conversa.",
      "name": "Seu nome",
      "email": "Seu e-mail",
      "country": "País do número",
      "phone": "Telefone",
      "phoneHint": "Escolha o país. O número é formatado ao digitar; ao colar com +DDI, o país é reconhecido. Sem ramal.",
      "emailError": "Informe um e-mail válido, como nome@dominio.com.",
      "phoneError": "Informe um telefone válido para o país do número, sem ramal.",
      "loadingValidation": "Carregando validação do telefone…",
      "validationUnavailable": "Não foi possível validar o telefone agora. Tente preparar o e-mail novamente.",
      "invalidFields": "Revise os campos antes de preparar o rascunho.",
      "project": "Conte sobre seu projeto",
      "submit": "Preparar e-mail",
      "note": "Os campos ficam temporariamente no navegador, sem banco de dados ou envio por este site. Preparar e-mail gera o rascunho e mostra o link Abrir meu e-mail. Só esse link abre seu aplicativo; você revisa e decide se envia.",
      "success": "Rascunho pronto. Use Abrir meu e-mail, revise e decida se envia.",
      "back": "Voltar à cidade"
    },
    game: {
      "title": "Sua próxima construção",
      "description": "Caminhe pela cidade e construa uma grande interrogação com 32 peças. A próxima ideia pode ser a sua.",
      "start": "Entrar na cidade",
      "instructions": "Explore com WASD, setas ou os controles na tela. Segure Construir, Espaço ou Enter para montar a interrogação; solte para parar. Você pode construir de qualquer ponto da cidade. Ao completar, prepare o rascunho do seu projeto. Sem cronômetro.",
      "exit": "Sair da cidade",
      "initial": "A interrogação está por perto. Vamos construir?",
      "building": "Construindo a interrogação.",
      "complete": "Interrogação pronta! Agora, qual é a sua ideia?",
      "idleMode": "Explore a cidade ou segure Construir para montar a interrogação.",
      "holdMode": "Construindo — solte para parar.",
      "progressLabel": "Peças",
      "floorLabel": "Construção",
      "roofLabel": "Conclusão",
      "build": "Construir",
      "reset": "Reiniciar"
    },
    contact: { kicker: 'Vamos conversar', title: 'O que você quer construir?', description: 'Conte o que você quer construir, melhorar ou automatizar. A conversa começa pelo seu contexto.', whatsapp: 'Conversar no WhatsApp', email: 'Enviar um e-mail', availability: 'Projetos e colaborações · escopo e disponibilidade sob consulta' },
    footer: { line: 'João Victor · ojoaovsousa · engenheiro de software', credit: 'Construído com curiosidade, peça por peça.' },
    guide: { hero: 'Pode chegar. A bancada tem espaço para mais uma boa ideia.', work: 'Pode olhar de perto. Essas peças já viraram projetos de verdade.', expertise: 'A caixa de ferramentas é variada. A escolha tem motivo.', method: 'Antes de encaixar, vale conferir se a peça resolve o problema.', about: 'Por trás do código tem alguém que ainda gosta de montar coisas.', play: 'Segure a ideia. Eu ajudo com as peças.', contact: 'A próxima construção pode começar com um simples olá.' },
    privacy: {
      "title": "Privacidade",
      "intro": "João Victor (ojoaovsousa) é o responsável pelo tratamento de dados neste portfólio. Contato: jovi47profissional@gmail.com. Última atualização: 2026-10-22 UTC.",
      "sections": [
        {
          "title": "Navegação e preferências",
          "body": "O site não usa publicidade, analytics ou scripts de rastreamento. Preferências de tema e movimento podem ser salvas no localStorage do navegador e removidas pelos seus controles de armazenamento. O miniworld não registra partidas nem envia a posição do personagem a um servidor."
        },
        {
          "title": "Hospedagem e prévia",
          "body": "Esta versão é uma prévia privada do responsável, disponibilizada pelo Sites/OpenAI. A plataforma pode processar endereço IP, registros técnicos e dados de sessão, inclusive cookies necessários à autenticação, conforme suas próprias políticas. A configuração para uma futura publicação na Vercel está preparada, mas não significa que o site já esteja publicado nesse provedor. Os prazos dos registros da plataforma seguem as políticas aplicáveis do provedor."
        },
        {
          "title": "Rascunho de projeto",
          "body": "O formulário de briefing usa nome, e-mail, telefone e descrição do projeto apenas para preparar um rascunho local de contato. Os campos ficam temporariamente na página, sem banco de dados, gravação no localStorage ou envio a um backend. Nenhuma solicitação com esses campos é enviada enquanto você preenche. Preparar e-mail gera um rascunho e mostra o link Abrir meu e-mail, sem abrir o aplicativo ou transmitir os campos. Ao abrir esse link mailto, os dados são encaminhados ao aplicativo de e-mail; a partir daí, as políticas desse aplicativo se aplicam. Você revisa o rascunho e escolhe se envia. Não há envio automático nem inscrição em marketing."
        },
        {
          "title": "Contato e finalidade",
          "body": "Ao escrever por e-mail ou WhatsApp, você compartilha dados de contato e o conteúdo da conversa. Essas informações são usadas para responder à solicitação e, quando cabível, realizar procedimentos preliminares a uma contratação a seu pedido. O contato não gera inscrição automática em marketing. Evite enviar dados sensíveis desnecessários."
        },
        {
          "title": "Conservação e direitos",
          "body": "Dados de contato são mantidos pelo tempo necessário para responder, conduzir a relação contratual ou cumprir obrigações legais aplicáveis. Você pode solicitar acesso, correção ou exclusão pelo e-mail jovi47profissional@gmail.com. Cada solicitação considera os direitos aplicáveis e eventuais deveres legais de conservação."
        },
        {
          "title": "Serviços externos",
          "body": "Links de WhatsApp, Gmail, GitHub, LinkedIn e dos projetos levam a serviços externos somente quando você os abre. As políticas desses destinos se aplicam ao uso deles. Esta página descreve o funcionamento deste portfólio e será revista quando esse funcionamento mudar."
        }
      ]
    },
    terms: {
      title: 'Termos de uso', intro: 'Este é um portfólio informativo de João Victor (ojoaovsousa). Ao explorar o site, considere as condições abaixo.', sections: [
        { title: 'Serviços e propostas', body: 'Conteúdos e conversas iniciais não criam contratação automática. Escopo, preço, prazo, responsabilidades e condições de cada serviço dependem de proposta e acordo por escrito.' },
        { title: 'Projetos e materiais', body: 'Os projetos apresentados fazem parte do trabalho de João Victor. Marcas, imagens e materiais de terceiros pertencem a seus titulares. Sua presença identifica os projetos e não implica endosso ou transferência de direitos.' },
        { title: 'Inspiração pessoal', body: 'LEGO é mencionado como interesse pessoal de João Victor. Este portfólio é independente e não tem afiliação, patrocínio ou aprovação do LEGO Group.' },
        { title: 'Playground e links', body: 'O miniworld é uma experiência recreativa, sem compras ou registro remoto de partidas. O briefing prepara um rascunho no seu aplicativo de e-mail e não envia uma solicitação por conta própria. Links externos levam a serviços com termos próprios. Conteúdo e disponibilidade dos sites vinculados podem mudar.' },
        { title: 'Contato', body: 'Para esclarecer o conteúdo ou comunicar um problema, escreva para jovi47profissional@gmail.com. Estas condições descrevem o projeto e não constituem parecer jurídico.' }
      ]
    }
  },
  en: {
    lang: 'en-GB', short: 'EN', flag: '🇬🇧',
    title: 'João Victor | Custom software developer',
    description: 'Custom software developer for business systems, websites, integrations and automation. Explore the work of João Victor, software engineer.',
    nav: { work: 'Work', expertise: 'What I build', about: 'About', contact: 'Let’s talk' },
    ui: { skip: 'Skip to content', theme: 'Switch theme', motion: 'Toggle motion', pause: 'Pause motion', resume: 'Resume motion', menu: 'Open menu', prev: 'Previous project', next: 'Next project', visit: 'Visit the website', details: 'View details', close: 'Close', back: 'Back', play: 'Explore the playground', reset: 'Start again', privacy: 'Privacy', terms: 'Terms of use', language: 'Choose language' },
    hero: {
      "eyebrow": "João Victor · software engineer",
      "titleTop": "João Victor",
      "titleBottom": "Software built for your business",
      "description": "I build custom software, websites and automation that turn ideas into solutions people can use. From defining the scope to delivery, every step has a clear purpose.",
      "primary": "Tell me about your project",
      "secondary": "Explore my work",
      "note": "Elixir · Java · Applied AI · 3D",
      "studioLabel": "Idea workshop",
      "studioStatus": "Curiosity in motion"
    },
    work: {
      kicker: 'Real work', title: 'Completed work', description: 'Software and websites built around a practical need. Explore each solution and visit the live sites.', cases: [
        { id: 'horagora', quote: {"kind": "product", "text": "Online scheduling for barbershops, beauty salons and self-employed professionals. Your schedule organised, without the headaches of managing it.", "attribution": "HorAgora · About the product"}, name: 'HorAgora', category: 'Scheduling SaaS', headline: 'From the business diary to the customer’s choice', description: 'Online scheduling for barbershops, salons and studios: businesses organise their diary and share a link for customers to choose a service and time.', url: 'https://horagora.com.br', tags: ['SaaS', 'Scheduling', 'Online booking'], role: 'Creation and development', delivery: 'Product and booking experience', detail: 'I developed the business and customer experiences. Businesses configure services, duration, prices and availability; customers follow the link, choose a service and confirm an available time. The public website presents the product and demonstrates both journeys.' },
        { id: 'andrea', quote: {"kind": "testimonial", "text": "I’m very happy with the result. Today I can present myself with more authority online and manage my clients calmly and securely, in line with the LGPD.", "attribution": "Andréa Sousa"}, name: 'Andréa Sousa Consultoria', category: 'Services website', headline: 'Clarity for the first step', description: 'A website explaining tax consultancy services and guiding visitors towards an assessment for income-tax exemption or refunds.', url: 'https://andreasousaconsultoria.com.br', tags: ['Business website', 'Services', 'Contact'], role: 'Website creation and development', delivery: 'Public website', detail: 'I developed the website bringing together the specialist’s introduction, services, process, FAQs and an enquiry form. I organised the content to explain the service and guide the first contact, with accessible policies and analytics preference controls.' }
      ]
    },
    expertise: { kicker: 'What I build', title: 'Technology with a purpose', description: 'I choose the pieces to fit the problem. The aim is something useful, understandable and ready to evolve.', items: [
      { title: 'Software and websites', body: 'Applications and services connecting business rules, APIs and operational workflows. Technology follows the needs of the project.', tags: ['Elixir', 'Java', 'APIs'] },
      { title: 'AI put to work', body: 'RAG, agents and harnesses connecting models to the sources, tools and checks that a task needs.', tags: ['Applied AI', 'RAG', 'Agents'] },
      { title: 'Useful automation', body: 'Connecting steps and systems to reduce repetitive work, with attention to failures, limits and visibility.', tags: ['Automation', 'Integrations', 'Workflows'] },
      { title: 'Web and 3D experiences', body: 'Web and 3D experiences that make an idea visible and invite interaction, while keeping real use in focus.', tags: ['Web', '3D', 'Interaction'] },
      { title: 'Accessibility', body: 'Keyboard navigation, contrast, readability and interfaces adapted to different screens and ways of interacting.', tags: ['Accessibility', 'Responsive design', 'Usability'] },
      { title: 'SEO and indexing', body: 'Organised content, metadata and sitemaps to help search engines find and understand your website.', tags: ['SEO', 'Content', 'Indexing'] }
    ] },
    building: {
      title: "What I’m building on",
      description: "From technical foundations to products and new possibilities: four connected strands of my work.",
      floors: [
        {"name":"Foundations","tag":"FOUNDATION","title":"Logic becomes software","body":"Java and Elixir are part of my toolkit for building software and services. Public Java projects, including terminal chess and a JavaFX application with JDBC, put these foundations into practice.","skills":[{"name":"Java"},{"name":"Elixir"}]},
        {"name":"Products","tag":"PRODUCT","title":"Ideas you can explore","body":"I created HorAgora, with online scheduling and customer booking, and the Andréa Sousa Consultoria website, which presents services and receives assessment requests. Two real contexts, two distinct experiences.","skills":[{"name":"Web"}]},
        {"name":"Applied AI","tag":"CONTEXT","title":"AI connected to the task","body":"I work with RAG to retrieve knowledge sources, and with agents and harnesses to organise context, tools, execution and verification. The starting point is the process that needs support.","skills":[{"name":"Applied AI"},{"name":"RAG"},{"name":"Agent harnesses"}]},
        {"name":"Exploration","tag":"POSSIBILITIES","title":"New ways to bring ideas to life","body":"I explore AI-assisted 3D generation and interactive experiences. My enjoyment of building LEGO is reflected here too: trying combinations and making an idea visible, while treating exploration as ongoing learning.","skills":[{"name":"3D"}]}
      ]
    },
    skills: {
      "title": "My toolkit",
      "description": "From software to applied AI, I choose tools around the problem we need to solve.",
      "items": [
        {
          "name": "Elixir",
          "detail": "Applications, services and business rules."
        },
        {
          "name": "Java",
          "detail": "Software, APIs and integrations."
        },
        {
          "name": "Applied AI",
          "detail": "Models connected to tasks and tools."
        },
        {
          "name": "RAG",
          "detail": "Retrieving context from knowledge sources."
        },
        {
          "name": "Agent harnesses",
          "detail": "Context, tools, execution and verification."
        },
        {
          "name": "Web",
          "detail": "Websites and digital experiences for real use."
        },
        {
          "name": "3D",
          "detail": "Creative exploration and visual experiments."
        }
      ]
    },
    trust: {
      "title": "How I work",
      "description": "Four commitments to help you follow the work from the first step to what comes next.",
      "items": [
        {
          "title": "Explicit scope",
          "body": "We agree on the goal, deliverables and boundaries before building."
        },
        {
          "title": "Versions you can follow",
          "body": "I share versions so you can see the work and give feedback."
        },
        {
          "title": "Real-use validation",
          "body": "We test important journeys and refine what needs attention."
        },
        {
          "title": "Agreed next steps",
          "body": "We align on handover, guidance and next steps within the proposal."
        }
      ]
    },
    method: { kicker: 'How I work', title: 'Understand. Build. Refine', steps: [
      { title: 'Start with the problem', body: 'We align on the goal, context and constraints to define a worthwhile delivery.' },
      { title: 'Build the first version', body: 'I turn the scope into something tangible, with clear decisions and room for your feedback.' },
      { title: 'Test and adjust', body: 'We validate real use, address what matters and agree on the next steps.' }
    ] },
    about: {
      "kicker": "Who’s behind this",
      "title": "Hello, I’m João Victor",
      "paragraphs": [
        "I enjoy understanding how things work and building something new with what I learn. LEGO is part of that personal enjoyment: trying a piece, changing the combination and discovering a build that was once just an idea.",
        "I bring that curiosity to software. I work with Elixir, Java, applied AI and automation, and I’m excited by 3D and interactive experiences. What drives me is connecting craft and imagination to a problem worth solving."
      ],
      "signature": "Curiosity to explore. Care to deliver."
    },
    world: {
      "guided": "Guided tour",
      "exploded": "Exploded view",
      "exploring": "Exploring the city",
      "location": "Location",
      "loading": "Building the 3D miniworld…",
      "failed": "The 3D world could not open. You can still explore the projects and get in touch on this page.",
      "projectNames": {
        "horagora": "HorAgora",
        "andrea": "Andréa Sousa Consultoria"
      },
      "canvasLabel": "3D miniworld with a skills building, projects and an area for building a question mark.",
      "rotateLeft": "Rotate left",
      "rotateRight": "Rotate right",
      "explode": "Separate the floors",
      "reset": "Restart world",
      "explore": "Explore the city",
      "back": "Back to the tour",
      "walk": "Walk",
      "questionGoal": "Explore the city and hold Build to assemble the question mark. Once complete, tell me about your project idea."
    },
    inquiry: {
      "title": "What would you like to build?",
      "description": "Tell me what you want to build. We’ll prepare an email draft to start the conversation.",
      "name": "Your name",
      "email": "Your email",
      "country": "Phone number country",
      "phone": "Phone number",
      "phoneHint": "Choose the country. The number formats as you type; pasting an international +code selects its country. No extensions.",
      "emailError": "Enter a valid email, such as name@example.com.",
      "phoneError": "Enter a valid phone number for its country, without an extension.",
      "loadingValidation": "Loading phone validation…",
      "validationUnavailable": "Phone validation is unavailable. Try preparing the email again.",
      "invalidFields": "Review the fields before preparing the draft.",
      "project": "Tell me about your project",
      "submit": "Prepare email",
      "note": "Fields stay temporarily in your browser, with no database or submission by this website. Prepare email creates the draft and displays an Open my email link. Only that link opens your email app; you review it and decide whether to send.",
      "success": "Draft ready. Select Open my email, review it and decide whether to send.",
      "back": "Back to the city"
    },
    game: {
      "title": "Your next build",
      "description": "Walk through the city and build a giant question mark with 32 pieces. The next idea could be yours.",
      "start": "Enter the city",
      "instructions": "Explore with WASD, arrow keys or the on-screen controls. Hold Build, Space or Enter to assemble the question mark; release to stop. You can build from anywhere in the city. Once complete, prepare your project draft. No timer.",
      "exit": "Leave the city",
      "initial": "The question mark is nearby. Shall we build?",
      "building": "Building the question mark.",
      "complete": "Question mark complete! What’s your idea?",
      "idleMode": "Explore the city or hold Build to assemble the question mark.",
      "holdMode": "Building — release to stop.",
      "progressLabel": "Pieces",
      "floorLabel": "Build",
      "roofLabel": "Completion",
      "build": "Build",
      "reset": "Restart"
    },
    contact: { kicker: 'Let’s talk', title: 'What would you like to build?', description: 'Tell me what you want to build, improve or automate. Your context is where the conversation starts.', whatsapp: 'Chat on WhatsApp', email: 'Send an email', availability: 'Projects and collaborations · scope and availability on enquiry' },
    footer: { line: 'João Victor · ojoaovsousa · software engineer', credit: 'Built with curiosity, piece by piece.' },
    guide: { hero: 'Come on in. There’s room on the workbench for another good idea.', work: 'Take a closer look. These pieces became real projects.', expertise: 'Plenty of tools in the box. Each choice has a reason.', method: 'Before it clicks into place, let’s check it solves the problem.', about: 'Behind the code is someone who still loves building things.', play: 'Hold that idea. I’ll help with the pieces.', contact: 'The next build could start with a simple hello.' },
    privacy: {
      "title": "Privacy",
      "intro": "João Victor (ojoaovsousa) is the controller responsible for personal data on this portfolio. Contact: jovi47profissional@gmail.com. Last updated: 2026-10-22 UTC.",
      "sections": [
        {
          "title": "Browsing and preferences",
          "body": "The website uses no advertising, analytics or tracking scripts. Theme and motion preferences may be saved in your browser’s localStorage and removed through its storage controls. The miniworld does not record game sessions or send the character’s position to a server."
        },
        {
          "title": "Hosting and preview",
          "body": "This version is a private preview for the owner, provided through Sites/OpenAI. The platform may process IP addresses, technical logs and session data, including cookies required for authentication, under its own policies. Configuration for a future Vercel deployment is prepared; this does not mean the website is already published with that provider. Platform log retention follows the provider’s applicable policies."
        },
        {
          "title": "Project draft",
          "body": "The briefing form uses your name, email, phone number and project description only to prepare a local contact draft. Fields remain temporarily on the page, with no database, localStorage saving or backend submission. No request containing these fields is sent while you fill them in. Prepare email generates a draft and displays an Open my email link, without opening the app or transmitting the fields. Opening that mailto link passes the data to your email app; that app’s policies then apply. You review the draft and choose whether to send. There is no automatic sending or marketing subscription."
        },
        {
          "title": "Contact and purpose",
          "body": "When you write by email or WhatsApp, you share contact details and the conversation’s content. This information is used to respond and, where relevant, take steps towards a contract at your request. Contacting me does not automatically subscribe you to marketing. Please avoid sending unnecessary sensitive data."
        },
        {
          "title": "Retention and rights",
          "body": "Contact data is retained as needed to respond, manage a contractual relationship or meet applicable legal obligations. You can request access, correction or deletion at jovi47profissional@gmail.com. Requests are considered in light of applicable rights and any legal retention duties."
        },
        {
          "title": "External services",
          "body": "Links to WhatsApp, Gmail, GitHub, LinkedIn and project websites lead to external services only when you open them. Their policies govern your use of those destinations. This notice describes the portfolio’s operation and will be reviewed when that operation changes."
        }
      ]
    },
    terms: { title: 'Terms of use', intro: 'This is an informational portfolio by João Victor (ojoaovsousa). Please consider the following conditions when exploring the website.', sections: [
      { title: 'Services and proposals', body: 'Website content and initial conversations do not automatically create a service contract. Scope, price, schedule, responsibilities and service conditions require a written proposal and agreement.' },
      { title: 'Projects and materials', body: 'The projects shown are part of João Victor’s work. Third-party brands, images and materials belong to their respective owners. Their presence identifies the projects and does not imply endorsement or transfer of rights.' },
      { title: 'Personal inspiration', body: 'LEGO is mentioned as a personal interest of João Victor. This independent portfolio is not affiliated with, sponsored by or approved by the LEGO Group.' },
      { title: 'Playground and links', body: 'The miniworld is a recreational experience with no purchases or remote game-session records. The briefing prepares a draft in your email app and does not send an enquiry by itself. External links lead to services with their own terms. Linked websites’ content and availability may change.' },
      { title: 'Contact', body: 'For clarification or to report a problem, email jovi47profissional@gmail.com. These conditions describe the project and do not constitute legal advice.' }
    ] }
  },
  es: {
    lang: 'es', short: 'ES', flag: '🇪🇸',
    title: 'João Victor | Desarrollador de software a medida',
    description: 'Desarrollador de software a medida: sistemas, sitios web, integraciones y automatizaciones para tu negocio. Conoce el trabajo de João Victor, ingeniero de software.',
    nav: { work: 'Proyectos', expertise: 'Qué construyo', about: 'Sobre mí', contact: 'Hablemos' },
    ui: { skip: 'Saltar al contenido', theme: 'Cambiar tema', motion: 'Alternar movimiento', pause: 'Pausar movimiento', resume: 'Reanudar movimiento', menu: 'Abrir menú', prev: 'Proyecto anterior', next: 'Siguiente proyecto', visit: 'Ir al sitio', details: 'Ver detalles', close: 'Cerrar', back: 'Volver', play: 'Explorar el playground', reset: 'Empezar de nuevo', privacy: 'Privacidad', terms: 'Términos de uso', language: 'Elegir idioma' },
    hero: {
      "eyebrow": "João Victor · ingeniero de software",
      "titleTop": "João Victor",
      "titleBottom": "Software hecho para tu negocio",
      "description": "Desarrollo software a medida, con sistemas, sitios web y automatizaciones para convertir ideas en soluciones que las personas puedan usar. Desde la definición del alcance hasta la entrega, cada etapa tiene un propósito claro.",
      "primary": "Cuéntame tu proyecto",
      "secondary": "Explora los proyectos",
      "note": "Elixir · Java · IA aplicada · 3D",
      "studioLabel": "Taller de ideas",
      "studioStatus": "Curiosidad en movimiento"
    },
    work: { kicker: 'Trabajo real', title: 'Trabajos realizados', description: 'Sistemas y sitios construidos para una necesidad concreta. Conoce cada solución y visita los sitios.', cases: [
      { id: 'horagora', quote: {"kind": "product", "text": "Sistema de reservas online para barberías, salones de belleza y profesionales autónomos. Tu agenda organizada, sin dolores de cabeza con la gestión.", "attribution": "HorAgora · Sobre el producto"}, name: 'HorAgora', category: 'SaaS de reservas', headline: 'De la agenda del negocio a la elección del cliente', description: 'Reservas online para barberías, salones y estudios: el negocio organiza su agenda y comparte un enlace para que el cliente elija servicio y horario.', url: 'https://horagora.com.br', tags: ['SaaS', 'Agenda', 'Reservas online'], role: 'Creación y desarrollo', delivery: 'Producto y experiencia de reserva', detail: 'Desarrollé las experiencias del negocio y del cliente. El negocio configura servicios, duración, precios y disponibilidad; el cliente accede al enlace, elige un servicio y confirma un horario disponible. El sitio público presenta el producto y demuestra ambos recorridos.' },
      { id: 'andrea', quote: {"kind": "testimonial", "text": "Muy feliz con el resultado. Hoy he conseguido posicionarme con más autoridad en internet y gestionar a mis clientes con tranquilidad y seguridad, conforme a la LGPD.", "attribution": "Andréa Sousa"}, name: 'Andréa Sousa Consultoria', category: 'Sitio de servicios', headline: 'Claridad para dar el primer paso', description: 'Un sitio para explicar servicios de consultoría tributaria y orientar la solicitud de análisis de exención o devolución del impuesto sobre la renta.', url: 'https://andreasousaconsultoria.com.br', tags: ['Sitio corporativo', 'Servicios', 'Contacto'], role: 'Creación y desarrollo del sitio', delivery: 'Sitio público', detail: 'Desarrollé el sitio que reúne la presentación de la especialista, servicios, etapas de atención, preguntas frecuentes y formulario de solicitud. Organicé la información para explicar el servicio y orientar el primer contacto, con políticas accesibles y controles de preferencias de métricas.' }
    ] },
    expertise: { kicker: 'Qué construyo', title: 'Tecnología con un propósito', description: 'Elijo las piezas según el problema. El objetivo es entregar algo útil, comprensible y que pueda evolucionar.', items: [
      { title: 'Sistemas y sitios', body: 'Aplicaciones y servicios que conectan reglas de negocio, APIs y los flujos de la operación. La tecnología acompaña las necesidades del proyecto.', tags: ['Elixir', 'Java', 'APIs'] },
      { title: 'IA en el trabajo real', body: 'RAG, agentes y harnesses que conectan modelos con las fuentes, herramientas y verificaciones que necesita cada tarea.', tags: ['IA aplicada', 'RAG', 'Agentes'] },
      { title: 'Automatizaciones útiles', body: 'Conecto pasos y sistemas para reducir el trabajo repetitivo, prestando atención a fallos, límites y seguimiento.', tags: ['Automatizaciones', 'Integraciones', 'Flujos'] },
      { title: 'Experiencias web y 3D', body: 'Experiencias web y 3D que hacen visible una idea e invitan a interactuar, sin perder de vista el uso real.', tags: ['Web', '3D', 'Interacción'] },
      { title: 'Accesibilidad', body: 'Navegación con teclado, contraste, legibilidad e interfaces adaptadas a distintas pantallas y formas de uso.', tags: ['Accesibilidad', 'Diseño adaptable', 'Usabilidad'] },
      { title: 'SEO e indexación', body: 'Contenido organizado, metadatos y sitemap para ayudar a los buscadores a encontrar y comprender tu sitio.', tags: ['SEO', 'Contenido', 'Indexación'] }
    ] },
    building: {
      title: "Mi construcción",
      description: "De la base técnica a los productos y las nuevas posibilidades: cuatro áreas conectadas en mi trabajo.",
      floors: [
        {"name":"Fundamentos","tag":"BASE","title":"Lógica hecha software","body":"Java y Elixir forman parte de mi repertorio para construir sistemas y servicios. Proyectos públicos en Java, como ajedrez en terminal y una aplicación JavaFX con JDBC, muestran esta base en práctica.","skills":[{"name":"Java"},{"name":"Elixir"}]},
        {"name":"Productos","tag":"PRODUCTO","title":"Ideas que puedes explorar","body":"Creé HorAgora, con agenda online y reservas del cliente, y el sitio de Andréa Sousa Consultoria, que presenta servicios y recibe solicitudes de análisis. Dos contextos reales, dos experiencias propias.","skills":[{"name":"Web"}]},
        {"name":"IA aplicada","tag":"CONTEXTO","title":"IA conectada al trabajo","body":"Trabajo con RAG para consultar fuentes de conocimiento y con agentes y harnesses para organizar contexto, herramientas, ejecución y verificación. El punto de partida es el proceso que necesita apoyo.","skills":[{"name":"IA aplicada"},{"name":"RAG"},{"name":"Harnesses y agentes"}]},
        {"name":"Exploración","tag":"POSIBILIDADES","title":"Nuevas formas de dar vida","body":"Exploro generación 3D con IA y experiencias interactivas. Mi afición a montar LEGO también está aquí: probar combinaciones y hacer visible una idea, manteniendo la exploración como aprendizaje continuo.","skills":[{"name":"3D"}]}
      ]
    },
    skills: {
      "title": "Mi repertorio",
      "description": "Del software a la IA aplicada, elijo las herramientas según el problema que necesitamos resolver.",
      "items": [
        {
          "name": "Elixir",
          "detail": "Aplicaciones, servicios y reglas de negocio."
        },
        {
          "name": "Java",
          "detail": "Sistemas, APIs e integraciones."
        },
        {
          "name": "IA aplicada",
          "detail": "Modelos conectados a tareas y herramientas."
        },
        {
          "name": "RAG",
          "detail": "Búsqueda de contexto en bases de conocimiento."
        },
        {
          "name": "Harnesses y agentes",
          "detail": "Contexto, herramientas, ejecución y verificación."
        },
        {
          "name": "Web",
          "detail": "Sitios y experiencias digitales para uso real."
        },
        {
          "name": "3D",
          "detail": "Exploración creativa y experimentos visuales."
        }
      ]
    },
    trust: {
      "title": "Cómo trabajo",
      "description": "Cuatro compromisos para seguir el trabajo desde el comienzo hasta los siguientes pasos.",
      "items": [
        {
          "title": "Alcance explícito",
          "body": "Acordamos objetivo, entrega y límites antes de construir."
        },
        {
          "title": "Versiones que puedes seguir",
          "body": "Comparto versiones para que veas el trabajo y aportes comentarios."
        },
        {
          "title": "Validación de uso",
          "body": "Probamos los recorridos importantes y ajustamos lo que necesita mejorar."
        },
        {
          "title": "Continuidad acordada",
          "body": "Alineamos entrega, orientación y siguientes pasos según la propuesta."
        }
      ]
    },
    method: { kicker: 'Cómo trabajo', title: 'Entender. Construir. Afinar', steps: [
      { title: 'Empezar por el problema', body: 'Alineamos objetivo, contexto y límites para definir una entrega que merezca la pena.' },
      { title: 'Montar la primera versión', body: 'Convierto el alcance en algo concreto, con decisiones claras y espacio para tus comentarios.' },
      { title: 'Probar y ajustar', body: 'Validamos el uso, corregimos lo que importa y acordamos los siguientes pasos.' }
    ] },
    about: {
      "kicker": "Quién está detrás",
      "title": "Encantado, soy João Victor",
      "paragraphs": [
        "Me gusta entender cómo funcionan las cosas y construir algo nuevo con lo que aprendo. LEGO forma parte de ese disfrute personal: probar una pieza, cambiar la combinación y descubrir una construcción que antes era solo una idea.",
        "Llevo esa curiosidad al software. Trabajo con Elixir, Java, IA aplicada y automatizaciones, y me entusiasman el 3D y las experiencias interactivas. Me mueve conectar técnica e imaginación con un problema que merece solución."
      ],
      "signature": "Curiosidad para explorar. Cuidado para entregar."
    },
    world: {
      "guided": "Recorrido guiado",
      "exploded": "Vista explosionada",
      "exploring": "Explorando la ciudad",
      "location": "Ubicación",
      "loading": "Montando el minimundo 3D…",
      "failed": "No se pudo abrir el mundo 3D. Puedes explorar los proyectos y contactar desde esta página.",
      "projectNames": {
        "horagora": "HorAgora",
        "andrea": "Andréa Sousa Consultoria"
      },
      "canvasLabel": "Minimundo 3D con un edificio de habilidades, proyectos y una zona para construir una interrogación.",
      "rotateLeft": "Girar a la izquierda",
      "rotateRight": "Girar a la derecha",
      "explode": "Separar las plantas",
      "reset": "Reiniciar el mundo",
      "explore": "Explorar la ciudad",
      "back": "Volver al recorrido",
      "walk": "Caminar",
      "questionGoal": "Explora la ciudad y mantén Construir pulsado para montar la interrogación. Cuando esté completa, cuéntame la idea de tu proyecto."
    },
    inquiry: {
      "title": "¿Qué quieres construir?",
      "description": "Cuéntame qué quieres construir. Prepararemos un borrador de correo para empezar la conversación.",
      "name": "Tu nombre",
      "email": "Tu correo",
      "country": "País del número",
      "phone": "Teléfono",
      "phoneHint": "Elige el país. El número se formatea al escribir; al pegar un +código internacional se selecciona su país. Sin extensión.",
      "emailError": "Introduce un correo válido, como nombre@dominio.com.",
      "phoneError": "Introduce un teléfono válido para el país del número, sin extensión.",
      "loadingValidation": "Cargando validación del teléfono…",
      "validationUnavailable": "No se pudo validar el teléfono. Intenta preparar el correo de nuevo.",
      "invalidFields": "Revisa los campos antes de preparar el borrador.",
      "project": "Cuéntame tu proyecto",
      "submit": "Preparar correo",
      "note": "Los campos permanecen temporalmente en el navegador, sin base de datos ni envío desde este sitio. Preparar correo crea el borrador y muestra el enlace Abrir mi correo. Solo ese enlace abre tu aplicación; tú lo revisas y decides si lo envías.",
      "success": "Borrador listo. Usa Abrir mi correo, revísalo y decide si lo envías.",
      "back": "Volver a la ciudad"
    },
    game: {
      "title": "Tu próxima construcción",
      "description": "Camina por la ciudad y construye una gran interrogación con 32 piezas. La próxima idea puede ser la tuya.",
      "start": "Entrar en la ciudad",
      "instructions": "Explora con WASD, las flechas o los controles en pantalla. Mantén Construir, Espacio o Enter para montar la interrogación; suelta para parar. Puedes construir desde cualquier punto de la ciudad. Al terminar, prepara el borrador de tu proyecto. Sin cronómetro.",
      "exit": "Salir de la ciudad",
      "initial": "La interrogación está cerca. ¿Construimos?",
      "building": "Construyendo la interrogación.",
      "complete": "¡Interrogación lista! ¿Cuál es tu idea?",
      "idleMode": "Explora la ciudad o mantén Construir pulsado para montar la interrogación.",
      "holdMode": "Construyendo — suelta para parar.",
      "progressLabel": "Piezas",
      "floorLabel": "Construcción",
      "roofLabel": "Finalización",
      "build": "Construir",
      "reset": "Reiniciar"
    },
    contact: { kicker: 'Hablemos', title: '¿Qué quieres construir?', description: 'Cuéntame qué quieres construir, mejorar o automatizar. La conversación empieza por tu contexto.', whatsapp: 'Hablar por WhatsApp', email: 'Enviar un correo', availability: 'Proyectos y colaboraciones · alcance y disponibilidad previa consulta' },
    footer: { line: 'João Victor · ojoaovsousa · ingeniero de software', credit: 'Construido con curiosidad, pieza a pieza.' },
    guide: { hero: 'Adelante. En la mesa de trabajo cabe otra buena idea.', work: 'Mira de cerca. Estas piezas ya se convirtieron en proyectos reales.', expertise: 'Hay muchas herramientas. Cada elección tiene su motivo.', method: 'Antes de encajar la pieza, veamos si resuelve el problema.', about: 'Detrás del código hay alguien que aún disfruta construyendo cosas.', play: 'Mantén esa idea. Yo ayudo con las piezas.', contact: 'La próxima construcción puede empezar con un simple hola.' },
    privacy: {
      "title": "Privacidad",
      "intro": "João Victor (ojoaovsousa) es el responsable del tratamiento de datos personales en este portafolio. Contacto: jovi47profissional@gmail.com. Última actualización: 2026-10-22 UTC.",
      "sections": [
        {
          "title": "Navegación y preferencias",
          "body": "El sitio no utiliza publicidad, analytics ni scripts de seguimiento. Las preferencias de tema y movimiento pueden guardarse en el localStorage del navegador y eliminarse desde sus controles de almacenamiento. El minimundo no registra partidas ni envía la posición del personaje a un servidor."
        },
        {
          "title": "Alojamiento y vista previa",
          "body": "Esta versión es una vista previa privada del responsable, ofrecida mediante Sites/OpenAI. La plataforma puede procesar direcciones IP, registros técnicos y datos de sesión, incluidas cookies necesarias para la autenticación, según sus propias políticas. La configuración para una futura publicación en Vercel está preparada; esto no significa que el sitio ya esté publicado en ese proveedor. La conservación de los registros de la plataforma sigue las políticas aplicables del proveedor."
        },
        {
          "title": "Borrador de proyecto",
          "body": "El formulario de briefing usa nombre, correo, teléfono y descripción del proyecto solo para preparar un borrador local de contacto. Los campos permanecen temporalmente en la página, sin base de datos, guardado en localStorage ni envío a un backend. No se envía ninguna solicitud con esos campos mientras los completas. Preparar correo genera un borrador y muestra el enlace Abrir mi correo, sin abrir la aplicación ni transmitir los campos. Al abrir ese enlace mailto, los datos se pasan a la aplicación de correo; desde entonces se aplican sus políticas. Tú revisas el borrador y decides si lo envías. No hay envío automático ni suscripción a marketing."
        },
        {
          "title": "Contacto y finalidad",
          "body": "Al escribir por correo o WhatsApp, compartes tus datos de contacto y el contenido de la conversación. Esta información se utiliza para responder y, cuando corresponda, realizar gestiones previas a un contrato a petición tuya. El contacto no supone una suscripción automática a marketing. Evita enviar datos sensibles innecesarios."
        },
        {
          "title": "Conservación y derechos",
          "body": "Los datos de contacto se conservan el tiempo necesario para responder, gestionar una relación contractual o cumplir obligaciones legales aplicables. Puedes solicitar acceso, corrección o eliminación en jovi47profissional@gmail.com. Cada solicitud considera los derechos aplicables y posibles deberes legales de conservación."
        },
        {
          "title": "Servicios externos",
          "body": "Los enlaces a WhatsApp, Gmail, GitHub, LinkedIn y los sitios de los proyectos llevan a servicios externos solo cuando los abres. Sus políticas se aplican al uso de esos destinos. Esta página describe el funcionamiento del portafolio y se revisará cuando cambie."
        }
      ]
    },
    terms: { title: 'Términos de uso', intro: 'Este es un portafolio informativo de João Victor (ojoaovsousa). Al explorar el sitio, ten en cuenta las siguientes condiciones.', sections: [
      { title: 'Servicios y propuestas', body: 'Los contenidos y las conversaciones iniciales no crean una contratación automática. El alcance, precio, plazo, responsabilidades y condiciones de cada servicio requieren una propuesta y un acuerdo por escrito.' },
      { title: 'Proyectos y materiales', body: 'Los proyectos presentados forman parte del trabajo de João Victor. Las marcas, imágenes y materiales de terceros pertenecen a sus titulares. Su presencia identifica los proyectos y no implica respaldo ni cesión de derechos.' },
      { title: 'Inspiración personal', body: 'LEGO se menciona como interés personal de João Victor. Este portafolio es independiente y no tiene afiliación, patrocinio ni aprobación del LEGO Group.' },
      { title: 'Playground y enlaces', body: 'El minimundo es una experiencia recreativa, sin compras ni registro remoto de partidas. El briefing prepara un borrador en tu aplicación de correo y no envía una consulta por sí mismo. Los enlaces externos llevan a servicios con términos propios. El contenido y la disponibilidad de los sitios enlazados pueden cambiar.' },
      { title: 'Contacto', body: 'Para aclaraciones o para comunicar un problema, escribe a jovi47profissional@gmail.com. Estas condiciones describen el proyecto y no constituyen asesoramiento jurídico.' }
    ] }
  }
};
