import { takeLatest, call, put } from 'redux-saga/effects';
import { forgotPassword, login, region } from '@domain/api';
import { setLogin, setProvince, setToken, setUser } from '@containers/Client/actions';
import { setLoading, showPopup } from '@containers/App/actions';
import decryptPayload from '@utils/decryptionHelper';
import { DO_FORGOT_PASSWORD, DO_LOGIN } from './constants';

function* doLogin({ data, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(login, data);

    const regionResponse = yield call(region);

    yield put(setProvince(regionResponse.result?.province));

    yield put(setLogin(true));
    yield put(setToken(response.token));
    yield put(setUser(response.result));
    const decryptedUser = decryptPayload(response.result);

    cbSuccess && cbSuccess(decryptedUser.role, response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doForgotPassword({ data, cbSuccess, cbFailed }) {
  setLoading(true);
  try {
    const response = yield call(forgotPassword, data);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    cbFailed && cbFailed();
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* loginSaga() {
  yield takeLatest(DO_LOGIN, doLogin);
  yield takeLatest(DO_FORGOT_PASSWORD, doForgotPassword);
}
