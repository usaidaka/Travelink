import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardAuth from '@components/CardAuth';
import store from '../../../src/configureStore';

jest.mock('@assets/logo.png', () => ({
  ...jest.requireActual(`../../fixtures/assets/logo.png`),
}));

let render;

describe('Card Auth', () => {
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

  const src = 'www.google.com';

  test('Card Auth component is rendered', async () => {
    const { getByTestId } = render(
      <CardAuth src={src}>
        <p>Children</p>
      </CardAuth>
    );

    const cardAuthContainer = getByTestId('cardAuth');
    expect(cardAuthContainer).toBeInTheDocument();
  });
});
