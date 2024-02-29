import { produce } from 'immer';
import { SET_CONNECTION_DATA, SET_MY_FOLLOW } from './constants';

export const initialState = {
  connection: '',
  myFollow: '',
};

export const storedKey = ['connection', 'myFollow'];

const connectionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CONNECTION_DATA:
        draft.connection = action.connection;
        break;
      case SET_MY_FOLLOW:
        draft.myFollow = action.myFollow;
        break;

      default:
        break;
    }
  });

export default connectionReducer;
