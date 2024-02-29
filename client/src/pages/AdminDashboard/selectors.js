import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDashboardState = (state) => state.dashboard || initialState;
export const selectDashboard = createSelector(selectDashboardState, (state) => state.dashboard);
