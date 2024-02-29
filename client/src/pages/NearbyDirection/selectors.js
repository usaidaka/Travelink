import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectNearbyDirectionState = (state) => state.nearbyDirection || initialState;

export const selectNearbyDirection = createSelector(selectNearbyDirectionState, (state) => state.nearbyDirection);
