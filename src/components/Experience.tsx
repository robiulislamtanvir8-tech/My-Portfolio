import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/site';

interface ExperienceProps {
  prefersReducedMotion: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({ prefersReducedMotion }) => {
  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative py-24 sm:py-32 border-t border-white/[0.07]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-14">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-mono tracking-wider text-blue-400">
            DEVELOPER JOURNEY
          </p>
          <h2
            id="journey-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
          >
            Path of continuous engineering craft.
          </h2>
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-6 sm:pl-10 border-l border-white/15 space-y-10">
          {siteConfig.journey.map((item, idx) => (
            <motion.div
              key={item.stepNumber}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group"
            >
              {/* Timeline Node Marker */}
              <span
                className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#050507] border-2 border-blue-500 group-hover:border-cyan-400 transition-colors"
                aria-hidden="true"
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-8 border-b border-white/[0.07] last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 shrink-0 w-44">
                  <span className="tabular-nums">{item.stepNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.phase}</span>
                </div>

                <p className="font-display text-lg sm:text-xl font-semibold text-white leading-snug">
                  {item.statement}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
