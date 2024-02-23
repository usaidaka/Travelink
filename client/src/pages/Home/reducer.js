import { produce } from 'immer';
import { SET_NEARBY, SET_PROVINCE, SET_PROFILE, SET_POST } from './constants';

export const initialState = {
  profile: '',
  province: [],
  nearby: '',
  post: [],
};

export const storedKey = ['profile', 'province', 'nearby', 'post'];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    console.log(action);
    switch (action.type) {
      case SET_PROFILE:
        draft.profile = action.profile;
        break;
      case SET_PROVINCE:
        draft.province = action.province;
        break;
      case SET_NEARBY:
        draft.nearby = action.nearby;
        break;
      case SET_POST:
        draft.post = action.post;
        break;
    }
  });

export default homeReducer;
