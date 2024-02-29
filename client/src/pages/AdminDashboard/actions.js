import { GET_DASHBOARD_DATA, SET_DASHBOARD_DATA } from './constants';

export const getDashboardData = () => ({
  type: GET_DASHBOARD_DATA,
});

export const setDashboardData = (dashboard) => {
  console.log(dashboard);
  return {
    type: SET_DASHBOARD_DATA,
    dashboard,
  };
};
