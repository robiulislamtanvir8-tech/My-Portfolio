import React, { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  disabled: boolean;
}

type CursorMode = 'default' | 'interactive' | 'project' | '3d';

export const CustomCursor: React.FC<CustomCursorProps> = ({ disabled }) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectEl = target.closest('[data-cursor="project"]');
      const threeEl = target.closest('[data-cursor="3d"]');
      const interactiveEl = target.closest('a, button, input, textarea, select, [role="button"]');

      if (projectEl) {
        setCursorMode('project');
      } else if (threeEl) {
        setCursorMode('3d');
      } else if (interactiveEl) {
        setCursorMode('interactive');
      } else {
        setCursorMode('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        const scale =
          cursorMode === 'project'
            ? 1.75
            : cursorMode === 'interactive'
            ? 1.4
            : cursorMode === '3d'
            ? 1.25
            : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [disabled, cursorMode, isVisible]);

  if (disabled) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 hidden lg:block transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Main small glowing cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_#3B82F6] will-change-transform"
      />

      {/* Secondary trailing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 h-8 w-8 rounded-full border transition-colors duration-150 will-change-transform flex items-center justify-center ${
          cursorMode === 'project'
            ? 'border-cyan-400/70 bg-blue-500/10'
            : cursorMode === 'interactive'
            ? 'border-blue-400/60 bg-blue-400/5'
            : cursorMode === '3d'
            ? 'border-indigo-400/60 bg-indigo-500/5'
            : 'border-white/25 bg-transparent'
        }`}
      />
    </div>
  );
};
