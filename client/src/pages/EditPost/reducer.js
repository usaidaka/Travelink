import { produce } from 'immer';
import { SET_POST_DETAIL } from './constants';

export const initialState = {
  postDetail: '',
};
export const storedKey = [''];

const editPostReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_POST_DETAIL:
        draft.postDetail = action.postDetail;
        break;

      default:
        break;
    }
  });

export default editPostReducer;
