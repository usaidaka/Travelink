import { connection, deleteFollower, deletePost, myFollow } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';

import { DELETE_FOLLOWER, DELETE_POST, GET_CONNECTION_DATA, GET_MY_FOLLOW } from './constants';
import { setConnectionData, setMyFollow } from './actions';

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

function* doGetMyFollow() {
  try {
    const response = yield call(myFollow);

    yield put(setMyFollow(response.result));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doDeleteFollower({ followId, cbSuccess }) {
  try {
    const response = yield call(deleteFollower, followId);
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
  yield takeLatest(GET_MY_FOLLOW, doGetMyFollow);
  yield takeLatest(DELETE_FOLLOWER, doDeleteFollower);
}
