export const useAuth = () => {
  // You can expand this to check if the token is expired via JWT decode
  const token = localStorage.getItem('myAdvancedSpaceAccess');
  return { isAuthenticated: !!token, token };
};