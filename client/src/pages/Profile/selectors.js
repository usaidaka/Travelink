import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectConnectionState = (state) => state.connection || initialState;

export const selectConnection = createSelector(selectConnectionState, (state) => state.connection);
