import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Group from '@pages/Group';

import store from '../../../src/configureStore';

let render;

jest.mock('react-leaflet', () => ({
  ...jest.requireActual('react-leaflet'),
  MapContainer: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  Marker: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  TileLayer: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  MarkerClusterGroup: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  Popup: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),

  useDispatch: jest.fn(() => (action) => action),
}));

describe('Group', () => {
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

  test('Group page is rendered', async () => {
    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    }));

    // eslint-disable-next-line global-require
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(mockUseForm);

    const { getByTestId } = render(<Group />);

    const GroupContainer = getByTestId('group');
    expect(GroupContainer).toBeInTheDocument();
  });
});
