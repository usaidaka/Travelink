import { DELETE_POST, GET_CONNECTION_DATA, SET_CONNECTION_DATA } from './constants';

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
