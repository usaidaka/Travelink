import { DO_EDIT_POST, GET_POST_DETAIL, SET_POST_DETAIL } from './constants';

export const getPostDetail = (postId, cbSuccess) => ({
  type: GET_POST_DETAIL,
  postId,
  cbSuccess,
});

export const setPostDetail = (postDetail) => ({
  type: SET_POST_DETAIL,
  postDetail,
});

export const doEditPost = (postId, data, cbSuccess) => ({
  type: DO_EDIT_POST,
  postId,
  data,
  cbSuccess,
});
