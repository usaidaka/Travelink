import { GET_NEARBY_DIRECTION, SET_NEARBY_DIRECTION } from './constants';

export const getNearbyDirection = () => ({
  type: GET_NEARBY_DIRECTION,
});

export const setNearbyDirection = (nearbyDirection) => ({
  type: SET_NEARBY_DIRECTION,
  nearbyDirection,
});
