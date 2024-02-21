import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { resetPassword } from '@domain/api';
import { setToken } from '@containers/Client/actions';

import { DO_RESET_PASSWORD } from './constants';

function* doResetPassword({ data, token, cbSuccess }) {
  setLoading(true);
  try {
    console.log(data);
    console.log(token);

    const verifiedToken = token.replace(/_/g, '.');

    yield put(setToken(verifiedToken));
    const response = yield call(resetPassword, data);

    yield put(showPopup('Success!', response.message));
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  } finally {
    setLoading(false);
  }
}

export default function* resetPasswordSaga() {
  yield takeLatest(DO_RESET_PASSWORD, doResetPassword);
}
