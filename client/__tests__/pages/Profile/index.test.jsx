import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Profile from '@pages/Profile';

import store from '../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => (action) => action),
}));

jest.mock('reselect', () => ({
  ...jest.requireActual('reselect'),
}));

jest.mock('react-leaflet', () => ({
  ...jest.requireActual('react-leaflet'),
  MapContainer: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  Marker: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  TileLayer: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  MarkerClusterGroup: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
}));

describe('Profile', () => {
  beforeEach(() => {
    render = (component) =>
      RtlRender(
        <Provider store={store}>
          <Language>
            <MemoryRouter>{component}</MemoryRouter>
          </Language>
        </Provider>
      );
  });

  test('Profile Loading page is rendered', async () => {
    const { getByTestId } = render(<Profile />);

    const ProfileContainer = getByTestId('Loading');
    expect(ProfileContainer).toBeInTheDocument();
  });

  test('Profile page is rendered', async () => {
    const { getByTestId } = render(<Profile loadingTest={false} />);

    const ProfileContainer = getByTestId('profile');
    expect(ProfileContainer).toBeInTheDocument();
  });
});
