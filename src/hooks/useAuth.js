import common from '../helpers/common';

const { REACT_APP_TOKEN_NAME } = process.env

export const useAuth = () => {
  try {
    // You can expand this to check if the token is expired via JWT decode
    let isAuthenticated = false
    const token = localStorage.getItem(REACT_APP_TOKEN_NAME);
    if (token) {
      isAuthenticated = common.decodeToken(token)
    }
    return { isAuthenticated, token };
  } catch(e) {
    return { isAuthenticated: false, token: ""}
  }
};