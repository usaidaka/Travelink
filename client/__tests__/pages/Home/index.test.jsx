import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Home from '@pages/Home';
import store from '../../../src/configureStore';

let render;

describe('Home', () => {
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

  test('Home Loading page is rendered', async () => {
    const { getByTestId } = render(<Home />);

    const homeLoading = getByTestId('Loading');
    expect(homeLoading).toBeInTheDocument();
  });

  test('Home page is rendered', async () => {
    const { getByTestId } = render(<Home loadingTest={false} />);

    const homeContainer = getByTestId('home');
    expect(homeContainer).toBeInTheDocument();
  });
});
