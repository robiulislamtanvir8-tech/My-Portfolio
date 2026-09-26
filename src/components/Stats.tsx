import React, { useEffect, useRef, useState } from 'react';
import { siteConfig, StatItem } from '../config/site';

interface StatsProps {
  prefersReducedMotion: boolean;
}

const AnimatedCounter: React.FC<{
  item: StatItem;
  shouldAnimate: boolean;
  prefersReducedMotion: boolean;
}> = ({ item, shouldAnimate, prefersReducedMotion }) => {
  const [count, setCount] = useState<number>(prefersReducedMotion ? item.value : 0);

  useEffect(() => {
    if (!shouldAnimate) return;
    if (prefersReducedMotion) {
      setCount(item.value);
      return;
    }

    let frameId: number;
    const duration = 1200;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * item.value));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [shouldAnimate, item.value, prefersReducedMotion]);

  return (
    <div className="py-5 px-4 sm:px-6 bg-[#0B0E16] border border-white/10 rounded-2xl transition-colors duration-200 hover:border-blue-500/40">
      <div className="font-display text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums tracking-tight">
        {count}
        <span className="text-blue-400">{item.suffix}</span>
      </div>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">
        {item.label}
      </p>
    </div>
  );
};

export const Stats: React.FC<StatsProps> = ({ prefersReducedMotion }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      aria-label="Developer career statistics"
    >
      {siteConfig.statistics.map((item) => (
        <AnimatedCounter
          key={item.id}
          item={item}
          shouldAnimate={inView}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
};
