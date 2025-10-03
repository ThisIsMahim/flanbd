import React from 'react';
import { motion } from 'framer-motion';

const GoldUserBadge = ({ size = 'medium', showAnimation = true, className = '' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <motion.div
      initial={showAnimation ? { scale: 0, rotate: -180 } : false}
      animate={showAnimation ? { scale: 1, rotate: 0 } : false}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-full font-bold shadow-lg border-2 border-red-300 ${sizeClasses[size]} ${className}`}
    >
      {/* Animated sparkle effect */}
      {showAnimation && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`${iconSizes[size]} opacity-80`}
        >
          ✨
        </motion.div>
      )}
      
      {/* Gold crown icon */}
      <span className={`${iconSizes[size]}`}>👑</span>
      
      {/* Text */}
      <span>GOLD</span>
      
      {/* Discount indicator */}
      <span className="opacity-90">10% ADDITIONAL OFF</span>
    </motion.div>
  );
};

export default GoldUserBadge;

