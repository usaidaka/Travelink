import { takeLatest, call, put } from 'redux-saga/effects';
import { follow, userList } from '@domain/api';
import { setLoading, showPopup } from '@containers/App/actions';
import { setUserList } from './actions';
import { DO_FOLLOW, GET_USER_LIST } from './constants';

function* getUserList({ query }) {
  setLoading(true);
  try {
    const response = yield call(userList, query);

    yield put(setUserList(response.result));
  } catch (error) {
    console.log(error);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doFollow({ followTo, cbSuccess }) {
  try {
    const response = yield call(follow, followTo);
    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    console.log(error);
    yield put(showPopup('Error', error.response?.data?.message));
  }
}

export default function* peopleSaga() {
  yield takeLatest(GET_USER_LIST, getUserList);
  yield takeLatest(DO_FOLLOW, doFollow);
}
