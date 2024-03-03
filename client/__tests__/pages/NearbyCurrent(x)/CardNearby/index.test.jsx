import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardNearby from '@pages/NearbyCurrent/components/CardNearby';

import store from '../../../../src/configureStore';

let render;

describe('CardNearby', () => {
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

  test('CardNearby page is rendered', async () => {
    const mark = {
      id: 3,
      user_id: 3,
      profile: {
        username: 'Lan',
        email: 'lashi@icloud.com',
        image: 'https://img.freepik.com/free-photo/smiling-woman-shirt-making-selfie-studio_171337-17196.jpg',
      },
      current_position: ['-6.2265517', '106.8525121'],
      direction_position: ['-2.58422595', '127.47894514424743'],
      current_region: { province: 'DKI Jakarta', city: 'Kota Jakarta Selatan' },
      direction_region: { province: 'Maluku', city: 'Kota Ambon' },
      distance: 9.166543652241515,
    };

    const { getByTestId } = render(<CardNearby mark={mark} />);

    const CardNearbyContainer = getByTestId('cardNearby');
    expect(CardNearbyContainer).toBeInTheDocument();
  });
});
