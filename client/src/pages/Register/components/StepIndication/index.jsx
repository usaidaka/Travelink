import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectStepPage } from '@pages/Register/selectors';

import classes from './style.module.scss';

const StepIndicator = ({ step }) => {
  console.log(typeof step);
  return (
    <div className={classes.container}>
      <div className={classes.indicator} data-active={step === 1}>
        1
      </div>
      <div className={classes.indicator} data-active={step === 2}>
        2
      </div>
      <div className={classes.indicator} data-active={step === 3}>
        3
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  step: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  step: selectStepPage,
});

export default connect(mapStateToProps)(StepIndicator);
