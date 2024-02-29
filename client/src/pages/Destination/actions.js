import { CREATE_DESTINATION, DELETE_DESTINATION, GET_DESTINATION, SET_DESTINATION } from './constants';

export const doCreateDestination = (data, cbSuccess, cbFailed) => ({
  type: CREATE_DESTINATION,
  data,
  cbSuccess,
  cbFailed,
});

export const setDestination = (destination) => ({
  type: SET_DESTINATION,
  destination,
});

export const getDestination = () => ({
  type: GET_DESTINATION,
});

export const doDeleteDestination = (destinationId, cbSuccess) => ({
  type: DELETE_DESTINATION,
  destinationId,
  cbSuccess,
});
