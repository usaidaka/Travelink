import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectConnectionState = (state) => state.connection || initialState;

export const selectConnection = createSelector(selectConnectionState, (state) => state.connection);
export const selectMyFollow = createSelector(selectConnectionState, (state) => state.myFollow);
