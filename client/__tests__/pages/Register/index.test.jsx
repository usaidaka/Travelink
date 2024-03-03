import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Register from '@pages/Register';

import store from '../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => (action) => action),
}));

jest.mock('@assets/registerDecoration.jpg', () => ({
  ...jest.requireActual(`../../fixtures/assets/logo.png`),
}));

describe('Register', () => {
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

  test('Register Loading page is rendered', async () => {
    const { getByTestId } = render(<Register />);

    const RegisterContainer = getByTestId('register');
    expect(RegisterContainer).toBeInTheDocument();
  });
});
