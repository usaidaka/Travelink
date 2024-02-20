import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectStepPage, selectUserDataInput } from '@pages/Register/selectors';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import { getUserDataInput, setUserDataInput } from '@pages/Register/actions';

import classes from './style.module.scss';

const StepOne = ({ step, onNextStep, dataUser }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  console.log(step);
  console.log(dataUser);

  useEffect(() => {
    dispatch(getUserDataInput());
  }, [dispatch]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    const encryptedData = encryptPayload(data);
    console.log(encryptedData);
    console.log(data);
    dispatch(setUserDataInput({ encryptedData }));
    onNextStep(step);
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.container}>
        <h3>
          <FormattedMessage id="register" />
        </h3>
        <div className={classes.form}>
          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="username" />
            </label>
            <input
              type="text"
              className={classes.input}
              id="username"
              name="username"
              placeholder="username"
              {...register('username', {
                required: 'username is required',
              })}
              aria-invalid={errors.username ? 'true' : 'false'}
            />
            {errors.username && (
              <span role="alert" className={classes['error-validation']}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="email" />
            </label>
            <input
              type="email"
              className={classes.input}
              id="email"
              name="email"
              placeholder="email@gmail.com"
              {...register('email', {
                required: 'email is required',
              })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <span role="alert" className={classes['error-validation']}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="password" />
            </label>

            <div className={classes.password}>
              <input
                type={visible ? 'text' : 'password'}
                className={classes.input}
                id="password"
                name="password"
                placeholder="••••••••••"
                {...register('password', {
                  required: 'password is required',
                })}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <div className={classes.visible} onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon className={classes.icon} /> : <VisibilityIcon className={classes.icon} />}
              </div>
              {errors.password && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="confirmPassword" />
            </label>

            <div className={classes.password}>
              <input
                type="password"
                className={classes.input}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••••"
                {...register('confirmPassword', {
                  required: 'confirm password is required',
                })}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes['button-render']}>
          <div className={classes.login}>
            <p>
              <FormattedMessage id="haveAccount" /> ?
            </p>
            <span>
              <Link to="/login">
                <FormattedMessage id="clickHere" />
              </Link>
            </span>
          </div>
          <Button type="submit" variant="contained" size="small">
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

StepOne.propTypes = {
  step: PropTypes.number,
  onNextStep: PropTypes.func,
  dataUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  step: selectStepPage,
  dataUser: selectUserDataInput,
});

export default connect(mapStateToProps)(StepOne);
