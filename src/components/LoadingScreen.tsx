import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../config/site';

interface LoadingScreenProps {
  prefersReducedMotion: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ prefersReducedMotion }) => {
  const [progress, setProgress] = useState(prefersReducedMotion ? 100 : 0);
  const [isVisible, setIsVisible] = useState(!prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    let frameId: number;
    const startTime = performance.now();
    const duration = 680; // Short, crisp initial reveal sequence

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const nextValue = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextValue);

      if (nextValue < 100) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        const timer = window.setTimeout(() => {
          setIsVisible(false);
        }, 140);
        return () => window.clearTimeout(timer);
      }
    };

    frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="portfolio-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050507] px-6 pointer-events-auto"
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="w-full max-w-xs flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D1017] border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.18)]">
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                {siteConfig.monogram}
              </span>
              <span
                className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500"
                aria-hidden="true"
              />
            </div>

            <div className="text-center space-y-1">
              <p className="font-display text-base font-semibold tracking-tight text-white">
                {siteConfig.name}
              </p>
              <p className="text-xs text-slate-400">
                {siteConfig.title}
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                <span>Initializing 3D Viewport</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
