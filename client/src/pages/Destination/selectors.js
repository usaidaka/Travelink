import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectDestinationState = (state) => state.destination || initialState;

export const selectDestination = createSelector(selectDestinationState, (state) => state.destination);
