import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectStepPage, selectUserDataInput } from '@pages/Register/selectors';
import { connect, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import mbti from '@assets/mbti.png';
import decryptPayload from '@utils/decryptionHelper';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import { setUserDataInput } from '@pages/Register/actions';

import classes from './style.module.scss';

const mbtiPersonality = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

const StepThree = ({ step, onBackStep, dataUser }) => {
  const [decryptedData, setDecryptedData] = useState({});
  const [isFinish, setIsFinish] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setDecryptedData(decryptPayload(dataUser.encryptedData));
  }, [dataUser.encryptedData]);

  console.log(decryptedData);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    const mergedData = { ...decryptedData, ...data };
    const encryptedData = encryptPayload(mergedData);
    console.log(encryptedData);
    console.log(decryptPayload(encryptedData));
    dispatch(setUserDataInput({ encryptedData }));
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.container}>
        <div className={classes.decoration}>
          <h3 className={classes.title}>Myers-Briggs Type Indicator</h3>
          <img src={mbti} alt="" className={classes.image} />
          <p className={classes.description}>
            <FormattedMessage id="mbtiDescription" />
          </p>

          <p className={classes.redirect}>
            <a target="_blank" href="https://www.16personalities.com/free-personality-test" rel="noreferrer">
              <FormattedMessage id="clickHere" />
            </a>
            ,{' '}
            <span>
              <FormattedMessage id="mbtiTest" />
            </span>
          </p>
        </div>
        <div>
          <div action="" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.wrapper}>
              <label htmlFor="">
                <FormattedMessage id="personality" />
              </label>
              <select
                className={classes.input}
                name="mbti"
                placeholder="mbti"
                {...register('mbti', {
                  required: 'mbti is required',
                })}
                aria-invalid={errors.mbti ? 'true' : 'false'}
              >
                <option value="" disabled>
                  <FormattedMessage id="choose" />
                </option>
                {mbtiPersonality.map((personality, idx) => (
                  <option key={idx} value={personality}>
                    {personality}
                  </option>
                ))}
              </select>
              {errors.mbti && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.mbti.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={classes.confirmation}>
          <input type="checkbox" name="" id="" onClick={() => setIsFinish(!isFinish)} />
          <p>
            <FormattedMessage id="finishConfirmation" />
          </p>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes['button-render']}>
          <Button variant="outlined" size="small" onClick={() => onBackStep(step)}>
            Back
          </Button>
          <Button disabled={isFinish || loading} type="submit" variant="contained" color="success" size="small">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

StepThree.propTypes = {
  step: PropTypes.number,
  onBackStep: PropTypes.func,
  dataUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  step: selectStepPage,
  dataUser: selectUserDataInput,
});

export default connect(mapStateToProps)(StepThree);
