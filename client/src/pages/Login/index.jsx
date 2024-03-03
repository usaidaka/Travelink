import { useState } from 'react';
import CardAuth from '@components/CardAuth';
import loginDecoration from '@assets/loginDecoration.jpg';
import { FormattedMessage } from 'react-intl';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';
import ModalForgotPassword from './components/ModalForgotPassword';
import { doLogin } from './actions';

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    const encryptedData = encryptPayload(data);

    dispatch(
      doLogin({ encryptedData }, (role, message) => {
        toast.success(message, { duration: 1000 });
        setLoading(true);
        if (role === 'Super' || role === 'Admin') {
          setTimeout(() => navigate('/admin/dashboard'), 2000);
        } else {
          setTimeout(() => navigate('/home'), 2000);
        }
      })
    );
  };

  return (
    <div data-testid="login" className={classes.container}>
      <CardAuth src={loginDecoration}>
        <form action="" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="email" />
            </label>
            <input
              type="email"
              className={classes.input}
              id="email"
              name="email"
              placeholder="email"
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
                placeholder="password"
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
          <Button variant="contained" type="submit" disabled={loading} className={classes.submit}>
            <FormattedMessage id="login" />
          </Button>
        </form>
        <div>
          <ModalForgotPassword />
        </div>
        <div className={classes.register}>
          <p>
            <FormattedMessage id="dontHaveAccount" /> ?
          </p>
          <span>
            <Link to="/register">
              <FormattedMessage id="clickHere" />
            </Link>
          </span>
        </div>
      </CardAuth>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Login;
