import { takeLatest, call, put } from 'redux-saga/effects';
import {
  region,
  myProfile,
  nearby,
  getPost,
  createPost,
  getComment,
  createComment,
  deleteCommentPost,
} from '@domain/api';
import { setLoading, showPopup } from '@containers/App/actions';
import {
  DO_POST,
  GET_POST,
  GET_NEARBY,
  GET_PROFILE,
  GET_PROVINCE,
  GET_COMMENT,
  DO_COMMENT,
  DELETE_COMMENT,
  GET_FOLLOWING_POST,
} from './constants';
import { setComment, setFollowingPost, setNearby, setPost, setProfile, setProvince } from './actions';

function* doGetRegion({ cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(region);
    cbSuccess && cbSuccess();
    yield put(setProvince(response.result?.province));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetProfile({ cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(myProfile);
    cbSuccess && cbSuccess();
    yield put(setProfile(response.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetNearby({ cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(nearby);
    cbSuccess && cbSuccess();
    yield put(setNearby(response.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetPost({ query, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(getPost, query);

    yield put(setPost(response.result));

    yield put(setFollowingPost(response?.result?.followingPost));

    cbSuccess && cbSuccess();
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doPost({ data, cbSuccess, cbFailed }) {
  setLoading(true);
  try {
    const response = yield call(createPost, data);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    cbFailed && cbFailed();
    if (error.response.data.error) {
      yield put(showPopup('Error', error.response.data.error));
    } else {
      yield put(showPopup('Error', error.response?.data?.message));
    }
  }
  setLoading(false);
}

function* doGetComment({ postId, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(getComment, postId);
    yield put(setComment(response.result));
    cbSuccess && cbSuccess();
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doComment({ postId, data, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(createComment, postId, data);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* deleteComment({ commentId, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(deleteCommentPost, commentId);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* homeSaga() {
  yield takeLatest(GET_PROVINCE, doGetRegion);
  yield takeLatest(GET_PROFILE, doGetProfile);
  yield takeLatest(GET_NEARBY, doGetNearby);
  yield takeLatest(GET_POST, doGetPost);
  yield takeLatest(GET_FOLLOWING_POST, doGetPost);
  yield takeLatest(GET_COMMENT, doGetComment);
  yield takeLatest(DO_POST, doPost);
  yield takeLatest(DO_COMMENT, doComment);
  yield takeLatest(DELETE_COMMENT, deleteComment);
}
