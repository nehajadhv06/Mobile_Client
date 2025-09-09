// src/utils/tokenUtils.js
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Returns true if token exists, false otherwise
};