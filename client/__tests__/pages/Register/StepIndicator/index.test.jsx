import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import StepIndication from '@pages/Register/components/StepIndication';

import store from '../../../../src/configureStore';

let render;

describe('StepIndication', () => {
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

  test('StepIndication Loading page is rendered', async () => {
    const { getByTestId } = render(<StepIndication />);

    const StepIndicationContainer = getByTestId('stepIndication');
    expect(StepIndicationContainer).toBeInTheDocument();
  });
});
