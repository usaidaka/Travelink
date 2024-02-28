import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { addGroup, deleteMember, leaveGroup, myGroup, removeGroup, updateGroup } from '@domain/api';

import { setMyGroup } from './actions';
import { ADD_GROUP, DELETE_MEMBER, GET_MY_GROUP, LEAVE_GROUP, REMOVE_GROUP, UPDATE_GROUP } from './constants';

function* doGetMyGroup() {
  yield put(setLoading(true));
  try {
    const response = yield call(myGroup);

    console.log(response);
    yield put(setMyGroup(response?.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doLeaveGroup({ groupId, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(leaveGroup, groupId);

    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doRemoveGroup({ groupId, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(removeGroup, groupId);

    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doUpdateGroup({ groupId, data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(updateGroup, groupId, data);

    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doDeleteMember({ userId, groupId, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(deleteMember, userId, groupId);

    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doCreateGroup({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(addGroup, data);

    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

export default function* groupSaga() {
  yield takeLatest(GET_MY_GROUP, doGetMyGroup);
  yield takeLatest(LEAVE_GROUP, doLeaveGroup);
  yield takeLatest(REMOVE_GROUP, doRemoveGroup);
  yield takeLatest(UPDATE_GROUP, doUpdateGroup);
  yield takeLatest(DELETE_MEMBER, doDeleteMember);
  yield takeLatest(ADD_GROUP, doCreateGroup);
}
