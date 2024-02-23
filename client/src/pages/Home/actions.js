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

export const getPost = (post) => ({
  type: GET_POST,
  post,
});

export const setPost = (post) => ({
  type: SET_POST,
  post,
});

export const doPost = (data, cbSuccess) => ({
  type: DO_POST,
  data,
  cbSuccess,
});
