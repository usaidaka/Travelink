import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardPost from '@pages/Home/components/CardPost';

import store from '../../../../src/configureStore';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

jest.mock('@pages/Home/actions', () => ({
  ...jest.requireActual('@pages/Home/actions'),
  getComment: jest.fn(),
}));

let render;

const post = {
  id: 21,
  user_id: 3,
  caption: 'You cannot save people, you can just love them. If you wait, all that happens is you get older.',
  location_name: '發',
  createdAt: '2005-07-25T18:59:39.000Z',
  ImagePosts: [
    {
      image:
        'https://images.unsplash.com/photo-1707845690193-ec178cf78041?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ],
  Province: { name: 'Banten' },
  City: { name: 'Kota Surabaya' },
  User: {
    username: 'Lan',
    image: 'https://img.freepik.com/free-photo/smiling-woman-shirt-making-selfie-studio_171337-17196.jpg',
  },
};

const comment = [
  {
    id: 46,
    post_id: 21,
    user_id: 1,
    comment:
      'It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. To successfully establish a new connection to local/remote server - no matter via SSL, SSH or H',
    createdAt: '2002-06-22T04:03:10.000Z',
    User: {
      username: 'aka',
      image: 'http://res.cloudinary.com/dgdxx2chz/image/upload/v1709395999/image/ljnyr9ankzcwkcrkmb27.png',
    },
  },
  {
    id: 15,
    post_id: 21,
    user_id: 4,
    comment:
      'To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences.',
    createdAt: '2012-06-24T13:26:22.000Z',
    User: {
      username: 'Francisco',
      image: 'https://img.freepik.com/free-photo/smiling-woman-shirt-making-selfie-studio_171337-17196.jpg',
    },
  },
];

const user =
  'U2FsdGVkX1/crzjCq+i0WREavKXsBL9kROgR9iwjqP3yWiZqpl2x7OoRnXQIKDHgqD3z2stUtfO9mnb+c4uRWHWt/Gt6m7R65JN56ok+rrq0Ht9IyegPHAaNSCXXet/eNNhjR5ladZw5H6cVw3ArNlzPH1wFk3L9XNyFpTg3xjOgo0q9/eW80dC2W4zk8A5c4vomamKbppxMwj08p3/cWMuYGE4Su538Z8dJ7RyVNPsRxfFfEGGD111pUzgW3XCUeaY9ZnDaJUu9a8m2rr7P+FwNX63Bkrd+ptdSl8FZfnP1cU96uyVNi+s6x2UIw8w2JkeTzE0AcTiD/d34xtymlubrwBc6xCQ2vwt8/vWiXH8=';

describe('Card Post', () => {
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

  test('Card Post component is rendered', async () => {
    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    }));

    const mockGetComment = jest.fn(() => {
      post.id;
    });

    // eslint-disable-next-line global-require
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(mockUseForm);
    // eslint-disable-next-line global-require
    jest.spyOn(require('@pages/Home/actions'), 'getComment').mockImplementation(mockGetComment);

    const { getByTestId } = render(<CardPost post={post} comment={comment} user={user} />);

    const cardAuthContainer = getByTestId('cardPost');
    expect(cardAuthContainer).toBeInTheDocument();
  });
});
