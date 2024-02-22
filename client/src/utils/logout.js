import { setLogin, setUser, setToken } from '@containers/Client/actions';
import { setUserRoute } from '@pages/Trip/actions';

export const logout = (dispatch, navigate) => {
  dispatch(setLogin(false));
  dispatch(setUser(''));
  dispatch(setToken(null));
  dispatch(setUserRoute(''));
  navigate('/login');
};
