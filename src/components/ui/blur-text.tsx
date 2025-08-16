import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const BlurText = ({
  text = '',
  delay = 150,
  className = '',
  animateBy = 'words',
  direction = 'top',
}: {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom';
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ 
            filter: 'blur(10px)', 
            opacity: 0, 
            y: direction === 'top' ? -20 : 20 
          }}
          animate={inView ? { 
            filter: 'blur(0px)', 
            opacity: 1, 
            y: 0 
          } : {
            filter: 'blur(10px)', 
            opacity: 0, 
            y: direction === 'top' ? -20 : 20 
          }}
          transition={{
            duration: 0.6,
            delay: (index * delay) / 1000,
            ease: 'easeOut'
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;