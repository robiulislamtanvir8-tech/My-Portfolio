/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { siteConfig } from './config/site';
import { useDeviceCapabilities } from './hooks/useMediaQuery';
import { useScroll } from './hooks/useScroll';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const { isMobile, isTouchDevice, prefersReducedMotion } = useDeviceCapabilities();

  const sectionIds = useMemo(
    () => siteConfig.navigation.map((item) => item.id),
    []
  );

  const { isScrolled, activeSection, scrollToSection } = useScroll(sectionIds);

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F8FAFC] bg-architectural-grid selection:bg-blue-500/30 selection:text-blue-200">
      {/* Subtle Film Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-grain"
        aria-hidden="true"
      />

      {/* Accessible Skip-to-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Initial Loading Sequence */}
      <LoadingScreen prefersReducedMotion={prefersReducedMotion} />

      {/* Custom Desktop Cursor */}
      <CustomCursor
        disabled={isMobile || isTouchDevice || prefersReducedMotion}
      />

      {/* Sticky 3-Zone Top Bar Navigation */}
      <Navbar
        isScrolled={isScrolled}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Primary Semantic Content */}
      <main id="main-content" className="relative z-10">
        <Hero
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
          onNavigate={scrollToSection}
        />

        <About
          prefersReducedMotion={prefersReducedMotion}
          onNavigate={scrollToSection}
        />

        <Projects
          prefersReducedMotion={prefersReducedMotion}
          onNavigate={scrollToSection}
        />

        <Skills prefersReducedMotion={prefersReducedMotion} />

        <Experience prefersReducedMotion={prefersReducedMotion} />

        <Contact prefersReducedMotion={prefersReducedMotion} />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}

