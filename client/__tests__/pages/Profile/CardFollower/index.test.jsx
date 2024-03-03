import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardFollower from '@pages/Profile/components/CardFollower';

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

describe('CardFollower', () => {
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

  test('CardFollower page is rendered', async () => {
    const follow = {
      follow_by: 2,
      id: 1,
      followBy: {
        username: 'Xiuying',
        image: 'https://img.freepik.com/free-photo/close-up-smiley-man-taking-selfie_23-2149155156.jpg',
        id: 2,
      },
    };

    const { getByTestId } = render(<CardFollower follow={follow} />);

    const CardFollowerContainer = getByTestId('cardFollower');
    expect(CardFollowerContainer).toBeInTheDocument();
  });
});
