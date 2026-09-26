import { projectsData } from '../data/projects';
import { skillCategories, orbitalSkillNodes } from '../data/skills';
import { socialLinks } from '../data/socialLinks';

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface JourneyStep {
  stepNumber: string;
  phase: string;
  statement: string;
}

export const siteConfig = {
  name: 'Robiul Islam Tanvir',
  monogram: 'RT',
  title: 'Full Stack Web Developer',
  headline: 'Creating Digital Experiences',
  introduction:
    "I build responsive and interactive web applications using modern technologies. Let's create something amazing together!",
  heroFloatingTech: [
    'React',
    'JavaScript',
    'Node.js',
    'Python',
    'PHP',
    'MongoDB',
    'MySQL',
    'AWS',
  ],
  about: {
    sectionLabel: 'ABOUT ME',
    heading: 'Turning Ideas Into Digital Experiences',
    paragraphs: [
      "I'm a passionate web developer with expertise in building modern, responsive websites and web applications. With a strong foundation in HTML, CSS, and JavaScript, I create user-friendly interfaces that deliver real value.",
      "My journey in web development started with a curiosity about how websites work, and it has evolved into a career dedicated to solving complex problems through elegant code. I'm committed to continuous learning and staying updated with the latest web technologies.",
    ],
    developerCard: {
      name: 'Robiul Islam Tanvir',
      role: 'Full Stack Web Developer',
      statement: 'Building modern, scalable and interactive digital experiences.',
      status: 'Available for Projects',
    },
  },
  statistics: [
    {
      id: 'projects',
      value: 50,
      suffix: '+',
      label: 'Projects Completed',
    },
    {
      id: 'clients',
      value: 30,
      suffix: '+',
      label: 'Happy Clients',
    },
    {
      id: 'experience',
      value: 5,
      suffix: '+',
      label: 'Years Experience',
    },
    {
      id: 'satisfaction',
      value: 100,
      suffix: '%',
      label: 'Client Satisfaction',
    },
  ] as StatItem[],
  journey: [
    {
      stepNumber: '01',
      phase: 'Origin',
      statement: 'Started with curiosity about how websites work.',
    },
    {
      stepNumber: '02',
      phase: 'Core Foundation',
      statement: 'Developed a strong foundation in HTML, CSS and JavaScript.',
    },
    {
      stepNumber: '03',
      phase: 'Full-Stack Expansion',
      statement: 'Expanded into modern frontend and backend technologies.',
    },
    {
      stepNumber: '04',
      phase: 'Product Craft',
      statement: 'Focused on building responsive, interactive and valuable digital experiences.',
    },
    {
      stepNumber: '05',
      phase: 'Evolution',
      statement: 'Committed to continuous learning and modern web technologies.',
    },
  ] as JourneyStep[],
  contact: {
    heading: "LET'S BUILD SOMETHING TOGETHER",
    description:
      "Have a project in mind? Let's collaborate! Feel free to reach out and I'll get back to you as soon as possible.",
    email: 'your.email@example.com',
    isEmailPlaceholder: true,
  },
  footer: {
    tagline: 'Full Stack Web Developer | Creating Digital Experiences',
    copyright: '© 2026 Robiul Islam Tanvir. All rights reserved.',
  },
  navigation: [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ],
  seo: {
    title: 'Robiul Islam Tanvir | Full Stack Web Developer',
    description:
      'Robiul Islam Tanvir is a Full Stack Web Developer creating modern, responsive and interactive web applications.',
    canonicalUrl: 'https://ais-pre-7dgvvejb5ysr7gpbijttai-481619202837.europe-west1.run.app/',
  },
  projects: projectsData,
  skills: skillCategories,
  orbitalNodes: orbitalSkillNodes,
  socialLinks,
};
