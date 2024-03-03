import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Destination from '@pages/Destination';

import store from '../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
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

describe('Destination', () => {
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

  test('Destination page is rendered', async () => {
    const { getByTestId } = render(<Destination />);

    const DestinationContainer = getByTestId('destination');
    expect(DestinationContainer).toBeInTheDocument();
  });
});
