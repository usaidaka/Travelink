import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import ChangePassword from '@pages/ChangePassword';

import store from '../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ChangePassword', () => {
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

  test('ChangePassword page is rendered', async () => {
    // Mock the useForm hook return value
    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    }));

    // eslint-disable-next-line global-require
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(mockUseForm);

    const { getByTestId } = render(<ChangePassword />);

    const ChangePasswordContainer = getByTestId('changePassword');
    expect(ChangePasswordContainer).toBeInTheDocument();
  });
});
