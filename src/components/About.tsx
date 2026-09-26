import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { Stats } from './Stats';

interface AboutProps {
  prefersReducedMotion: boolean;
  onNavigate: (sectionId: string) => void;
}

export const About: React.FC<AboutProps> = ({ prefersReducedMotion, onNavigate }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 10,
      rotateY: x * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-24 sm:py-32 border-t border-white/[0.07]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
          {/* Left Column: About Narrative & Identity */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs font-mono tracking-wider text-blue-400">
              {siteConfig.about.sectionLabel}
            </p>

            <h2
              id="about-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12] [text-wrap:balance]"
            >
              {siteConfig.about.heading}
            </h2>

            <div className="space-y-4 text-base sm:text-[17px] text-slate-300 leading-relaxed max-w-[68ch]">
              {siteConfig.about.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                <span className="text-white font-medium">Core Focus</span>
                <span aria-hidden="true">·</span>
                <span>Responsive Interfaces</span>
                <span aria-hidden="true">·</span>
                <span>Full-Stack Web Apps</span>
                <span aria-hidden="true">·</span>
                <span>Clean Code</span>
              </div>

              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('projects');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                <span>Explore Selected Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Developer Profile Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 [perspective:1100px]"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
              className="relative rounded-2xl bg-[#0B0E17]/90 backdrop-blur-xl border border-white/12 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65)] transition-transform duration-200 ease-out"
            >
              {/* Subtle top highlight line */}
              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
                aria-hidden="true"
              />

              {/* Header Row: Monogram & Availability Indicator */}
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/25 to-indigo-600/20 border border-blue-400/30 flex items-center justify-center font-display text-lg font-bold text-white">
                    {siteConfig.monogram}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {siteConfig.about.developerCard.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-400 font-medium">
                      {siteConfig.about.developerCard.role}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300 whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{siteConfig.about.developerCard.status}</span>
                </div>
              </div>

              {/* Developer Statement */}
              <p className="py-6 text-base sm:text-lg font-medium text-slate-200 leading-relaxed">
                &ldquo;{siteConfig.about.developerCard.statement}&rdquo;
              </p>

              {/* Code-Inspired Architectural Specification Block */}
              <div className="pt-5 border-t border-white/10 font-mono text-xs space-y-2.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">developer.identity</span>
                  <span className="text-white">{siteConfig.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">developer.discipline</span>
                  <span className="text-blue-400">{siteConfig.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">developer.foundation</span>
                  <span className="text-slate-200">HTML · CSS · JavaScript · React · Node.js</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">developer.status</span>
                  <span className="text-cyan-300">{siteConfig.about.developerCard.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Statistics Grid */}
        <Stats prefersReducedMotion={prefersReducedMotion} />
      </div>
    </section>
  );
};
