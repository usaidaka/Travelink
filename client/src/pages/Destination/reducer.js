import { produce } from 'immer';
import { SET_DESTINATION } from './constants';

export const initialState = {
  destination: '',
};

export const storedKey = ['destination'];

const destinationReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DESTINATION:
        draft.destination = action.destination;
        break;

      default:
        break;
    }
  });

export default destinationReducer;
