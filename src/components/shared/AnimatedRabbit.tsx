'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedRabbitProps {
  icon: string;
  className?: string;
}

export function AnimatedRabbit({ icon, className = '' }: AnimatedRabbitProps) {
  const [isShaking, setIsShaking] = useState(false);

  const handleTouch = () => {
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <motion.span
      className={`cursor-pointer select-none ${className}`}
      onClick={handleTouch}
      animate={
        isShaking
          ? {
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.span>
  );
}
