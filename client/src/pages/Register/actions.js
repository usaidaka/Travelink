import { SET_USER_DATA_INPUT, SET_STEP_PAGE, GET_STEP_PAGE, GET_USER_DATA_INPUT, DO_REGISTER } from './constants';

export const getUserDataInput = (data) => ({
  type: GET_USER_DATA_INPUT,
  data,
});

export const setUserDataInput = (data) => {
  console.log(data);
  return {
    type: SET_USER_DATA_INPUT,
    data,
  };
};

export const getStepPage = (step) => ({
  type: GET_STEP_PAGE,
  step,
});

export const setStepPage = (step) => ({
  type: SET_STEP_PAGE,
  step,
});

export const doRegister = (data, cbSuccess) => ({
  type: DO_REGISTER,
  data,
  cbSuccess,
});
