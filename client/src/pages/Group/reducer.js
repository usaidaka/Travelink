import { produce } from 'immer';
import { SET_MY_GROUP } from './constants';

export const initialState = {
  myGroup: '',
};

export const storedKey = [''];

const groupReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MY_GROUP:
        draft.myGroup = action.myGroup;
        break;

      default:
        break;
    }
  });

export default groupReducer;
