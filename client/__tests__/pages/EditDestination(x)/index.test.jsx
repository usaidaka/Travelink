import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import EditDestination from '@pages/EditDestination';

import store from '../../../src/configureStore';

let render;

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

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

describe('EditDestination', () => {
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

  test('EditDestination page is rendered', async () => {
    // Mock the useForm hook return value
    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    }));

    // eslint-disable-next-line global-require
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(mockUseForm);

    const { getByTestId } = render(<EditDestination />);

    const EditDestinationContainer = getByTestId('editDestination');
    expect(EditDestinationContainer).toBeInTheDocument();
  });
});
