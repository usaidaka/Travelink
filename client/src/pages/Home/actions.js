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
} from './constants';

export const getProfile = (profile) => ({
  type: GET_PROFILE,
  profile,
});

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  profile,
});

export const getNearby = (nearby) => ({
  type: GET_NEARBY,
  nearby,
});

export const setNearby = (nearby) => ({
  type: SET_NEARBY,
  nearby,
});

export const getProvince = (province) => ({
  type: GET_PROVINCE,
  province,
});

export const setProvince = (province) => ({
  type: SET_PROVINCE,
  province,
});

export const getPost = (query) => ({
  type: GET_POST,
  query,
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

export const getComment = (postId) => ({
  type: GET_COMMENT,
  postId,
});

export const setComment = (comment) => {
  console.log(comment);
  return { type: SET_COMMENT, comment };
};
