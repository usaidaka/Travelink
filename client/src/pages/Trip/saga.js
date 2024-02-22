import { takeLatest, call, put } from 'redux-saga/effects';
import { showPopup, setLoading } from '@containers/App/actions';
import { addRoute, myRoute, region } from '@domain/api';

import { setCurrentCityList, setDirectionCityList, setUserRoute } from './actions';
import { DO_ROUTE, GET_CURRENT_CITY, GET_DIRECTION_CITY, GET_USER_ROUTE } from './constants';

function* doGetUserRoute() {
  yield put(setLoading(true));
  try {
    const response = yield call(myRoute);

    if (!response.ok) {
      yield put(showPopup('Ups!', response.message));
    }
    yield put(setUserRoute(response?.result));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doGetCurrentCityList({ provinceId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(region, provinceId);

    if (!response.ok) {
      yield put(showPopup('Ups!', response.message));
    }
    yield put(setCurrentCityList(response?.result?.city));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doGetDirectionCityList({ provinceId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(region, provinceId);

    if (!response.ok) {
      yield put(showPopup('Ups!', response.message));
    }

    yield put(setDirectionCityList(response?.result?.city));
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  yield put(setLoading(false));
}

function* doRoute({ data, cbSuccess }) {
  setLoading(true);
  try {
    const response = yield call(addRoute, data);

    cbSuccess && cbSuccess(response.message);
  } catch (error) {
    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* routeSaga() {
  yield takeLatest(GET_USER_ROUTE, doGetUserRoute);
  yield takeLatest(GET_CURRENT_CITY, doGetCurrentCityList);
  yield takeLatest(GET_DIRECTION_CITY, doGetDirectionCityList);
  yield takeLatest(DO_ROUTE, doRoute);
}
