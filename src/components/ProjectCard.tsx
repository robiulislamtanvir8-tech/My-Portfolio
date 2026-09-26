import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { ProjectItem } from '../data/projects';

interface ProjectCardProps {
  project: ProjectItem;
  prefersReducedMotion: boolean;
  onSelect: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  prefersReducedMotion,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -relY * 5,
      y: relX * 5,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.article
      layout
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      data-cursor="project"
      style={{
        transform: prefersReducedMotion
          ? undefined
          : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-blue-500/50 overflow-hidden transition-colors duration-200 cursor-pointer shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
    >
      {/* Subtle Hover Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/0 via-indigo-600/0 to-cyan-500/0 group-hover:from-blue-600/[0.06] group-hover:via-indigo-600/[0.04] group-hover:to-cyan-500/[0.06] transition-colors duration-300"
        aria-hidden="true"
      />

      {/* Preview Image Container with Resilient Fallback */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07090F]">
        {!imageError ? (
          <img
            src={project.image}
            alt={`${project.title} user interface preview`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          /* Styled CSS/SVG Architectural Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0B1021] via-[#0F172A] to-[#080B12] text-center">
            <Layers className="w-9 h-9 text-blue-400/70 mb-2.5" />
            <span className="font-display text-base font-bold text-white">
              {project.number} — {project.title}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {project.technologies.join(' · ')}
            </span>
          </div>
        )}

        {/* Measured Gradient Contrast Scrim */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-[#0B0E17]/25 to-transparent"
          aria-hidden="true"
        />

        {/* Editorial Index Number */}
        <div className="absolute top-4 left-5 font-mono text-xs font-medium tracking-wider text-slate-200 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 tabular-nums">
          {project.number}
        </div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-between p-6 sm:p-7 space-y-5">
        <div className="space-y-2.5">
          {/* Unboxed Static Technology Metadata with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-blue-400 group-hover:text-cyan-300 transition-colors duration-200">
            {project.technologies.map((tech, index) => (
              <React.Fragment key={tech}>
                <span>{tech}</span>
                {index < project.technologies.length - 1 && (
                  <span className="text-slate-600" aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-150">
            {project.number} — {project.title}
          </h3>

          <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            {project.categories.join(' / ')}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1 py-0.5"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
