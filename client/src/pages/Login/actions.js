import { DO_FORGOT_PASSWORD, DO_LOGIN } from './constants';

export const doLogin = (data, cbSuccess) => ({
  type: DO_LOGIN,
  data,
  cbSuccess,
});

export const doForgotPassword = (data, cbSuccess, cbFailed) => ({
  type: DO_FORGOT_PASSWORD,
  data,
  cbSuccess,
  cbFailed,
});
