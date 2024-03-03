import CardAuth from '@components/CardAuth';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';
import resetDecoration from '@assets/resetDecoration.jpg';
import { useState } from 'react';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import { useDispatch } from 'react-redux';

import classes from './style.module.scss';
import { doResetPassword } from './actions';

const ResetPassword = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetToken } = useParams();

  console.log(resetToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    const encryptedData = encryptPayload(data);

    dispatch(
      doResetPassword({ encryptedData }, resetToken, () => {
        setLoading(true);
        setTimeout(() => navigate('/login'), 3000);
      })
    );
  };

  return (
    <div data-testid="resetPassword" className={classes.container}>
      <CardAuth src={resetDecoration}>
        <form action="" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="otp" />
            </label>
            <input
              type="text"
              className={classes.input}
              id="otp"
              name="otp"
              placeholder="B31xxx"
              {...register('otp', {
                required: 'otp is required',
              })}
              aria-invalid={errors.otp ? 'true' : 'false'}
            />
            {errors.otp && (
              <span role="alert" className={classes['error-validation']}>
                {errors.otp.message}
              </span>
            )}
          </div>

          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="newPassword" />
            </label>

            <div className={classes.password}>
              <input
                type={visible ? 'text' : 'password'}
                className={classes.input}
                id="newPassword"
                name="newPassword"
                placeholder="••••••••••"
                {...register('newPassword', {
                  required: 'newPassword is required',
                })}
                aria-invalid={errors.newPassword ? 'true' : 'false'}
              />
              <div className={classes.visible} onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon className={classes.icon} /> : <VisibilityIcon className={classes.icon} />}
              </div>
              {errors.newPassword && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.newPassword.message}
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
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="••••••••••"
                {...register('confirmNewPassword', {
                  required: 'confirmNewPassword is required',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match',
                })}
                aria-invalid={errors.confirmNewPassword ? 'true' : 'false'}
              />
              {errors.confirmNewPassword && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>
          </div>
          <Button variant="contained" type="submit" disabled={loading} className={classes.submit}>
            <FormattedMessage id="resetPassword" />
          </Button>
        </form>
        <div className={classes.remember}>
          <p>
            <FormattedMessage id="rememberingPassword" /> ?
          </p>
          <span>
            <Link to="/login">
              <FormattedMessage id="login" />
            </Link>
          </span>
        </div>
      </CardAuth>
    </div>
  );
};

export default ResetPassword;
