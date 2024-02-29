import { produce } from 'immer';
import { SET_USER_LIST } from './constants';

export const initialState = {
  userList: '',
};

export const storedKey = [''];

const peopleReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER_LIST:
        draft.userList = action.userList;
        break;

      default:
        break;
    }
  });

export default peopleReducer;
