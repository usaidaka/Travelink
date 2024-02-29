import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectUserProfileState = (state) => state.userProfile || initialState;

export const selectUserProfile = createSelector(selectUserProfileState, (state) => state.userProfile);
export const selectUserPost = createSelector(selectUserProfileState, (state) => state.posts);
export const selectUserConnection = createSelector(selectUserProfileState, (state) => state.userConnection);
export const selectUserFollow = createSelector(selectUserProfileState, (state) => state.userFollow);
