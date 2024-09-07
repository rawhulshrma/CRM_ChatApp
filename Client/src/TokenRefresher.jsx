import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from './action/auth/authAction';

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 मिनट

const TokenRefresher = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    let intervalId;

    if (isAuthenticated) {
      intervalId = setInterval(() => {
        dispatch(refreshToken());
      }, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default TokenRefresher;