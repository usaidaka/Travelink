import { CHANGE_PASSWORD } from './constants';

export const doChangePassword = (data, cbSuccess) => ({
  type: CHANGE_PASSWORD,
  data,
  cbSuccess,
});
