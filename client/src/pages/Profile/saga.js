import { connection, deletePost } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';

import { DELETE_POST, GET_CONNECTION_DATA } from './constants';
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

function* doDeletePost({ postId, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(deletePost, postId);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* connectionSaga() {
  yield takeLatest(GET_CONNECTION_DATA, getConnection);
  yield takeLatest(DELETE_POST, doDeletePost);
}
