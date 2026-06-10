import React from 'react';
import { Construction } from 'lucide-react';
import { motion } from 'motion/react';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-[80vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 text-gray-500"
    >
      <Construction className="mb-4 h-16 w-16 text-amber-500" />
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-sm max-w-md text-center">
        This module is currently under construction. 
        Data and functionality will be implemented in the next phase.
      </p>
    </motion.div>
  );
}
