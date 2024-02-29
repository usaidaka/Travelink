import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { dashboard } from '@domain/api';
import { GET_DASHBOARD_DATA } from './constants';
import { setDashboardData } from './actions';

function* doGetDashboardData() {
  setLoading(true);
  try {
    const response = yield call(dashboard);
    console.log(response.result);
    yield put(setDashboardData(response.result));
  } catch (error) {
    console.log(error);

    yield put(showPopup('Error', error.response?.data?.message));
  }
  setLoading(false);
}

export default function* dashboardSaga() {
  yield takeLatest(GET_DASHBOARD_DATA, doGetDashboardData);
}
