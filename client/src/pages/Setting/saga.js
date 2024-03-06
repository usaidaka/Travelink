import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { updateProfile } from '@domain/api';

import { UPDATE_PROFILE } from './constants';

function* doUpdateProfile({ data, cbSuccess, cbFailed }) {
  setLoading(true);
  try {
    const response = yield call(updateProfile, data);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    cbFailed && cbFailed();
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* settingSaga() {
  yield takeLatest(UPDATE_PROFILE, doUpdateProfile);
}
