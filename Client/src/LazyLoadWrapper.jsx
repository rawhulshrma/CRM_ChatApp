// LazyLoadWrapper.jsx
import React, { Suspense, useState, useEffect } from 'react';
import Loadex from './ui-component/Loadex';

const LazyLoadWrapper = ({ children, minLoadTime = 300 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  return (
    <Suspense fallback={<Loadex />}>
      {isLoading ? <Loadex /> : children}
    </Suspense>
  );
};

export default LazyLoadWrapper;