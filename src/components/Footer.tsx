import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { siteConfig } from '../config/site';
import { SocialLinkItem } from '../data/socialLinks';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const renderIcon = (id: SocialLinkItem['id']) => {
    switch (id) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#040508] overflow-hidden">
      {/* Subtle Ambient Footer Glow */}
      <div
        className="pointer-events-none absolute -bottom-28 left-1/2 -translate-x-1/2 w-[560px] h-[220px] rounded-full bg-blue-600/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Identity & Tagline */}
          <div className="space-y-2">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
            >
              {siteConfig.name}
            </a>
            <p className="text-sm text-slate-400">
              {siteConfig.footer.tagline}
            </p>
          </div>

          {/* Footer Navigation */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-6 text-sm text-slate-400"
          >
            {siteConfig.navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            {siteConfig.socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target={social.id === 'email' ? undefined : '_blank'}
                rel={social.id === 'email' ? undefined : 'noopener noreferrer'}
                aria-label={
                  social.isPlaceholder
                    ? `${social.label} (configurable placeholder)`
                    : social.label
                }
                title={
                  social.isPlaceholder
                    ? `${social.label} — Configurable in src/data/socialLinks.ts`
                    : social.label
                }
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/50 text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {renderIcon(social.id)}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{siteConfig.footer.copyright}</p>
          <p>
            {siteConfig.name} · {siteConfig.title}
          </p>
        </div>
      </div>
    </footer>
  );
};
