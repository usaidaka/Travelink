import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEditDestination = (state) => state.editDestination || initialState;

export const selectDestinationById = createSelector(selectEditDestination, (state) => state.destinationById);
