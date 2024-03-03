import { produce } from 'immer';
import { SET_DESTINATION_BY_ID } from './constants';

export const initialState = {
  destinationById: '',
};

export const storedKey = [''];

const editDestinationReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DESTINATION_BY_ID:
        draft.destinationById = action.destinationById;
        break;
    }
  });

export default editDestinationReducer;
