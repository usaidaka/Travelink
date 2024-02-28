import {
  ADD_GROUP,
  DELETE_MEMBER,
  GET_MY_GROUP,
  LEAVE_GROUP,
  REMOVE_GROUP,
  SET_MY_GROUP,
  UPDATE_GROUP,
} from './constants';

export const getMyGroup = () => ({
  type: GET_MY_GROUP,
});

export const setMyGroup = (myGroup) => ({
  type: SET_MY_GROUP,
  myGroup,
});

export const leaveGroup = (groupId, cbSuccess) => ({
  type: LEAVE_GROUP,
  groupId,
  cbSuccess,
});

export const removeGroup = (groupId, cbSuccess) => ({
  type: REMOVE_GROUP,
  groupId,
  cbSuccess,
});

export const updateGroup = (groupId, data, cbSuccess) => ({
  type: UPDATE_GROUP,
  groupId,
  data,
  cbSuccess,
});

export const deleteMember = (userId, groupId, cbSuccess) => ({
  type: DELETE_MEMBER,
  userId,
  groupId,
  cbSuccess,
});

export const createGroup = (data, cbSuccess) => ({
  type: ADD_GROUP,
  data,
  cbSuccess,
});
