import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { changePassword } from '@domain/api';

import { CHANGE_PASSWORD } from './constants';

function* doChangePassword({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(changePassword, data);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

export default function* changePasswordSaga() {
  yield takeLatest(CHANGE_PASSWORD, doChangePassword);
}
