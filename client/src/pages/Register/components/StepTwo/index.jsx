import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectStepPage, selectUserDataInput } from '@pages/Register/selectors';
import { connect, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import { useEffect, useState } from 'react';
import decryptPayload from '@utils/decryptionHelper';
import { setUserDataInput } from '@pages/Register/actions';

import classes from './style.module.scss';

const StepTwo = ({ step, onBackStep, onNextStep, dataUser }) => {
  const [decryptedData, setDecryptedData] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataUser) {
      setDecryptedData(decryptPayload(dataUser.encryptedData));
    }
  }, [dataUser]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    const mergedData = { ...decryptedData, ...data };
    const encryptedData = encryptPayload(mergedData);
    dispatch(setUserDataInput({ encryptedData }));
    onNextStep(step);
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.container}>
        <div action="" className={classes.form}>
          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="firstName" />
            </label>
            <input
              type="text"
              className={classes.input}
              id="firstName"
              name="firstName"
              placeholder="John"
              {...register('firstName', {
                required: 'first name is required',
              })}
              aria-invalid={errors.firstName ? 'true' : 'false'}
            />
            {errors.firstName && (
              <span role="alert" className={classes['error-validation']}>
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="lastName" />
            </label>
            <input
              type="text"
              className={classes.input}
              id="lastName"
              name="lastName"
              placeholder="Doe"
              {...register('lastName', {
                required: 'last name is required',
              })}
              aria-invalid={errors.lastName ? 'true' : 'false'}
            />
            {errors.lastName && (
              <span role="alert" className={classes['error-validation']}>
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="gender" />
            </label>
            <select
              className={classes.input}
              name="gender"
              placeholder="gender"
              {...register('gender', {
                required: 'Gender is required',
              })}
              aria-invalid={errors.gender ? 'true' : 'false'}
            >
              <option value="" disabled>
                <FormattedMessage id="choose" />
              </option>
              <option value="Male">
                <FormattedMessage id="male" />
              </option>
              <option value="Female">
                <FormattedMessage id="Female" />
              </option>
            </select>
            {errors.gender && (
              <span role="alert" className={classes['error-validation']}>
                {errors.gender.message}
              </span>
            )}
          </div>

          <div className={classes['main-wrapper']}>
            <div className={classes.wrapper}>
              <label htmlFor="">
                <FormattedMessage id="phone" />
              </label>
              <input
                type="text"
                className={classes.input}
                id="phone"
                name="phone"
                placeholder="08912341xxx"
                {...register('phone', {
                  required: 'phone is required',
                })}
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
              {errors.phone && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className={classes.wrapper}>
              <label htmlFor="">
                <FormattedMessage id="phoneContact" />
              </label>
              <input
                type="text"
                className={classes.input}
                id="phoneContact"
                name="phoneContact"
                placeholder="08912341xxx"
                {...register('phoneContact', {
                  required: 'phone contact is required',
                })}
                aria-invalid={errors.phoneContact ? 'true' : 'false'}
              />
              {errors.phoneContact && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.phoneContact.message}
                </span>
              )}
            </div>
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="emailContact" />
            </label>
            <input
              type="email"
              className={classes.input}
              id="emailContact"
              name="emailContact"
              placeholder="email@gmail.com"
              {...register('emailContact', {
                required: 'phone contact is required',
              })}
              aria-invalid={errors.emailContact ? 'true' : 'false'}
            />
            {errors.emailContact && (
              <span role="alert" className={classes['error-validation']}>
                {errors.emailContact.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes['button-render']}>
          <Button variant="outlined" size="small" onClick={() => onBackStep(step)}>
            Back
          </Button>
          <Button type="submit" variant="contained" size="small">
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

StepTwo.propTypes = {
  step: PropTypes.number,
  onNextStep: PropTypes.func,
  onBackStep: PropTypes.func,
  dataUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  step: selectStepPage,
  dataUser: selectUserDataInput,
});

export default connect(mapStateToProps)(StepTwo);
