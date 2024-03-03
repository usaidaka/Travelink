import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Header from '@pages/NearbyCurrent/components/Header';

import store from '../../../../src/configureStore';

let render;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/some-path',
    search: '',
    hash: '',
    state: null,
    key: 'testKey',
  }),
}));

describe('Header', () => {
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

  test('Header page is rendered', async () => {
    const { getByTestId } = render(<Header />);

    const HeaderContainer = getByTestId('header');
    expect(HeaderContainer).toBeInTheDocument();
  });
});
