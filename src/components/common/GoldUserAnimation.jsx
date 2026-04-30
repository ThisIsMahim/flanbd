import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoldUserAnimation = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative p-1 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#9E7E38] rounded-3xl shadow-[0_0_80px_rgba(253,185,49,0.4)]"
          >
            <div className="bg-[#0f0f0f] px-12 py-10 rounded-[22px] text-center border border-white/5">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-6"
              >
                ✨
              </motion.div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                Gold Member <br/> <span className="text-[#FDB931]">Unlocked</span>
              </h2>
              <p className="text-white/50 font-bold text-[10px] uppercase tracking-[0.3em] mt-4">
                10% Lifetime Privilege
              </p>
              
              {/* Subtle accent line */}
              <div className="w-12 h-1 bg-[#FDB931] mx-auto mt-8 rounded-full opacity-50" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoldUserAnimation;
