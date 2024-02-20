import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectRegisterState = (state) => state.register || initialState;

export const selectUserDataInput = createSelector(selectRegisterState, (state) => state.data);
export const selectStepPage = createSelector(selectRegisterState, (state) => state.step);
