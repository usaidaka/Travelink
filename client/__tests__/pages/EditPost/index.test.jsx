import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import EditPost from '@pages/EditPost';

import store from '../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => (action) => action),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

describe('EditPost', () => {
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

  test('EditPost Loading page is rendered', async () => {
    const postDetail = {
      id: 103,
      user_id: 1,
      caption: '',
      location_name: '',
      createdAt: '2024-03-01T17:03:58.000Z',
      ImagePosts: [
        {
          image: 'http://res.cloudinary.com/dgdxx2chz/image/upload/v1709312639/image/aeztefibb8ivdk7etpw5.png',
        },
      ],
      Province: { id: 1 },
      City: { id: 17 },
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

    const { getByTestId } = render(<EditPost postDetail={postDetail} />);

    const EditPostContainer = getByTestId('Loading');
    expect(EditPostContainer).toBeInTheDocument();
  });

  test('EditPost page is rendered', async () => {
    const postDetail = {
      id: 103,
      user_id: 1,
      caption: '',
      location_name: '',
      createdAt: '2024-03-01T17:03:58.000Z',
      ImagePosts: [
        {
          image: 'http://res.cloudinary.com/dgdxx2chz/image/upload/v1709312639/image/aeztefibb8ivdk7etpw5.png',
        },
      ],
      Province: { id: 1 },
      City: { id: 17 },
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

    const { getByTestId } = render(<EditPost postDetail={postDetail} loadingTest={false} />);

    const EditPostContainer = getByTestId('editPost');
    expect(EditPostContainer).toBeInTheDocument();
  });
});
