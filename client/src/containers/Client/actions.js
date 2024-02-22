import { SET_LOGIN, SET_PROVINCE, SET_TOKEN, SET_USER } from '@containers/Client/constants';

export const setLogin = (login) => ({
  type: SET_LOGIN,
  login,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const setProvince = (province) => ({
  type: SET_PROVINCE,
  province,
});
