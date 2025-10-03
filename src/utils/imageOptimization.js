/**
 * Image Optimization Utilities
 * Provides functions for optimizing Cloudinary URLs and managing image loading
 */

/**
 * Optimize Cloudinary URL with transformation parameters
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Optimization options
 * @param {string|number} options.quality - Image quality (auto, 10-100)
 * @param {string} options.format - Image format (auto, webp, jpg, png, avif)
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {string} options.placeholder - Placeholder type (blur, pixelate)
 * @param {boolean} options.progressive - Enable progressive loading
 * @returns {string} Optimized Cloudinary URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const {
    quality = "auto",
    format = "auto",
    width,
    height,
    placeholder = "blur",
    progressive = true,
  } = options;

  try {
    // Parse the URL to add transformations
    const baseUrl = url.split("/upload/")[0];
    const imagePath = url.split("/upload/")[1];

    let transformations = [];

    // Add quality optimization
    if (quality !== "auto") {
      transformations.push(`q_${quality}`);
    }

    // Add format optimization
    if (format === "auto") {
      transformations.push("f_auto"); // Auto-select best format (WebP/AVIF)
    } else if (format) {
      transformations.push(`f_${format}`);
    }

    // Add responsive sizing if dimensions provided
    if (width) {
      transformations.push(`w_${width}`);
    }
    if (height) {
      transformations.push(`h_${height}`);
    }

    // Add placeholder for progressive loading
    if (placeholder === "blur") {
      transformations.push("e_blur:1000");
    } else if (placeholder === "pixelate") {
      transformations.push("e_pixelate:10");
    }

    // Add progressive loading for JPEGs
    if (progressive && (format === "jpg" || format === "auto")) {
      transformations.push("fl_progressive");
    }

    // Add other optimizations
    transformations.push("c_scale");
    transformations.push("dpr_auto"); // Auto device pixel ratio

    const transformationString = transformations.join(",");

    return `${baseUrl}/upload/${transformationString}/${imagePath}`;
  } catch (error) {
    console.warn("Failed to optimize Cloudinary URL:", error);
    return url;
  }
};

/**
 * Generate low-quality placeholder URL for progressive loading
 * @param {string} url - Original image URL
 * @param {Object} options - Placeholder options
 * @returns {string} Placeholder URL
 */
export const generatePlaceholderUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary.com")) {
    return (
      options.fallback ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
    );
  }

  try {
    const baseUrl = url.split("/upload/")[0];
    const imagePath = url.split("/upload/")[1];

    // Create a very low quality, blurred version for placeholder
    return `${baseUrl}/upload/e_blur:2000,q_10,w_50/${imagePath}`;
  } catch (error) {
    console.warn("Failed to generate placeholder URL:", error);
    return (
      options.fallback ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
    );
  }
};

/**
 * Get optimal image dimensions based on container size
 * @param {number} containerWidth - Container width in pixels
 * @param {number} containerHeight - Container height in pixels
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} Optimal width and height
 */
export const getOptimalDimensions = (
  containerWidth,
  containerHeight,
  maxWidth = 1920,
  maxHeight = 1080
) => {
  const aspectRatio = containerWidth / containerHeight;

  let optimalWidth = Math.min(containerWidth, maxWidth);
  let optimalHeight = optimalWidth / aspectRatio;

  if (optimalHeight > maxHeight) {
    optimalHeight = maxHeight;
    optimalWidth = optimalHeight * aspectRatio;
  }

  return {
    width: Math.round(optimalWidth),
    height: Math.round(optimalHeight),
  };
};

/**
 * Preload critical images
 * @param {Array<string>} urls - Array of image URLs to preload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = (urls, onProgress) => {
  const promises = urls.map((url, index) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        onProgress?.(index + 1, urls.length);
        resolve(url);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });

  return Promise.all(promises);
};

/**
 * Check if WebP is supported by the browser
 * @returns {Promise<boolean>} True if WebP is supported
 */
export const isWebPSupported = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
};

/**
 * Get optimal format based on browser support
 * @returns {string} Optimal format (webp, jpg, png)
 */
export const getOptimalFormat = async () => {
  const webPSupported = await isWebPSupported();
  return webPSupported ? "webp" : "auto";
};
