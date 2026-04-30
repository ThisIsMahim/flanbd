import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal - Animate an element on scroll into view (fade+slide up)
 * @param {React.RefObject} ref - The ref to the element to animate
 * @param {Object} options - Optional GSAP animation overrides
 */
const useScrollReveal = (ref, options = {}) => {
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    if (!ref.current) return;
    
    const anim = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        ...options,
      }
    );
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [ref, optionsString]); // Use optionsString instead of options object literal
};

export default useScrollReveal;
