import ecommerceImg from '../assets/images/project_ecommerce_platform_1790376827082.jpg';
import taskManagerImg from '../assets/images/project_task_manager_1790376839857.jpg';
import weatherDashboardImg from '../assets/images/project_weather_dashboard_1790376850770.jpg';
import socialMediaImg from '../assets/images/project_social_media_1790376863016.jpg';
import videoStreamingImg from '../assets/images/project_video_streaming_1790376873031.jpg';
import portfolioWebsiteImg from '../assets/images/project_portfolio_website_1790376882440.jpg';

export type ProjectCategory = 'All' | 'Frontend' | 'Backend' | 'Full Stack' | 'Web Apps';

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
  categories: Exclude<ProjectCategory, 'All'>[];
  image: string;
  placeholderUrl: string;
  featuredSpan?: 'wide' | 'standard';
  architectureSummary: string;
  keyCapabilities: string[];
  liveUrlConfig: {
    url: string;
    isPlaceholder: boolean;
    repositoryUrl: string;
  };
}

export const projectCategories: ProjectCategory[] = [
  'All',
  'Frontend',
  'Backend',
  'Full Stack',
  'Web Apps',
];

export const projectsData: ProjectItem[] = [
  {
    id: 'ecommerce-platform',
    number: '01',
    title: 'E-Commerce Platform',
    description:
      'A fully functional e-commerce website with product catalog, shopping cart, and secure checkout.',
    technologies: ['HTML/CSS', 'JavaScript', 'React'],
    categories: ['Frontend', 'Full Stack', 'Web Apps'],
    image: ecommerceImg,
    placeholderUrl: 'https://via.placeholder.com/300x200?text=E-Commerce+Platform',
    featuredSpan: 'wide',
    architectureSummary:
      'Component-driven storefront engineered with React and modular state management for dynamic catalog filtering, persistent cart synchronization, and multi-step checkout validation.',
    keyCapabilities: [
      'Dynamic product catalog with instant search and category filtering',
      'Persistent shopping cart state with real-time subtotal calculation',
      'Responsive checkout flow with structured form validation',
    ],
    liveUrlConfig: {
      url: 'https://github.com/robiulislamtanvir8-tech',
      isPlaceholder: true,
      repositoryUrl: 'https://github.com/robiulislamtanvir8-tech',
    },
  },
  {
    id: 'task-manager-app',
    number: '02',
    title: 'Task Manager App',
    description:
      'Interactive task management application with real-time updates and beautiful UI.',
    technologies: ['Vue.js', 'Firebase', 'Responsive Design'],
    categories: ['Frontend', 'Full Stack', 'Web Apps'],
    image: taskManagerImg,
    placeholderUrl: 'https://via.placeholder.com/300x200?text=Task+Manager+App',
    featuredSpan: 'standard',
    architectureSummary:
      'Reactive task orchestration workspace powered by Vue.js and Firebase real-time synchronization, supporting instant status transitions and adaptive layouts across desktop and mobile viewports.',
    keyCapabilities: [
      'Real-time task synchronization backed by Firebase listeners',
      'Interactive status organization and priority workflows',
      'Touch-friendly responsive layout built for cross-device productivity',
    ],
    liveUrlConfig: {
      url: 'https://github.com/robiulislamtanvir8-tech',
      isPlaceholder: true,
      repositoryUrl: 'https://github.com/robiulislamtanvir8-tech',
    },
  },
  {
    id: 'weather-dashboard',
    number: '03',
    title: 'Weather Dashboard',
    description:
      'Real-time weather application with dynamic backgrounds and detailed forecast information.',
    technologies: ['JavaScript', 'API Integration', 'CSS Animations'],
    categories: ['Frontend', 'Web Apps'],
    image: weatherDashboardImg,
    placeholderUrl: 'https://via.placeholder.com/300x200?text=Weather+Dashboard',
    featuredSpan: 'standard',
    architectureSummary:
      'Asynchronous meteorological client integrating live weather APIs with smooth CSS visual transitions that adapt atmospheric states based on real-time local conditions.',
    keyCapabilities: [
      'Live REST API integration for current conditions and multi-day forecasts',
      'Dynamic visual atmosphere shifts driven by weather state codes',
      'Detailed metrics display including humidity, wind velocity, and pressure',
    ],
    liveUrlConfig: {
      url: 'https://github.com/robiulislamtanvir8-tech',
      isPlaceholder: true,
      repositoryUrl: 'https://github.com/robiulislamtanvir8-tech',
    },
  },
  {
    id: 'social-media-platform',
    number: '04',
    title: 'Social Media Platform',
    description:
      'Social networking application with user profiles, messaging, and real-time notifications.',
    technologies: ['Node.js', 'MongoDB', 'Socket.io'],
    categories: ['Backend', 'Full Stack', 'Web Apps'],
    image: socialMediaImg,
    placeholderUrl: 'https://via.placeholder.com/300x200?text=Social+Media+Clone',
    featuredSpan: 'wide',
    architectureSummary:
      'Event-driven social platform combining a Node.js and MongoDB persistence layer with bidirectional Socket.io channels for low-latency messaging and live activity notifications.',
    keyCapabilities: [
      'Bidirectional WebSocket messaging and instant notification delivery',
      'Document-oriented user profiles and activity feeds in MongoDB',
      'Scalable Node.js backend architecture with authenticated sessions',
    ],
    liveUrlConfig: {
      url: 'https://github.com/robiulislamtanvir8-tech',
      isPlaceholder: true,
      repositoryUrl: 'https://github.com/robiulislamtanvir8-tech',
    },
  },
  {
    id: 'video-streaming-platform',
    number: '05',
    title: 'Video Streaming Platform',
    description:
      'Streaming service with video upload, categories, user subscriptions, and watch history.',
    technologies: ['React', 'AWS', 'Stripe'],
    categories: ['Frontend', 'Backend', 'Full Stack', 'Web Apps'],
    image: videoStreamingImg,
    placeholderUrl: 'https://via.placeholder.com/300x200?text=Video+Streaming',
    featuredSpan: 'standard',
    architectureSummary:
      'Full-stack media delivery application integrating React playback interfaces with AWS cloud storage pipelines and Stripe subscription billing workflows.',
    keyCapabilities: [
      'Cloud media upload and categorized video browsing backed by AWS',
      'Subscription tier management and checkout integration with Stripe',
      'Persistent user watch history and resume-playback tracking',
    ],
    liveUrlConfig: {
      url: 'https://github.com/robiulislamtanvir8-tech',
      isPlaceholder: true,
      repositoryUrl: 'https://github.com/robiulislamtanvir8-tech',
    },
  },
  {
    id: 'portfolio-website',
    number: '06',
    title: 'Portfolio Website',
    description:
      'Modern, responsive portfolio website showcasing projects, skills, and professional information.',
    technologies: ['HTML/CSS', 'JavaScript', 'Responsive Design'],
    categories: ['Frontend', 'Web Apps'],
    image: portfolioWebsiteImg,
    placeholderUrl: 'https://via.placeholder.com/300x200?text=Portfolio+Website',
    featuredSpan: 'standard',
    architectureSummary:
      'Interactive developer showcase engineered with semantic markup, responsive grid choreography, and smooth motion transitions for optimal cross-device presentation.',
    keyCapabilities: [
      'Fluid responsive layout across desktop, tablet, and mobile viewports',
      'Interactive project showcase and technology ecosystem presentation',
      'Accessible navigation and high-contrast typographic hierarchy',
    ],
    liveUrlConfig: {
      url: 'https://github.com/robiulislamtanvir8-tech',
      isPlaceholder: true,
      repositoryUrl: 'https://github.com/robiulislamtanvir8-tech',
    },
  },
];
