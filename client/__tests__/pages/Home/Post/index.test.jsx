import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import Post from '@pages/Home/components/Post';
import store from '../../../../src/configureStore';

let render;

describe('Post', () => {
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

  test('Post page is rendered', async () => {
    const { getByTestId } = render(<Post />);

    const postContainer = getByTestId('post');
    expect(postContainer).toBeInTheDocument();

    const buttonSubmit = getByTestId('submit');
    expect(buttonSubmit).toBeInTheDocument();
  });
});
