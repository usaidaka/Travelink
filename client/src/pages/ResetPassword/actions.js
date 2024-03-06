import { DO_RESET_PASSWORD } from './constants';

export const doResetPassword = (data, token, cbSuccess) => ({
  type: DO_RESET_PASSWORD,
  data,
  token,
  cbSuccess,
});
