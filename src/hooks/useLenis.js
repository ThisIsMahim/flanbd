import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Custom hook to initialize Lenis smooth scrolling
 * 
 * Usage:
 * import { useLenis } from './hooks/useLenis';
 * 
 * function App() {
 *   useLenis();
 *   return <div>Your app</div>;
 * }
 */
export const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
    });

    // Add to window for debugging
    window.lenis = lenis;

    // Integrate with GSAP ScrollTrigger if available
    if (window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
    }

    // Request animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);
};

/**
 * Programmatic scroll to element
 * 
 * Usage:
 * import { scrollToElement } from './hooks/useLenis';
 * scrollToElement('#products', { offset: -100 });
 */
export const scrollToElement = (target, options = {}) => {
  if (window.lenis) {
    window.lenis.scrollTo(target, {
      offset: options.offset || 0,
      duration: options.duration || 1.2,
      easing: options.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      immediate: options.immediate || false,
      onComplete: options.onComplete,
    });
  } else {
    // Fallback to native scroll
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

/**
 * Stop/start scrolling
 */
export const stopScroll = () => {
  if (window.lenis) {
    window.lenis.stop();
  }
};

export const startScroll = () => {
  if (window.lenis) {
    window.lenis.start();
  }
};
