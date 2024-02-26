import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';

import { getPostDetail, updatePost } from '@domain/api';
import { setPostDetail } from './actions';
import { DO_EDIT_POST, GET_POST_DETAIL } from './constants';

function* doGetPostDetail({ postId, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(getPostDetail, postId);
    console.log(response);

    yield put(setPostDetail(response.result));
    cbSuccess && cbSuccess();
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doEditPostDetail({ postId, data }) {
  setLoading(true);
  try {
    const response = yield call(updatePost, postId, data);
    console.log(response);
    yield put(setPostDetail(response.result));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* editPostSaga() {
  yield takeLatest(GET_POST_DETAIL, doGetPostDetail);
  yield takeLatest(DO_EDIT_POST, doEditPostDetail);
}
