import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import decryptPayload from '@utils/decryptionHelper';
import { register } from '@domain/api';

import { setStepPage, setUserDataInput } from './actions';
import { DO_REGISTER, GET_STEP_PAGE, GET_USER_DATA_INPUT } from './constants';

function* doGetUserInputData({ data }) {
  yield put(setLoading(true));
  try {
    console.log(data);
    yield put(setUserDataInput(data));
  } catch (error) {
    yield put(showPopup());
  }
  yield put(setLoading(false));
}

function* doGetStepPage({ step }) {
  yield put(setLoading(true));
  try {
    yield put(setStepPage(step));
  } catch (error) {
    yield put(showPopup());
  }
  yield put(setLoading(false));
}

function* doRegister({ data, cbSuccess }) {
  setLoading(true);
  try {
    console.log(data);
    const response = yield call(register, data);

    const decryptedUser = decryptPayload(response.result);
    console.log(decryptedUser);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* registerSaga() {
  yield takeLatest(GET_USER_DATA_INPUT, doGetUserInputData);
  yield takeLatest(GET_STEP_PAGE, doGetStepPage);
  yield takeLatest(DO_REGISTER, doRegister);
}
