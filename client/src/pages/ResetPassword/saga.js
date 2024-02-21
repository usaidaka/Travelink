import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import decryptPayload from '@utils/decryptionHelper';
import { resetPassword } from '@domain/api';
import { setToken } from '@containers/Client/actions';

import { DO_RESET_PASSWORD } from './constants';

function* doResetPassword({ data, token, cbSuccess }) {
  yield put(setLoading(true));
  try {
    console.log(data);
    console.log(token);

    const response = yield call(resetPassword, data);
    yield put(setToken(token));
    const decryptedUser = decryptPayload(response.result);

    console.log(decryptedUser);
    yield put(showPopup('Success!', response.message));
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* resetPasswordSaga() {
  yield takeLatest(DO_RESET_PASSWORD, doResetPassword);
}
