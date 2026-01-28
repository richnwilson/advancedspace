import common from '../helpers/common';

export const useAuth = () => {
  // You can expand this to check if the token is expired via JWT decode
  let isAuthenticated = false
  const token = localStorage.getItem('myAdvancedSpaceAccess');
  if (token) {
    isAuthenticated = common.decodeToken(token)
  }
  return { isAuthenticated, token };
};