import { useEffect, useRef } from "react";

const useAnimations = () => {
  const titleSectionRef = useRef(null);
  const sectionRefs = useRef({});
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // Add enhanced animation styles while keeping performance
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      /* Enhanced title animations */
      .title-section-animated {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .title-section-animated.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .title-decoration {
        width: 0;
        transition: width 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      }
      
      .title-decoration.visible {
        width: 100%;
      }
      
      /* Enhanced section animations */
      .section-animated {
        opacity: 0;
        transform: translateY(35px) scale(0.97);
        transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        perspective: 1000px;
      }
      
      .section-animated.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      
      /* Enhanced header animations */
      .section-header-animated {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .section-header-animated.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Enhanced content animations */
      .section-content-animated {
        opacity: 0;
        transform: translateY(25px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .section-content-animated.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Enhanced product card animations */
      .water-product-card {
        transform: translateY(0);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .water-product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0, 89, 165, 0.15);
      }
      
      /* Enhanced image animations */
      .water-product-image img {
        transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .water-product-card:hover .water-product-image img {
        transform: scale(1.12);
      }
      
      /* Enhanced cart button hover */
      .water-cart-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .water-cart-button:before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.2), 
          transparent);
        transition: 0.6s;
      }
      
      .water-cart-button:hover:before {
        left: 100%;
      }
      
      /* Enhanced dialog animations */
      .MuiDialog-paper {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      
      .MuiDialog-paper.visible {
        opacity: 1;
        transform: scale(1);
      }
    `;
    document.head.appendChild(styleElement);

    // Use Intersection Observer for animations
    const elementsToObserve = [];

    // Add title section if it exists
    if (titleSectionRef.current) {
      elementsToObserve.push({
        element: titleSectionRef.current,
        classes: ["title-section-animated", "visible"],
      });

      const decoration =
        titleSectionRef.current.querySelector(".title-decoration");
      if (decoration) {
        elementsToObserve.push({
          element: decoration,
          classes: ["title-decoration", "visible"],
          delay: 400,
        });
      }
    }

    // Add section refs
    Object.values(sectionRefs.current).forEach((section, index) => {
      if (section) {
        elementsToObserve.push({
          element: section,
          classes: ["section-animated", "visible"],
          delay: 100 * index,
        });

        const header = section.querySelector(".section-header-animated");
        if (header) {
          elementsToObserve.push({
            element: header,
            classes: ["section-header-animated", "visible"],
            delay: 250 + 100 * index,
          });
        }

        const content = section.querySelector(".section-content-animated");
        if (content) {
          elementsToObserve.push({
            element: content,
            classes: ["section-content-animated", "visible"],
            delay: 450 + 100 * index,
          });
        }
      }
    });

    // Set initial classes only if component is still mounted
    if (isMounted.current) {
      elementsToObserve.forEach((item) => {
        item.element.classList.add(item.classes[0]);
      });

      // Create intersection observer with better thresholds for smoother triggering
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && isMounted.current) {
              const target = elementsToObserve.find(
                (item) => item.element === entry.target
              );
              if (target && isMounted.current) {
                if (target.delay) {
                  setTimeout(() => {
                    if (isMounted.current) {
                      target.element.classList.add(target.classes[1]);
                    }
                  }, target.delay);
                } else {
                  target.element.classList.add(target.classes[1]);
                }
                observer.unobserve(entry.target);
              }
            }
          });
        },
        { threshold: 0.15, rootMargin: "10px" }
      );

      // Start observing elements
      elementsToObserve.forEach((item) => {
        observer.observe(item.element);
      });

      // Cleanup
      return () => {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }

        elementsToObserve.forEach((item) => {
          if (item.element) observer.unobserve(item.element);
        });
      };
    }

    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  return {
    titleSectionRef,
    sectionRefs,
    isMounted,
  };
};

export default useAnimations;
