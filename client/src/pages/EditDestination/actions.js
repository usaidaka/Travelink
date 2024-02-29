import { EDIT_DESTINATION, GET_DESTINATION_BY_ID, SET_DESTINATION_BY_ID } from './constants';

export const getDestinationById = (destinationId, cbSuccess, cbFailed) => ({
  type: GET_DESTINATION_BY_ID,
  destinationId,
  cbSuccess,
  cbFailed,
});

export const setDestinationById = (destinationById) => ({
  type: SET_DESTINATION_BY_ID,
  destinationById,
});

export const doEditDestination = (destinationId, data, cbSuccess, cbFailed) => ({
  type: EDIT_DESTINATION,
  destinationId,
  data,
  cbSuccess,
  cbFailed,
});
