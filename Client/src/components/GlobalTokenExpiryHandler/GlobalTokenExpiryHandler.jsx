import React from 'react';
import useTokenExpiry from '../../hooks/useTokenExpiry';
import TokenExpiryNotification from '../TokenExpiryNotification/TokenExpiryNotification';

const GlobalTokenExpiryHandler = () => {
  const { showNotification, handleExtendToken, handleLogout } = useTokenExpiry();

  return (
    <TokenExpiryNotification 
      show={showNotification}
      onExtend={handleExtendToken}
      onLogout={handleLogout}
    />
  );
};

export default GlobalTokenExpiryHandler;
