import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectPeopleState = (state) => state.people || initialState;

export const selectUserList = createSelector(selectPeopleState, (state) => state.userList);
