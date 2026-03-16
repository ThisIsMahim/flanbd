import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP ScrollTrigger animations
 * 
 * @param {Object} animationConfig - GSAP animation configuration
 * @param {Object} scrollTriggerConfig - ScrollTrigger specific configuration
 * @returns {React.RefObject} - Ref to attach to the element
 * 
 * Usage:
 * const elementRef = useScrollTrigger({
 *   opacity: 0,
 *   y: 50
 * }, {
 *   start: 'top 80%',
 *   toggleActions: 'play none none reverse'
 * });
 * 
 * return <div ref={elementRef}>Animated content</div>;
 */
export const useScrollTrigger = (animationConfig = {}, scrollTriggerConfig = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(elementRef.current, {
        ...animationConfig,
        scrollTrigger: {
          trigger: elementRef.current,
          start: scrollTriggerConfig.start || 'top 80%',
          end: scrollTriggerConfig.end || 'bottom 20%',
          toggleActions: scrollTriggerConfig.toggleActions || 'play none none reverse',
          markers: scrollTriggerConfig.markers || false,
          scrub: scrollTriggerConfig.scrub || false,
          pin: scrollTriggerConfig.pin || false,
          ...scrollTriggerConfig,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return elementRef;
};

/**
 * Parallax effect hook
 * 
 * Usage:
 * const parallaxRef = useParallax(0.5); // Move at 50% scroll speed
 * return <div ref={parallaxRef}>Parallax content</div>;
 */
export const useParallax = (speed = 0.5) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return elementRef;
};

/**
 * Stagger animation hook for multiple children
 * 
 * Usage:
 * const containerRef = useStaggerAnimation('.product-card', 0.1);
 * return (
 *   <div ref={containerRef}>
 *     <div className="product-card">1</div>
 *     <div className="product-card">2</div>
 *     <div className="product-card">3</div>
 *   </div>
 * );
 */
export const useStaggerAnimation = (childSelector = '.child', staggerDelay = 0.1) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const children = containerRef.current.querySelectorAll(childSelector);
      
      gsap.from(children, {
        opacity: 0,
        y: 30,
        stagger: staggerDelay,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [childSelector, staggerDelay]);

  return containerRef;
};

/**
 * Fade in on scroll helper function
 * Can be used directly without a hook
 */
export const fadeInOnScroll = (selector, options = {}) => {
  gsap.from(selector, {
    opacity: 0,
    y: options.y || 50,
    duration: options.duration || 0.8,
    ease: options.ease || 'power2.out',
    scrollTrigger: {
      trigger: selector,
      start: options.start || 'top 80%',
      toggleActions: options.toggleActions || 'play none none reverse',
    },
  });
};
