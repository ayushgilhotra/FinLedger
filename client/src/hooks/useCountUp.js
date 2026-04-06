import { useState, useEffect } from 'react';

/**
 * useCountUp Hook
 * Animates a number from 0 to its target value over a specified duration.
 * 
 * @param {number} end - The target number to count up to.
 * @param {number} duration - Duration of the animation in milliseconds.
 * @returns {number} - The current animated value.
 */
export const useCountUp = (end, duration = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};
