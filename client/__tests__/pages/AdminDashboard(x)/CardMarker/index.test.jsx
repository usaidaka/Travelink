import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import CardMarker from '@pages/AdminDashboard/components/CardMarker';

import store from '../../../../src/configureStore';

let render;

describe('CardMarker', () => {
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

  test('CardMarker page is rendered', async () => {
    const mark = {
      image: 'www.goole.com',
      username: 'Aka',
      email: 'aka@gmail.com',
      phone: '01214323132',
      city: 'Jakarta',
      province: 'DKI Jakarta',
    };

    const { getByTestId } = render(<CardMarker mark={mark} />);

    const CardMarkerContainer = getByTestId('cardMarker');
    expect(CardMarkerContainer).toBeInTheDocument();
  });
});
