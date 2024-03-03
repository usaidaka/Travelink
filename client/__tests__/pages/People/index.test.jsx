import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import People from '@pages/People';

import store from '../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => (action) => action),
}));

describe('People', () => {
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

  test('People page is rendered', async () => {
    const { getByTestId } = render(<People />);

    const PeopleContainer = getByTestId('people');
    expect(PeopleContainer).toBeInTheDocument();
  });
});
