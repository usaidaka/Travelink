import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { createDestination, deleteDestination, getDestination } from '@domain/api';
import { CREATE_DESTINATION, DELETE_DESTINATION, GET_DESTINATION } from './constants';
import { setDestination } from './actions';

function* doCreateDestination({ data, cbSuccess, cbFailed }) {
  setLoading(true);
  try {
    const response = yield call(createDestination, data);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    console.log(error);
    cbFailed && cbFailed();
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doGetDestination() {
  setLoading(true);
  try {
    const response = yield call(getDestination);
    console.log(response);
    yield put(setDestination(response.result));
  } catch (error) {
    console.log(error);

    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doDeleteDestination({ destinationId, cbSuccess }) {
  setLoading(true);
  try {
    console.log(destinationId);
    const response = yield call(deleteDestination, destinationId);
    console.log(response);
    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    console.log(error);

    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* destinationSaga() {
  yield takeLatest(CREATE_DESTINATION, doCreateDestination);
  yield takeLatest(GET_DESTINATION, doGetDestination);
  yield takeLatest(DELETE_DESTINATION, doDeleteDestination);
}
