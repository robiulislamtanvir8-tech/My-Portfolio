export interface SocialLinkItem {
  id: 'github' | 'linkedin' | 'twitter' | 'email';
  label: string;
  href: string;
  handle: string;
  isPlaceholder: boolean;
  configNote?: string;
}

/**
 * Central social links configuration.
 * LinkedIn, Twitter, and Email are kept as configurable placeholders per specification
 * so they can be updated in a single place without modifying UI components.
 */
export const socialLinks: SocialLinkItem[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/robiulislamtanvir8-tech',
    handle: '@robiulislamtanvir8-tech',
    isPlaceholder: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourprofile',
    handle: 'in/yourprofile',
    isPlaceholder: true,
    configNote: 'Configurable LinkedIn profile URL in src/data/socialLinks.ts',
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    href: 'https://twitter.com/yourhandle',
    handle: '@yourhandle',
    isPlaceholder: true,
    configNote: 'Configurable Twitter/X profile URL in src/data/socialLinks.ts',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:your.email@example.com',
    handle: 'your.email@example.com',
    isPlaceholder: true,
    configNote: 'Configurable contact email in src/data/socialLinks.ts',
  },
];
