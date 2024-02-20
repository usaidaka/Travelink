import { produce } from 'immer';
import { SET_USER_DATA_INPUT, SET_STEP_PAGE } from './constants';

export const initialState = {
  data: {},
  step: 1,
};

export const storedKey = ['data', 'step'];

const registerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    console.log(action);
    switch (action.type) {
      case SET_USER_DATA_INPUT:
        draft.data = action.data;
        break;
      case SET_STEP_PAGE:
        draft.step = action.step;
        break;

      default:
        break;
    }
  });

export default registerReducer;
