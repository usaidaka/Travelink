import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  // ping: 'ping.json',
  login: 'auth/login',
  register: 'auth/register',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',

  myRoute: 'user/my-route',
  addRoute: 'user/route',
  region: 'user/region',
};

export const callAPI = async (endpoint, method, header = {}, params = {}, data = {}) => {
  const defaultHeader = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

// export const ping = () => callAPI(urls.ping, 'get');

export const fetchPokemon = () => callAPI(urls.ditto, 'GET');
export const example = (data) => {
  const header = {
    'Content-Type': 'multipart/form-data',
  };
  return callAPI(urls.ditto, 'GET', header, {}, data);
};

export const register = (data) => {
  console.log(data, '<<< DATA USER API');
  return callAPI(urls.register, 'POST', {}, {}, data);
};

export const login = (data) => callAPI(urls.login, 'POST', {}, {}, data);

export const forgotPassword = (data) => callAPI(urls.forgotPassword, 'POST', {}, {}, data);

export const myRoute = () => callAPI(urls.myRoute, 'GET', {}, {}, {});

export const resetPassword = (data) => callAPI(urls.resetPassword, 'POST', {}, {}, data);

export const region = (provinceId) => callAPI(`${urls.region}/${provinceId}`, 'GET', {}, {}, {});

export const addRoute = (data) => callAPI(urls.addRoute, 'POST', {}, {}, data);
