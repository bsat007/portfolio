import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, backgroundColor: "rgba(20, 20, 20, 0.8)" }}
      className={`p-6 border border-neutral-900 bg-neutral-950/30 backdrop-blur-sm transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};