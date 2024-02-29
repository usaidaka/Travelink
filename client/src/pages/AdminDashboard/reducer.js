import { produce } from 'immer';
import { SET_DASHBOARD_DATA } from './constants';

export const initialState = {
  dashboard: '',
};

export const storedKey = ['dashboard'];

const dashboardReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    console.log(action);
    switch (action.type) {
      case SET_DASHBOARD_DATA:
        draft.dashboard = action.dashboard;
        break;

      default:
        break;
    }
  });

export default dashboardReducer;
