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
      className={`inline-flex items-center gap-2 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-ink-950 rounded-full font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] border border-gold-300/50 backdrop-blur-sm ${sizeClasses[size]} ${className}`}
    >
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite_linear]" />
      </div>

      {/* Gold crown icon */}
      <span className={`${iconSizes[size]} drop-shadow-sm`}>👑</span>
      
      {/* Text */}
      <span className="tracking-tight uppercase">GOLD USER</span>
      
      {/* Divider */}
      <div className="w-px h-3 bg-ink-950/20" />

      {/* Discount indicator */}
      <span className="text-[10px] font-black opacity-80">-10% OFF</span>
    </motion.div>
  );
};

export default GoldUserBadge;

