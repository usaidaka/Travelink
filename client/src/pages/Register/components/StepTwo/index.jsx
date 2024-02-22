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
  const [decryptedData, setDecryptedData] = useState(decryptPayload(dataUser.encryptedData));

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataUser) {
      setDecryptedData(decryptPayload(dataUser.encryptedData));
    }
  }, [dataUser]);
  console.log(decryptedData);

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
              id="first_name"
              name="first_name"
              placeholder="John"
              {...register('first_name', {
                required: 'first name is required',
              })}
              aria-invalid={errors.first_name ? 'true' : 'false'}
              value={decryptedData?.first_name}
              onChange={(e) => setDecryptedData((prev) => ({ ...prev, first_name: e.target.value }))}
            />
            {errors.first_name && (
              <span role="alert" className={classes['error-validation']}>
                {errors.first_name.message}
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
              id="last_name"
              name="last_name"
              placeholder="Doe"
              {...register('last_name', {
                required: 'last name is required',
              })}
              aria-invalid={errors.last_name ? 'true' : 'false'}
              value={decryptedData?.last_name}
              onChange={(e) => setDecryptedData((prev) => ({ ...prev, last_name: e.target.value }))}
            />
            {errors.last_name && (
              <span role="alert" className={classes['error-validation']}>
                {errors.last_name.message}
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
              value={decryptedData?.gender}
              onChange={(e) => setDecryptedData((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="" disabled>
                <FormattedMessage id="choose" />
              </option>
              <option value="Male">
                <FormattedMessage id="male" />
              </option>
              <option value="Female">
                <FormattedMessage id="female" />
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
                value={decryptedData?.phone}
                onChange={(e) => setDecryptedData((prev) => ({ ...prev, phone: e.target.value }))}
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
                id="phone_contact"
                name="phone_contact"
                placeholder="08912341xxx"
                {...register('phone_contact', {
                  required: 'phone contact is required',
                })}
                aria-invalid={errors.phone_contact ? 'true' : 'false'}
                value={decryptedData?.phone_contact}
                onChange={(e) => setDecryptedData((prev) => ({ ...prev, phone_contact: e.target.value }))}
              />
              {errors.phone_contact && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.phone_contact.message}
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
              id="email_contact"
              name="email_contact"
              placeholder="email@gmail.com"
              {...register('email_contact', {
                required: 'phone contact is required',
              })}
              aria-invalid={errors.email_contact ? 'true' : 'false'}
              value={decryptedData?.email_contact}
              onChange={(e) => setDecryptedData((prev) => ({ ...prev, email_contact: e.target.value }))}
            />
            {errors.email_contact && (
              <span role="alert" className={classes['error-validation']}>
                {errors.email_contact.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes['button-render']}>
          <Button variant="outlined" size="small" onClick={() => onBackStep(step)}>
            <FormattedMessage id="back" />
          </Button>
          <Button type="submit" variant="contained" size="small">
            <FormattedMessage id="next" />
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
