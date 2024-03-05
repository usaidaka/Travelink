import { takeLatest, call, put } from 'redux-saga/effects';
import { editDestination, getDestinationById } from '@domain/api';
import { setLoading, showPopup } from '@containers/App/actions';

import { EDIT_DESTINATION, GET_DESTINATION_BY_ID } from './constants';
import { setDestinationById } from './actions';

function* deGetDestinationById({ destinationId, cbSuccess, cbFailed }) {
  setLoading(true);
  try {
    const response = yield call(getDestinationById, destinationId);

    cbSuccess && cbSuccess();

    yield put(setDestinationById(response?.result));
  } catch (error) {
    cbFailed && cbFailed();
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

function* doEditDestination({ destinationId, data, cbSuccess, cbFailed }) {
  setLoading(true);
  try {
    const response = yield call(editDestination, destinationId, data);

    cbSuccess && cbSuccess(response.message);

    yield put(setDestinationById(response?.result));
  } catch (error) {
    cbFailed && cbFailed();
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* editDestinationSaga() {
  yield takeLatest(GET_DESTINATION_BY_ID, deGetDestinationById);
  yield takeLatest(EDIT_DESTINATION, doEditDestination);
}
