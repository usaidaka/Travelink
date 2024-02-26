import { DO_FOLLOW, GET_USER_LIST, SET_USER_LIST } from './constants';

export const getUserList = (query) => ({
  type: GET_USER_LIST,
  query,
});

export const setUserList = (userList) => ({
  type: SET_USER_LIST,
  userList,
});

export const doFollow = (followTo) => ({
  type: DO_FOLLOW,
  followTo,
});
