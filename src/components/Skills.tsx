import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/site';
import { OrbitalSkillNode } from '../data/skills';

interface SkillsProps {
  prefersReducedMotion: boolean;
}

export const Skills: React.FC<SkillsProps> = ({ prefersReducedMotion }) => {
  const [selectedNode, setSelectedNode] = useState<OrbitalSkillNode>(
    siteConfig.orbitalNodes[0]
  );
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  // Slow continuous orbital motion unless reduced motion or hovered
  useEffect(() => {
    if (prefersReducedMotion || isHoveringOrbit) return;
    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setRotationOffset((prev) => (prev + dt * 4.5) % 360);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, isHoveringOrbit]);

  // Calculate SVG/container coordinates (0..100%) for each orbital node
  const computeNodeCoords = (node: OrbitalSkillNode) => {
    const direction = node.orbitRing === 1 ? 1 : -0.65;
    const currentAngleRad =
      ((node.angleDeg + rotationOffset * direction) * Math.PI) / 180;
    const radiusPct = node.orbitRing === 1 ? 26 : 41;
    const x = 50 + Math.cos(currentAngleRad) * radiusPct;
    const y = 50 + Math.sin(currentAngleRad) * radiusPct;
    return { x, y };
  };

  const selectedCoords = computeNodeCoords(selectedNode);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative py-24 sm:py-32 border-t border-white/[0.07] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-mono tracking-wider text-blue-400">
              TECHNOLOGY ECOSYSTEM
            </p>
            <h2
              id="skills-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
            >
              SKILLS &amp; TECHNOLOGIES
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-400 max-w-md">
            Hover or select any node in the orbital ecosystem to inspect its role
            across the full-stack architecture.
          </p>
        </div>

        {/* Interactive Orbital Visualization + Live Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left 7 Cols: Interactive Orbital Sphere Canvas */}
          <div
            onMouseEnter={() => setIsHoveringOrbit(true)}
            onMouseLeave={() => setIsHoveringOrbit(false)}
            className="lg:col-span-7 relative aspect-square max-w-[540px] w-full mx-auto rounded-2xl bg-[#090C14]/90 border border-white/10 p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          >
            {/* Subtle Radial Core Glow */}
            <div
              className="pointer-events-none absolute inset-16 rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-cyan-400/10 blur-2xl"
              aria-hidden="true"
            />

            {/* SVG Orbital Tracks & Active Vector Connection Line */}
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="vectorLineGrad" x1="50%" y1="50%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Inner & Outer Orbital Rings */}
              <circle
                cx="50"
                cy="50"
                r="26"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.25"
                strokeDasharray="1.5 1.5"
              />
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="0.25"
              />

              {/* Active Connection Line from Center Sphere to Selected Node */}
              <line
                x1="50"
                y1="50"
                x2={selectedCoords.x}
                y2={selectedCoords.y}
                stroke="url(#vectorLineGrad)"
                strokeWidth="0.55"
              />
              <circle
                cx={selectedCoords.x}
                cy={selectedCoords.y}
                r="1.4"
                fill="#22D3EE"
              />
            </svg>

            {/* Central Glowing Sphere: FULL STACK */}
            <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-600/30 via-[#0E1528] to-indigo-900/40 border border-blue-400/50 shadow-[0_0_40px_rgba(59,130,246,0.35)] text-center px-2">
              <span className="font-display text-xs sm:text-sm font-extrabold tracking-wider text-white">
                FULL STACK
              </span>
              <span className="text-[10px] font-mono text-blue-300 mt-0.5">
                CORE
              </span>
            </div>

            {/* 16 Floating Technology Nodes */}
            {siteConfig.orbitalNodes.map((node) => {
              const { x, y } = computeNodeCoords(node);
              const isSelected = selectedNode.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setSelectedNode(node)}
                  onFocus={() => setSelectedNode(node)}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isSelected
                      ? 'bg-blue-600 text-white border border-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                      : 'bg-[#0D111C]/90 text-slate-300 border border-white/12 hover:border-blue-400/60 hover:text-white'
                  }`}
                >
                  {node.label}
                </button>
              );
            })}
          </div>

          {/* Right 5 Cols: Active Node Details & Category Quick Filter */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#0B0E17] border border-white/12 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-blue-400">
                    {selectedNode.category}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                    {selectedNode.label}
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  Ring 0{selectedNode.orbitRing}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Connected to FULL STACK Core</span>
                <span className="text-cyan-400">Active Node</span>
              </div>
            </div>

            {/* Interactive Domain Filter Buttons */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-slate-400">
                Filter Categorized Architecture Below
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Domains' },
                  { id: 'frontend', label: 'Frontend' },
                  { id: 'backend', label: 'Backend' },
                  { id: 'database', label: 'Database' },
                  { id: 'tools', label: 'Tools & Platforms' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategoryTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      activeCategoryTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0B0E17] text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Structured Skill Categories (Frontend, Backend, Database, Tools & Platforms) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          {siteConfig.skills
            .filter((group) =>
              activeCategoryTab === 'all' ? true : group.id === activeCategoryTab
            )
            .map((group, idx) => (
              <motion.div
                key={group.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="rounded-2xl bg-[#0B0E17] border border-white/10 p-6 sm:p-8 space-y-6"
              >
                <div className="border-b border-white/10 pb-4 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                      0{idx + 1}. {group.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {group.subtitle}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-blue-400 tabular-nums shrink-0">
                    {group.skills.length} Technologies
                  </span>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                    >
                      <span className="font-semibold text-sm sm:text-base text-white whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 sm:text-right">
                        {skill.description}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
