import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import registerSaga from '@pages/Register/saga';
import loginSaga from '@pages/Login/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';

export default function* rootSaga() {
  yield all([appSaga(), loginSaga(), registerSaga(), resetPasswordSaga()]);
}
