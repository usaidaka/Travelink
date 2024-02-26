import { produce } from 'immer';
import { SET_USER_CONNECTION, SET_USER_POST, SET_USER_PROFILE } from './constants';

export const initialState = {
  userProfile: '',
  posts: [],
  userConnection: '',
};

export const storedKey = [''];

const userProfileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER_PROFILE:
        draft.userProfile = action.userProfile;
        break;
      case SET_USER_POST:
        draft.posts = action.posts;
        break;
      case SET_USER_CONNECTION:
        draft.userConnection = action.userConnection;
        break;
      default:
        break;
    }
  });

export default userProfileReducer;
