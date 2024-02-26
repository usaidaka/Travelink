import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectPostDetailState = (state) => state.editPost || initialState;

export const selectPostDetail = createSelector(selectPostDetailState, (state) => state.postDetail);
