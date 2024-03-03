import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import NotFound from '@pages/NotFound';

import store from '../../../src/configureStore';

let render;

jest.mock('@static/images/not-found.png', () => ({
  ...jest.requireActual(`../../fixtures/assets/logo.png`),
}));

describe('NotFound', () => {
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

  test('NotFound page is rendered', async () => {
    const { getByTestId } = render(<NotFound />);

    const NotFoundContainer = getByTestId('notFound');
    expect(NotFoundContainer).toBeInTheDocument();
  });
});
