import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardDestination from '@pages/Destination/components/CardDestination';
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

describe('CardDestination', () => {
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

  test('CardDestination page is rendered', async () => {
    const pin = {
      id: 1,
      ImageDestinations: [
        { id: 1, image: 'www.google.com' },
        { id: 2, image: 'www.yahoo.com' },
      ],
      phone: '09123123213',
      Province: { name: 'Jakarta Timur' },
      City: { name: 'Ps Rebo' },
      detail: 'lorem ipsum',
      description: 'lorem ipsum',
    };

    const { getByTestId } = render(<CardDestination pin={pin} />);

    const carDestinationContainer = getByTestId('cardDestination');
    expect(carDestinationContainer).toBeInTheDocument();
  });
});
