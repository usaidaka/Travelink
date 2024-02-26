import { produce } from 'immer';
import { SET_CONNECTION_DATA } from './constants';

export const initialState = {
  connection: '',
};

export const storedKey = ['connection'];

const connectionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CONNECTION_DATA:
        draft.connection = action.connection;
        break;

      default:
        break;
    }
  });

export default connectionReducer;
