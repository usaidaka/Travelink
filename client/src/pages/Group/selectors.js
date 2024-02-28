import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectGroupState = (state) => state.group || initialState;

export const selectMyGroup = createSelector(selectGroupState, (state) => state.myGroup);
