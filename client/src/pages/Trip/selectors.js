import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectRouteState = (state) => state.route || initialState;

export const selectUserRoute = createSelector(selectRouteState, (state) => state.location);

export const selectCurrentCityList = createSelector(selectRouteState, (state) => state.currentCity);
export const selectDirectionCityList = createSelector(selectRouteState, (state) => state.directionCity);
