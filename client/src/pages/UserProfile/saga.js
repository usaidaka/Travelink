import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { userConnection, userPost, userProfile } from '@domain/api';
import { setUserConnection, setUserPost, setUserProfile } from './actions';
import { GET_USER_CONNECTION, GET_USER_POST, GET_USER_PROFILE } from './constants';

function* getUserProfile({ userId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(userProfile, userId);

    if (!response.ok) {
      yield put(showPopup('Ups!', response.message));
    }

    console.log(response);

    yield put(setUserProfile(response?.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* getUserPost({ userId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(userPost, userId);

    if (!response.ok) {
      yield put(showPopup('Ups!', response.message));
    }

    console.log(response);

    yield put(setUserPost(response?.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* getUserConnection({ userId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(userConnection, userId);

    if (!response.ok) {
      yield put(showPopup('Ups!', response.message));
    }

    console.log(response);

    yield put(setUserConnection(response?.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

export default function* userProfileSaga() {
  yield takeLatest(GET_USER_PROFILE, getUserProfile);
  yield takeLatest(GET_USER_POST, getUserPost);
  yield takeLatest(GET_USER_CONNECTION, getUserConnection);
}