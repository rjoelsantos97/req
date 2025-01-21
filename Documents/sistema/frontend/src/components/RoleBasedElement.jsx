import React from 'react';

const RoleBasedElement = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem('userRole');

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return children;
  }

  return null;
};

export default RoleBasedElement;