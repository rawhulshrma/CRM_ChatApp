import React, { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

const PerformanceOptimizer = ({ children, threshold = 0.1 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  const memoizedChildren = useMemo(() => {
    return children;
  }, [inView, children]);

  return (
    <div ref={ref}>
      {inView ? memoizedChildren : <div style={{ height: '100px' }} />}
    </div>
  );
};

export default PerformanceOptimizer;
PerformanceOptimizer.jsx