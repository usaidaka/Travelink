import { takeLatest, call, put } from 'redux-saga/effects';
import { region, myProfile, nearby, getPost, createPost } from '@domain/api';
import { setLoading, showPopup } from '@containers/App/actions';
import { DO_POST, GET_POST, GET_NEARBY, GET_PROFILE, GET_PROVINCE } from './constants';
import { setNearby, setPost, setProfile, setProvince } from './actions';

function* doGetRegion() {
  setLoading(true);
  try {
    const response = yield call(region);

    yield put(setProvince(response.result?.province));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetProfile() {
  setLoading(true);
  try {
    const response = yield call(myProfile);

    yield put(setProfile(response.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetNearby() {
  setLoading(true);
  try {
    const response = yield call(nearby);

    yield put(setNearby(response.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetPost() {
  setLoading(true);
  try {
    const response = yield call(getPost);

    yield put(setPost(response.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doPost({ data, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(createPost, data);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    console.log(error);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* homeSaga() {
  yield takeLatest(GET_PROVINCE, doGetRegion);
  yield takeLatest(GET_PROFILE, doGetProfile);
  yield takeLatest(GET_NEARBY, doGetNearby);
  yield takeLatest(GET_POST, doGetPost);
  yield takeLatest(DO_POST, doPost);
}
