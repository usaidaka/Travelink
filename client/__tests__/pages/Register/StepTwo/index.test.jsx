import { render as RtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Language from '@containers/Language';
import StepTwo from '@pages/Register/components/StepTwo';

import store from '../../../../src/configureStore';

let render;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => (action) => action),
}));

jest.mock('@assets/registerDecoration.jpg', () => ({
  ...jest.requireActual(`../../fixtures/assets/logo.png`),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

describe('StepTwo', () => {
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

  test('StepTwo Loading page is rendered', async () => {
    // Mock the useForm hook return value
    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    }));

    // eslint-disable-next-line global-require
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(mockUseForm);

    const { getByTestId } = render(<StepTwo />);

    const StepTwoContainer = getByTestId('stepTwo');
    expect(StepTwoContainer).toBeInTheDocument();
  });
});
