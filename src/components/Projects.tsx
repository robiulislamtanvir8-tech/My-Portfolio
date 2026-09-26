import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, X, CheckCircle2, Layers } from 'lucide-react';
import { siteConfig } from '../config/site';
import {
  ProjectCategory,
  ProjectItem,
  projectCategories,
} from '../data/projects';
import { ProjectCard } from './ProjectCard';

interface ProjectsProps {
  prefersReducedMotion: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  prefersReducedMotion,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [modalImgError, setModalImgError] = useState(false);

  const filteredProjects = siteConfig.projects.filter((project) =>
    selectedCategory === 'All'
      ? true
      : project.categories.includes(selectedCategory)
  );

  useEffect(() => {
    setModalImgError(false);
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative py-24 sm:py-32 border-t border-white/[0.07]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-12">
        {/* Section Header & Interactive Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-mono tracking-wider text-blue-400">
              FEATURED PROJECTS
            </p>
            <h2
              id="projects-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
            >
              Selected work and digital experiences.
            </h2>
          </div>

          {/* Interactive Filter Bar (Functional Segmented Buttons) */}
          <div
            role="tablist"
            aria-label="Filter projects by technology domain"
            className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-[#0B0E17] border border-white/10 self-start lg:self-auto"
          >
            {projectCategories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                prefersReducedMotion={prefersReducedMotion}
                onSelect={(proj) => setActiveProject(proj)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Case Study & Interactive Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="project-detail-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { scale: 0.96, y: 12, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl bg-[#0B0E17] border border-white/15 overflow-hidden shadow-2xl my-auto"
            >
              {/* Modal Media Header */}
              <div className="relative aspect-[16/9] w-full bg-[#07090F] overflow-hidden">
                {!modalImgError ? (
                  <img
                    src={activeProject.image}
                    alt={`${activeProject.title} detailed preview`}
                    referrerPolicy="no-referrer"
                    onError={() => setModalImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0B1021] to-[#080B12]">
                    <Layers className="w-10 h-10 text-blue-400 mb-3" />
                    <span className="font-display text-xl font-bold text-white">
                      {activeProject.number} — {activeProject.title}
                    </span>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-[#0B0E17]/30 to-transparent"
                  aria-hidden="true"
                />

                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close project details"
                  className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/65 hover:bg-black text-slate-200 hover:text-white border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-blue-400">
                    <span>Project {activeProject.number}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeProject.technologies.join(' · ')}</span>
                  </div>
                  <h3
                    id="modal-project-title"
                    className="font-display text-2xl sm:text-3xl font-bold text-white"
                  >
                    {activeProject.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Architecture & Key Capabilities */}
                <div className="pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5 space-y-2">
                    <h4 className="text-xs font-mono text-slate-400">
                      Architectural Overview
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeProject.architectureSummary}
                    </p>
                  </div>

                  <div className="md:col-span-7 space-y-2.5">
                    <h4 className="text-xs font-mono text-slate-400">
                      Core Implementation Highlights
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      {activeProject.keyCapabilities.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={activeProject.liveUrlConfig.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      <Github className="w-4 h-4" />
                      <span>Explore on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveProject(null);
                        onNavigate('contact');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      <span>Inquire About Similar Project</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    Configurable URL in src/data/projects.ts
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
