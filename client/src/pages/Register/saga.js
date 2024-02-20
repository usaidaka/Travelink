import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { setStepPage, setUserDataInput } from './actions';
import { GET_STEP_PAGE, GET_USER_DATA_INPUT } from './constants';

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

export default function* registerSaga() {
  yield takeLatest(GET_USER_DATA_INPUT, doGetUserInputData);
  yield takeLatest(GET_STEP_PAGE, doGetStepPage);
}
