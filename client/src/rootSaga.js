import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import registerSaga from '@pages/Register/saga';
import loginSaga from '@pages/Login/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';
import routeSaga from '@pages/Trip/saga';

export default function* rootSaga() {
  yield all([appSaga(), loginSaga(), registerSaga(), resetPasswordSaga(), routeSaga()]);
}
