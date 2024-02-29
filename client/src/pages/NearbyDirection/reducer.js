import { produce } from 'immer';
import { SET_NEARBY_DIRECTION } from './constants';

export const initialState = {
  nearbyDirection: '',
};

export const storedKey = ['nearbyDirection'];

const nearbyDirectionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_NEARBY_DIRECTION:
        draft.nearbyDirection = action.nearbyDirection;
        break;

      default:
        break;
    }
  });

export default nearbyDirectionReducer;
