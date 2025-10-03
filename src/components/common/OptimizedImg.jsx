import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import "./OptimizedImg.css";

const OptimizedImg = ({
  src,
  alt,
  className = "",
  style = {},
  onClick,
  onLoad,
  onError,
  priority = false,
  sizes = "100vw",
  quality = "auto",
  format = "auto",
  placeholder = "blur",
  blurDataURL = null,
  width,
  height,
  objectFit = "cover",
  loading = "lazy",
  draggable = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef(null);

  // Use intersection observer for lazy loading with optimized options
  const { ref: observerRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
    skip: priority, // Skip intersection observer for priority images
  });

  // Optimize Cloudinary URL with transformation parameters
  const optimizeCloudinaryUrl = useCallback((url, options = {}) => {
    if (!url || !url.includes("cloudinary.com")) {
      return url;
    }

    const {
      quality: q = "auto",
      format: f = "auto",
      width: w,
      height: h,
      placeholder: p = "blur",
    } = options;

    // Parse the URL to add transformations
    const baseUrl = url.split("/upload/")[0];
    const imagePath = url.split("/upload/")[1];

    let transformations = [];

    // Add quality optimization
    if (q !== "auto") {
      transformations.push(`q_${q}`);
    }

    // Add format optimization
    if (f === "auto") {
      transformations.push("f_auto"); // Auto-select best format (WebP/AVIF)
    } else if (f) {
      transformations.push(`f_${f}`);
    }

    // Add responsive sizing if dimensions provided
    if (w) {
      transformations.push(`w_${w}`);
    }
    if (h) {
      transformations.push(`h_${h}`);
    }

    // Add placeholder for progressive loading
    if (p === "blur") {
      transformations.push("e_blur:1000");
    }

    // Add other optimizations
    transformations.push("c_scale");
    transformations.push("dpr_auto"); // Auto device pixel ratio

    const transformationString = transformations.join(",");

    return `${baseUrl}/upload/${transformationString}/${imagePath}`;
  }, []);

  // Generate low-quality placeholder URL
  const generatePlaceholderUrl = useCallback(
    (url) => {
      if (!url || !url.includes("cloudinary.com")) {
        return (
          blurDataURL ||
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
        );
      }

      const baseUrl = url.split("/upload/")[0];
      const imagePath = url.split("/upload/")[1];

      // Create a very low quality, blurred version for placeholder
      return `${baseUrl}/upload/e_blur:2000,q_10,w_50/${imagePath}`;
    },
    [blurDataURL]
  );

  // Handle image load
  const handleImageLoad = useCallback(
    (e) => {
      setIsLoaded(true);
      onLoad?.(e);
    },
    [onLoad]
  );

  // Handle image error
  const handleImageError = useCallback(
    (e) => {
      console.warn("Image failed to load:", src, e);
      setHasError(true);
      setImageSrc("/no-pictures.png"); // Fallback image
      onError?.(e);
    },
    [onError, src]
  );

  // Set up image source when component becomes visible or is priority
  useEffect(() => {
    if (inView || priority) {
      setIsIntersecting(true);
    }
  }, [inView, priority]);

  // Load image when intersecting or priority
  useEffect(() => {
    if ((isIntersecting || priority) && src) {
      const optimizedUrl = optimizeCloudinaryUrl(src, {
        quality,
        format,
        width,
        height,
        placeholder,
      });

      console.log("Setting image source:", { src, optimizedUrl, priority, isIntersecting });
      setImageSrc(optimizedUrl);
    }
  }, [
    isIntersecting,
    priority,
    src,
    optimizeCloudinaryUrl,
    quality,
    format,
    width,
    height,
    placeholder,
  ]);

  // Combine refs
  const combinedRef = useCallback(
    (node) => {
      observerRef(node);
      imgRef.current = node;
    },
    [observerRef]
  );

  // Early return for error state
  if (hasError) {
    return (
      <img
        ref={combinedRef}
        src="/no-pictures.png"
        alt={alt}
        className={className}
        style={style}
        onClick={onClick}
        draggable={draggable}
        {...props}
      />
    );
  }

  // Determine the final image source
  const finalImageSrc = imageSrc || src;

  return (
    <div
      ref={combinedRef}
      className={`optimized-img-container ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Placeholder/Blur image */}
      {!isLoaded && isIntersecting && (
        <img
          src={generatePlaceholderUrl(src)}
          alt=""
          className="optimized-img-placeholder"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(10px)",
            transform: "scale(1.1)",
            zIndex: 1,
          }}
          loading="eager"
        />
      )}

      {/* Main image */}
      {(isIntersecting || priority) && (
        <img
          ref={imgRef}
          src={finalImageSrc}
          alt={alt}
          className={`optimized-img ${isLoaded ? "loaded" : ""}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            transition: "opacity 0.3s ease-in-out",
            opacity: isLoaded ? 1 : 0,
            zIndex: 2,
            position: "relative",
          }}
          onClick={onClick}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? "eager" : loading}
          draggable={draggable}
          sizes={sizes}
          {...props}
        />
      )}

      {/* Loading skeleton */}
      {!isIntersecting && !priority && (
        <div
          className="optimized-img-skeleton"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f3f4f6",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImg;
