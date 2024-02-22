import { produce } from 'immer';
import { SET_CURRENT_CITY, SET_DIRECTION_CITY, SET_USER_ROUTE } from './constants';

export const initialState = {
  location: '',
  currentCity: [],
  directionCity: [],
};

export const storedKey = ['location'];

const routeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER_ROUTE:
        draft.location = action.location;
        break;
      case SET_CURRENT_CITY:
        draft.currentCity = action.currentCity;
        break;
      case SET_DIRECTION_CITY:
        draft.directionCity = action.directionCity;
        break;
      default:
        break;
    }
  });

export default routeReducer;
