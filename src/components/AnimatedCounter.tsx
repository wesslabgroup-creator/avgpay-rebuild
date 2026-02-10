"use client";

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

export function AnimatedCounter({ target, duration = 2000 }: AnimatedCounterProps) {
  // Start at target to avoid "0" flash on SSR, then animate on client
  const [count, setCount] = useState(target);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    // Reset to 0 and animate up
    setCount(0);
    let start = 0;
    const end = target;
    const increment = end / (duration / 16); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        setHasAnimated(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, hasAnimated]);

  return <span className="font-bold text-emerald-400 text-4xl lg:text-5xl">{count.toLocaleString()}</span>;
}
