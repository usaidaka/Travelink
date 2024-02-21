import { DO_RESET_PASSWORD } from './constants';

export const doResetPassword = (data, token, cbSuccess) => {
  console.log(data);
  console.log(token);
  return {
    type: DO_RESET_PASSWORD,
    data,
    token,
    cbSuccess,
  };
};
