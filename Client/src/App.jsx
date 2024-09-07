

// App.jsx
import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from 'react-router-dom';
import { checkAuth } from "./action/auth/authAction";
import SmoothTransition from './SmoothTransition';
import LazyLoadWrapper from './LazyLoadWrapper';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Loadex from './ui-component/Loadex.jsx';
import PerformanceOptimizer from './PerformanceOptimizer';
import "./App.css";
import router from './routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <SmoothTransition>
              <LazyLoadWrapper>
                <PerformanceOptimizer>
                  <Suspense fallback={<Loadex />}>
                    <RouterProvider router={router} />
                  </Suspense>
                </PerformanceOptimizer>
              </LazyLoadWrapper>
            </SmoothTransition>
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </ErrorBoundary>
  );
};

export default App;