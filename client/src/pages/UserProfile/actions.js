import {
  GET_USER_CONNECTION,
  GET_USER_POST,
  GET_USER_PROFILE,
  SET_USER_CONNECTION,
  SET_USER_POST,
  SET_USER_PROFILE,
} from './constants';

export const getUserProfile = (userId) => ({
  type: GET_USER_PROFILE,
  userId,
});

export const setUserProfile = (userProfile) => ({
  type: SET_USER_PROFILE,
  userProfile,
});

export const getUserPost = (userId, query) => ({
  type: GET_USER_POST,
  userId,
  query,
});

export const setUserPost = (posts) => ({
  type: SET_USER_POST,
  posts,
});

export const getUserConnection = (userId) => ({
  type: GET_USER_CONNECTION,
  userId,
});

export const setUserConnection = (userConnection) => ({
  type: SET_USER_CONNECTION,
  userConnection,
});
