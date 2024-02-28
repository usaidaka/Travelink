import {
  DO_ROUTE,
  GET_CURRENT_CITY,
  SET_CURRENT_CITY,
  GET_DIRECTION_CITY,
  SET_DIRECTION_CITY,
  GET_USER_ROUTE,
  SET_USER_ROUTE,
} from './constants';

export const getUserRoute = () => ({
  type: GET_USER_ROUTE,
});

export const setUserRoute = (location) => ({ type: SET_USER_ROUTE, location });

export const getCurrentCityList = (provinceId) => ({
  type: GET_CURRENT_CITY,
  provinceId,
});

export const setCurrentCityList = (currentCity) => ({
  type: SET_CURRENT_CITY,
  currentCity,
});

export const getDirectionCityList = (provinceId) => ({
  type: GET_DIRECTION_CITY,
  provinceId,
});

export const setDirectionCityList = (directionCity) => ({
  type: SET_DIRECTION_CITY,
  directionCity,
});

export const doRoute = (data, cbSuccess) => ({
  type: DO_ROUTE,
  data,
  cbSuccess,
});
