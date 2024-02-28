import { UPDATE_PROFILE } from './constants';

export const doUpdateProfile = (data, cbSuccess, cbFailed) => ({
  type: UPDATE_PROFILE,
  data,
  cbSuccess,
  cbFailed,
});
