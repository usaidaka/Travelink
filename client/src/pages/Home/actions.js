import {
  GET_PROFILE,
  SET_PROFILE,
  GET_NEARBY,
  SET_NEARBY,
  GET_PROVINCE,
  SET_PROVINCE,
  GET_POST,
  SET_POST,
  DO_POST,
  GET_COMMENT,
  SET_COMMENT,
  DO_COMMENT,
  DELETE_COMMENT,
  GET_FOLLOWING_POST,
  SET_FOLLOWING_POST,
} from './constants';

export const getProfile = (cbSuccess) => ({
  type: GET_PROFILE,
  cbSuccess,
});

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  profile,
});

export const getNearby = (cbSuccess) => ({
  type: GET_NEARBY,
  cbSuccess,
});

export const setNearby = (nearby) => ({
  type: SET_NEARBY,
  nearby,
});

export const getProvince = (cbSuccess) => ({
  type: GET_PROVINCE,
  cbSuccess,
});

export const setProvince = (province) => ({
  type: SET_PROVINCE,
  province,
});

export const getPost = (query, cbSuccess) => ({
  type: GET_POST,
  query,
  cbSuccess,
});

export const setPost = (post) => ({
  type: SET_POST,
  post,
});

export const doPost = (data, cbSuccess, cbFailed) => ({
  type: DO_POST,
  data,
  cbFailed,
  cbSuccess,
});

export const getComment = (postId, cbSuccess) => ({
  type: GET_COMMENT,
  postId,
  cbSuccess,
});

export const setComment = (comment) => {
  console.log(comment);
  return { type: SET_COMMENT, comment };
};

export const doComment = (postId, data, cbSuccess) => ({
  type: DO_COMMENT,
  postId,
  data,
  cbSuccess,
});

export const deleteComment = (commentId, cbSuccess) => ({
  type: DELETE_COMMENT,
  commentId,
  cbSuccess,
});

export const getFollowingPost = (query, cbSuccess) => ({
  type: GET_FOLLOWING_POST,
  query,
  cbSuccess,
});

export const setFollowingPost = (followingPost) => ({
  type: SET_FOLLOWING_POST,
  followingPost,
});
