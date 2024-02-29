import {
  DELETE_FOLLOWER,
  DELETE_POST,
  GET_CONNECTION_DATA,
  GET_MY_FOLLOW,
  SET_CONNECTION_DATA,
  SET_MY_FOLLOW,
} from './constants';

export const getConnectionData = () => ({
  type: GET_CONNECTION_DATA,
});

export const setConnectionData = (connection) => {
  console.log(connection);
  return {
    type: SET_CONNECTION_DATA,
    connection,
  };
};

export const doDeletePost = (postId, cbSuccess) => ({
  type: DELETE_POST,
  postId,
  cbSuccess,
});

export const getMyFollow = () => ({
  type: GET_MY_FOLLOW,
});

export const setMyFollow = (myFollow) => ({
  type: SET_MY_FOLLOW,
  myFollow,
});

export const doDeleteFollower = (followId, cbSuccess) => ({
  type: DELETE_FOLLOWER,
  followId,
  cbSuccess,
});
