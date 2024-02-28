import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import registerSaga from '@pages/Register/saga';
import loginSaga from '@pages/Login/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';
import routeSaga from '@pages/Trip/saga';
import homeSaga from '@pages/Home/saga';
import peopleSaga from '@pages/People/saga';
import connectionSaga from '@pages/Profile/saga';
import editPostSaga from '@pages/EditPost/saga';
import userProfileSaga from '@pages/UserProfile/saga';
import groupSaga from '@pages/Group/saga';
import settingSaga from '@pages/Setting/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    loginSaga(),
    registerSaga(),
    resetPasswordSaga(),
    routeSaga(),
    homeSaga(),
    peopleSaga(),
    connectionSaga(),
    editPostSaga(),
    userProfileSaga(),
    groupSaga(),
    settingSaga(),
  ]);
}
