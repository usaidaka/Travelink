import { GET_CONNECTION_DATA, SET_CONNECTION_DATA } from './constants';

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
