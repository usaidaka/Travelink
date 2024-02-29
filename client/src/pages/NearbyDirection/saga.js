import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { nearbyDirection } from '@domain/api';
import { setNearbyDirection } from './action';
import { GET_NEARBY_DIRECTION } from './constants';

function* doGetNearbyDirection() {
  setLoading(true);
  try {
    const response = yield call(nearbyDirection);
    console.log(response);
    yield put(setNearbyDirection(response.result));
  } catch (error) {
    console.log(error);
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* nearbyDirectionSaga() {
  yield takeLatest(GET_NEARBY_DIRECTION, doGetNearbyDirection);
}
