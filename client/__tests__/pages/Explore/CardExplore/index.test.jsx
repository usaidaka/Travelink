import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardExplore from '@pages/Explore/CardExplore';

import store from '../../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

describe('CardExplore', () => {
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

  test('CardExplore page is rendered', async () => {
    const post = {
      id: 97,
      user_id: 1,
      caption: '',
      location_name: '',
      createdAt: '2024-03-01T09:37:03.000Z',
      ImagePosts: [
        {
          image: 'http://res.cloudinary.com/dgdxx2chz/image/upload/v1709285826/image/wa62gwaxwgkozdphgst2.png',
        },
      ],
      Province: null,
      City: null,
      User: {
        username: 'aka',
        image: 'http://res.cloudinary.com/dgdxx2chz/image/upload/v1709395999/image/ljnyr9ankzcwkcrkmb27.png',
      },
    };

    // Mock the useForm hook return value
    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    }));

    // eslint-disable-next-line global-require
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(mockUseForm);

    const { getByTestId } = render(<CardExplore post={post} />);

    const CardExploreContainer = getByTestId('cardExplore');
    expect(CardExploreContainer).toBeInTheDocument();
  });
});
