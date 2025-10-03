import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoldUserAnimation = ({ isVisible, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Firework particles
    const particles = [];
    const fireworks = [];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = 0.02;
        this.color = color;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life -= this.decay;
        this.size *= 0.99;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 15;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.exploded = false;
        this.color = `hsl(${Math.random() * 60 + 30}, 100%, 50%)`; // Gold to orange
      }

      update() {
        if (!this.exploded) {
          this.x += this.vx;
          this.y += this.vy;
          
          const distance = Math.sqrt(
            Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2)
          );
          
          if (distance < 20) {
            this.explode();
          }
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw() {
        if (!this.exploded) {
          ctx.save();
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Create fireworks
    const createFireworks = () => {
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height * 0.6;
        fireworks.push(new Firework(x, y, targetX, targetY));
      }
    };

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && particles.length === 0) {
          fireworks.splice(index, 1);
        }
      });

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      // Create new fireworks
      if (fireworks.length < 3 && Math.random() < 0.02) {
        createFireworks();
      }

      // Check if animation should end
      if (fireworks.length === 0 && particles.length === 0) {
        cancelAnimationFrame(animationId);
        onComplete && onComplete();
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    createFireworks();
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: 'transparent' }}
          />
          
          {/* Gold User Badge Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.5 
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              {/* Glowing background */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px #FFD700",
                    "0 0 40px #FFD700",
                    "0 0 20px #FFD700"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-lg"
              />
              
              {/* Main badge */}
              <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-full px-8 py-4 shadow-2xl border-4 border-yellow-300">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold mb-1">🎉</div>
                  <div className="text-lg font-bold">GOLD USER!</div>
                  <div className="text-sm opacity-90">10% Lifetime Discount</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoldUserAnimation;


