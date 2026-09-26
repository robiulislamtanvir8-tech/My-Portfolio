import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/site';
import { Scene3D } from './Scene3D';

interface HeroProps {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  isMobile,
  prefersReducedMotion,
  onNavigate,
}) => {
  const [activeTech, setActiveTech] = useState<string>('React');

  const headlineWords = siteConfig.headline.split(' ');

  return (
    <section
      id="home"
      aria-label="Introduction and 3D Interactive Showcase"
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-10 sm:pt-28 sm:pb-12 overflow-hidden"
    >
      {/* Subtle Ambient Studio Glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-10 w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl w-full px-5 sm:px-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-wider text-blue-400"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
              <span>FULL STACK WEB DEVELOPER</span>
            </motion.div>

            {/* Word-by-word animated display heading */}
            <h1 className="font-display text-4xl sm:text-6xl xl:text-[68px] font-extrabold tracking-tight text-white leading-[1.06] [text-wrap:balance]">
              {headlineWords.map((word, idx) => (
                <motion.span
                  key={word + idx}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : 0.08 * idx,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block mr-3.5 ${
                    idx === 1
                      ? 'bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent'
                      : 'text-white'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              {siteConfig.introduction}
            </motion.p>

            {/* Primary & Secondary Call-To-Action Buttons */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-150 shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
              </a>

              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('projects');
                }}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-white font-semibold text-sm transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                View My Work
              </a>

              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('about');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
              >
                <span>Explore Portfolio</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            {/* Unboxed Architectural Metadata Line */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400"
            >
              <span className="text-slate-200 font-medium">{siteConfig.name}</span>
              <span aria-hidden="true">·</span>
              <span>Frontend & Backend Architecture</span>
              <span aria-hidden="true">·</span>
              <span>50+ Delivered Projects</span>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Scene */}
          <div className="lg:col-span-6">
            <Scene3D
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
              activeTech={activeTech}
              onSelectTech={setActiveTech}
            />
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="mx-auto max-w-7xl w-full px-5 sm:px-8 pt-6 flex items-center justify-center sm:justify-between">
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('about');
          }}
          className="group inline-flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md py-1"
        >
          <span>Scroll to explore</span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/15 group-hover:border-blue-400/60 transition-colors">
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Interactive 3D Viewport</span>
          <span aria-hidden="true">·</span>
          <span>Click any technology node to inspect</span>
        </div>
      </div>
    </section>
  );
};
