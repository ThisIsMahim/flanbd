import { useEffect, useRef } from "react";
import * as THREE from "three";

const useWaterEffect = (containerRef) => {
  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth /
      (containerRef.current?.offsetHeight || window.innerHeight),
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 2.0);
    camera.lookAt(0, 0, 0);

    // Set up renderer with balanced quality vs performance
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "default",
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(
      window.innerWidth,
      containerRef.current?.offsetHeight || window.innerHeight
    );
    renderer.setClearColor(0x000000, 0);
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create water geometry with adaptive resolution
    const isMobile = window.innerWidth < 768;
    const resolution = isMobile ? 60 : 100; // Reduced resolution for better performance
    const geometryWidth = 20; // Wider to fill space
    const geometryHeight = 20;
    const geometry = new THREE.PlaneGeometry(
      geometryWidth,
      geometryHeight,
      resolution,
      resolution
    );

    // Simplified shader material with optimized calculations
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#121212") },
        uHighlightColor: { value: new THREE.Color("#ff1838") },
        uDeepColor: { value: new THREE.Color("#1a1a1a") },
        uWaveAmplitude: { value: 0.08 }, // Reduced amplitude for gentler waves
        uWaveFrequency: { value: 1.8 }, // Optimized frequency
        uWaveSpeed: { value: 0.6 }, // Slower for smoother appearance
        uOpacity: { value: 0.95 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWaveAmplitude;
        uniform float uWaveFrequency;
        uniform float uWaveSpeed;
        
        varying vec2 vUv;
        varying float vElevation;
        
        // Simplified noise function
        float noise(vec2 p) {
          return sin(p.x * 5.0) * sin(p.y * 5.0) * 0.5 + 0.5;
        }
        
        void main() {
          vUv = uv;
          
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          // Simplified wave calculation - fewer terms for better performance
          float elevation = 
            sin(modelPosition.x * uWaveFrequency + uTime * uWaveSpeed) * 
            sin(modelPosition.z * uWaveFrequency * 0.7 + uTime * uWaveSpeed * 0.8) * 
            uWaveAmplitude;
          
          // Just two ripple terms instead of multiple
          float ripple1 = sin(modelPosition.x * 12.0 + modelPosition.z * 12.0 + uTime * 1.8) * uWaveAmplitude * 0.2;
          float ripple2 = sin(modelPosition.x * 8.0 - modelPosition.z * 8.0 + uTime * 1.4) * uWaveAmplitude * 0.15;
          
          // Combine waves - simplified
          elevation += ripple1 + ripple2;
          
          modelPosition.y += elevation;
          vElevation = elevation;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectionPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uHighlightColor;
        uniform vec3 uDeepColor;
        uniform float uOpacity;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          // Simplified color calculation
          float colorFactor = vElevation * 16.0 + 0.5;
          
          // Simplified pattern
          float pattern = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.05;
          colorFactor += pattern;
          
          // Color mixing
          vec3 waterColor = mix(uDeepColor, uColor, colorFactor * 0.6 + 0.3);
          vec3 finalColor = mix(waterColor, uHighlightColor, max(0.0, colorFactor - 0.2) * 0.5);
          
          gl_FragColor = vec4(finalColor, uOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Create mesh
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.1;
    scene.add(water);

    // Simplified lighting - just two lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x86c5ff, 1.0);
    directionalLight.position.set(2, 5, 3);
    scene.add(directionalLight);

    // Animation loop with performance optimization
    const clock = new THREE.Clock();
    let frameId;
    let isActive = true;
    let lastRenderTime = 0;
    const fps = 30; // Limit to 30fps for better performance
    const fpsInterval = 1000 / fps;

    const animate = () => {
      if (!isActive) return;

      frameId = requestAnimationFrame(animate);

      const now = performance.now();
      const elapsed = now - lastRenderTime;

      // Throttle rendering to target FPS
      if (elapsed < fpsInterval) return;

      // Adjust time for consistent animation speed regardless of frame rate
      lastRenderTime = now - (elapsed % fpsInterval);

      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize with debouncing
    let resizeTimeout;
    const updateSize = () => {
      if (!containerRef.current) return;

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth || window.innerWidth;
        const height = containerRef.current.clientHeight || window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 100);
    };

    // Initialize size
    updateSize();

    // Set up resize observer for container size changes
    let resizeObserver;
    try {
      resizeObserver = new ResizeObserver(updateSize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    } catch (e) {
      window.addEventListener("resize", updateSize);
    }

    // Performance optimization based on visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        clock.stop();
      } else {
        isActive = true;
        clock.start();
        if (!frameId) {
          lastRenderTime = performance.now();
          animate();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      isActive = false;
      cancelAnimationFrame(frameId);

      // Add null checks for event listener removal
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateSize);
      }

      if (typeof document !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (
        containerRef.current &&
        renderer &&
        renderer.domElement &&
        containerRef.current.contains(renderer.domElement)
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);
};

const WaterAnimation = () => {
  const containerRef = useRef(null);

  useWaterEffect(containerRef);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
};

export default WaterAnimation;
