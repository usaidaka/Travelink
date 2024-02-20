import { createStructuredSelector } from 'reselect';
import CardAuth from '@components/CardAuth';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import registerDecoration from '@assets/registerDecoration.jpg';

import { setStepPage } from './actions';
import classes from './style.module.scss';
import StepIndicator from './components/StepIndication';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import { selectStepPage, selectUserDataInput } from './selectors';

const Register = ({ step }) => {
  const dispatch = useDispatch();

  const onNextStep = (stepPage) => {
    if (step >= 3) {
      dispatch(setStepPage(stepPage));
    } else {
      dispatch(setStepPage(stepPage + 1));
    }
  };

  const onBackStep = (stepPage) => {
    if (step <= 1) {
      dispatch(setStepPage(stepPage));
    } else {
      dispatch(setStepPage(stepPage - 1));
    }
  };

  const renderComponent = () => {
    switch (step) {
      case 1:
        return <StepOne onNextStep={onNextStep} />;

      case 2:
        return <StepTwo onNextStep={onNextStep} onBackStep={onBackStep} />;

      case 3:
        return <StepThree onBackStep={onBackStep} />;

      default:
        return <StepOne onNextStep={onNextStep} />;
    }
  };

  return (
    <div className={classes.container}>
      <CardAuth src={registerDecoration}>
        <div>
          <StepIndicator />
        </div>
        {renderComponent()}
      </CardAuth>
    </div>
  );
};

Register.propTypes = {
  data: PropTypes.object,
  step: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  data: selectUserDataInput,
  step: selectStepPage,
});

export default connect(mapStateToProps)(Register);
