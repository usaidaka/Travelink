import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormattedMessage } from 'react-intl';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import encryptPayload from '@utils/encryptionHelper';
import { logout } from '@utils/logout';

import classes from './style.module.scss';
import { doChangePassword } from './actions';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(true);
  const [visibilityNew, setVisibilityNew] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    const encryptedData = encryptPayload(data);
    dispatch(
      doChangePassword({ encryptedData }, (message) => {
        toast.success(message, { duration: 1000 });
        setLoading(true);
        setTimeout(() => {
          logout(dispatch, navigate);
        }, 3000);
      })
    );
  };
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Link to={-1}>
          <ArrowBackIcon />
        </Link>
        <h2>
          <FormattedMessage id="changePassword" />
        </h2>
      </div>
      <form action="" onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.wrapper}>
          <label htmlFor="">
            <FormattedMessage id="password" />
          </label>
          <div className={classes['input-password']}>
            <input
              type={visibility ? 'password' : 'text'}
              id="password"
              name="password"
              placeholder="password"
              {...register('password', {
                required: 'New password is required',
              })}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <div onClick={() => setVisibility(!visibility)} className={classes.visibility}>
              {visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>
          {errors.password && (
            <span role="alert" className={classes['error-validation']}>
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className={classes.wrapper}>
          <label htmlFor="">
            <FormattedMessage id="newPassword" />
          </label>
          <div className={classes['input-password']}>
            <input
              type={visibilityNew ? 'password' : 'text'}
              id="newPassword"
              name="newPassword"
              placeholder="new password"
              {...register('newPassword', {
                required: 'New password is required',
              })}
              aria-invalid={errors.newPassword ? 'true' : 'false'}
            />
            <div onClick={() => setVisibilityNew(!visibilityNew)} className={classes.visibility}>
              {visibilityNew ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>
          {errors.newPassword && (
            <span role="alert" className={classes['error-validation']}>
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className={classes.wrapper}>
          <label htmlFor="">
            <FormattedMessage id="confirmPassword" />
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="confirm password"
            {...register('confirmPassword', {
              required: 'confirmPassword is required',
              validate: (value) => value === watch('newPassword') || 'Passwords do not match',
            })}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          />
          {errors.confirmPassword && (
            <span role="alert" className={classes['error-validation']}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button variant="contained" type="submit" disabled={loading} size="small">
          Submit
        </Button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ChangePassword;
