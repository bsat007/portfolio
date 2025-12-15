import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, title, className = "", id }) => {
  return (
    <section id={id} className={`py-20 md:py-32 relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {title && (
          <h2 className="text-sm font-mono tracking-widest text-neutral-500 mb-12 uppercase border-b border-neutral-800 pb-4 flex items-center gap-4">
             <span className="w-2 h-2 bg-neutral-600 rounded-sm inline-block animate-pulse"></span>
             {title}
          </h2>
        )}
        {children}
      </motion.div>
    </section>
  );
};