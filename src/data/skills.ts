export interface SkillCategoryGroup {
  id: 'frontend' | 'backend' | 'database' | 'tools';
  title: string;
  subtitle: string;
  skills: {
    name: string;
    description: string;
  }[];
}

export interface OrbitalSkillNode {
  id: string;
  label: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools & Platforms';
  description: string;
  orbitRing: 1 | 2;
  angleDeg: number;
  accentColor: string;
}

export const skillCategories: SkillCategoryGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Interactive interfaces & responsive client architecture',
    skills: [
      {
        name: 'HTML5',
        description: 'Semantic document structure, accessibility standards, and modern web APIs.',
      },
      {
        name: 'CSS3',
        description: 'Modern layout systems (Grid, Flexbox), custom properties, and hardware-accelerated animations.',
      },
      {
        name: 'JavaScript (ES6+)',
        description: 'Asynchronous programming, modular architecture, and interactive DOM manipulation.',
      },
      {
        name: 'React',
        description: 'Component-driven user interfaces, custom hooks, and declarative state management.',
      },
      {
        name: 'Vue.js',
        description: 'Reactive frontend views, composable component architecture, and clean state transitions.',
      },
      {
        name: 'Responsive Design',
        description: 'Mobile-first fluid layouts engineered for consistency across all device viewports.',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'Server-side logic, APIs & secure authentication',
    skills: [
      {
        name: 'Node.js',
        description: 'Event-driven JavaScript runtime for scalable network and real-time server applications.',
      },
      {
        name: 'Express.js',
        description: 'Modular web application routing, middleware pipelines, and API service architecture.',
      },
      {
        name: 'Python',
        description: 'Clean, versatile server-side scripting, data processing, and backend automation.',
      },
      {
        name: 'PHP',
        description: 'Server-side web application development and dynamic content rendering.',
      },
      {
        name: 'RESTful APIs',
        description: 'Structured resource-oriented endpoints, predictable status contracts, and JSON payloads.',
      },
      {
        name: 'Authentication',
        description: 'Secure session management, token-based authorization, and protected route access.',
      },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    subtitle: 'Relational schemas, document stores & in-memory caching',
    skills: [
      {
        name: 'MongoDB',
        description: 'Document-oriented NoSQL data modeling, aggregation pipelines, and flexible schemas.',
      },
      {
        name: 'MySQL',
        description: 'Relational database architecture, indexed queries, and ACID-compliant transactions.',
      },
      {
        name: 'PostgreSQL',
        description: 'Advanced relational data integrity, complex joins, and structured query optimization.',
      },
      {
        name: 'Firebase',
        description: 'Real-time data synchronization, cloud persistence, and integrated client services.',
      },
      {
        name: 'Redis',
        description: 'High-throughput in-memory key-value caching, session storage, and pub/sub messaging.',
      },
      {
        name: 'SQL',
        description: 'Structured query design, schema normalization, and relational data manipulation.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Platforms',
    subtitle: 'Version control, containerization & cloud deployment',
    skills: [
      {
        name: 'Git & GitHub',
        description: 'Distributed version control, branching workflows, pull requests, and code collaboration.',
      },
      {
        name: 'Docker',
        description: 'Containerized application environments ensuring reproducible builds and deployments.',
      },
      {
        name: 'AWS',
        description: 'Cloud infrastructure, media storage pipelines, and scalable application hosting.',
      },
      {
        name: 'Heroku',
        description: 'Platform-as-a-Service deployment workflows and managed application runtime.',
      },
      {
        name: 'Netlify',
        description: 'Continuous deployment for modern web frontends and global edge delivery.',
      },
      {
        name: 'VS Code',
        description: 'Primary development environment configured with linting, debugging, and workflow extensions.',
      },
    ],
  },
];

export const orbitalSkillNodes: OrbitalSkillNode[] = [
  // Inner Ring (8 nodes)
  {
    id: 'react',
    label: 'React',
    category: 'Frontend',
    description: 'Component-based library for building interactive, stateful user interfaces.',
    orbitRing: 1,
    angleDeg: 0,
    accentColor: '#3B82F6',
  },
  {
    id: 'vue',
    label: 'Vue',
    category: 'Frontend',
    description: 'Progressive framework for reactive, declarative web interfaces.',
    orbitRing: 1,
    angleDeg: 45,
    accentColor: '#06B6D4',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    category: 'Frontend',
    description: 'Core programming language powering dynamic client and server web applications.',
    orbitRing: 1,
    angleDeg: 90,
    accentColor: '#3B82F6',
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    category: 'Backend',
    description: 'Asynchronous event-driven JavaScript runtime for scalable backend services.',
    orbitRing: 1,
    angleDeg: 135,
    accentColor: '#6366F1',
  },
  {
    id: 'express',
    label: 'Express',
    category: 'Backend',
    description: 'Fast, minimalist web framework for Node.js RESTful APIs and web servers.',
    orbitRing: 1,
    angleDeg: 180,
    accentColor: '#6366F1',
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    category: 'Database',
    description: 'NoSQL document database designed for modern application development.',
    orbitRing: 1,
    angleDeg: 225,
    accentColor: '#06B6D4',
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    category: 'Database',
    description: 'Enterprise-grade open-source relational database system.',
    orbitRing: 1,
    angleDeg: 270,
    accentColor: '#3B82F6',
  },
  {
    id: 'aws',
    label: 'AWS',
    category: 'Tools & Platforms',
    description: 'Cloud infrastructure for storage, compute, and full-stack deployment.',
    orbitRing: 1,
    angleDeg: 315,
    accentColor: '#6366F1',
  },

  // Outer Ring (8 nodes)
  {
    id: 'python',
    label: 'Python',
    category: 'Backend',
    description: 'Expressive backend language for web services, scripting, and APIs.',
    orbitRing: 2,
    angleDeg: 22.5,
    accentColor: '#6366F1',
  },
  {
    id: 'php',
    label: 'PHP',
    category: 'Backend',
    description: 'General-purpose scripting language suited for server-side web development.',
    orbitRing: 2,
    angleDeg: 67.5,
    accentColor: '#6366F1',
  },
  {
    id: 'mysql',
    label: 'MySQL',
    category: 'Database',
    description: 'Reliable relational database management system based on structured SQL.',
    orbitRing: 2,
    angleDeg: 112.5,
    accentColor: '#06B6D4',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    category: 'Database',
    description: 'App development platform with real-time database and authentication services.',
    orbitRing: 2,
    angleDeg: 157.5,
    accentColor: '#3B82F6',
  },
  {
    id: 'redis',
    label: 'Redis',
    category: 'Database',
    description: 'In-memory data structure store used as a database, cache, and message broker.',
    orbitRing: 2,
    angleDeg: 202.5,
    accentColor: '#06B6D4',
  },
  {
    id: 'docker',
    label: 'Docker',
    category: 'Tools & Platforms',
    description: 'Platform for developing, shipping, and running applications in containers.',
    orbitRing: 2,
    angleDeg: 247.5,
    accentColor: '#3B82F6',
  },
  {
    id: 'git',
    label: 'Git',
    category: 'Tools & Platforms',
    description: 'Distributed version control system for tracking source code history.',
    orbitRing: 2,
    angleDeg: 292.5,
    accentColor: '#6366F1',
  },
  {
    id: 'github',
    label: 'GitHub',
    category: 'Tools & Platforms',
    description: 'Cloud hosting platform for software collaboration and Git repositories.',
    orbitRing: 2,
    angleDeg: 337.5,
    accentColor: '#3B82F6',
  },
];
