import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectHomeState = (state) => state.home || initialState;

export const selectProfile = createSelector(selectHomeState, (state) => state.profile);
export const selectProvince = createSelector(selectHomeState, (state) => state.province);
export const selectNearby = createSelector(selectHomeState, (state) => state.nearby);
export const selectPost = createSelector(selectHomeState, (state) => state.post);
export const selectComment = createSelector(selectHomeState, (state) => state.comment);
