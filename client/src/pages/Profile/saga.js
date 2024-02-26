import { connection } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';

import { GET_CONNECTION_DATA } from './constants';
import { setConnectionData } from './actions';

function* getConnection() {
  setLoading(true);
  try {
    const response = yield call(connection);
    console.log(response);
    yield put(setConnectionData(response.result));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* connectionSaga() {
  yield takeLatest(GET_CONNECTION_DATA, getConnection);
}
