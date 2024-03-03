import { produce } from 'immer';
import { SET_NEARBY, SET_PROVINCE, SET_PROFILE, SET_POST, SET_COMMENT, SET_FOLLOWING_POST } from './constants';

export const initialState = {
  profile: '',
  province: [],
  nearby: '',
  post: {},
  followingPost: [],
  comment: [],
};

export const storedKey = ['profile', 'province', 'nearby', 'post'];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
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
      case SET_FOLLOWING_POST:
        draft.followingPost = action.followingPost;
        break;
      case SET_COMMENT:
        draft.comment = action.comment;
    }
  });

export default homeReducer;
