import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import { useDispatch } from 'react-redux';
import { doForgotPassword } from '@pages/Login/actions';
import toast from 'react-hot-toast';

import classes from './style.module.scss';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  pr: 5,
  borderRadius: 2,
};

const ModalForgotPassword = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    const encryptedData = encryptPayload(data);
    setLoading(true);
    dispatch(
      doForgotPassword(
        { encryptedData },
        (message) => {
          toast.success(message, { duration: 1000 });
          setLoading(false);
          reset();
          setTimeout(() => {
            handleClose();
          }, 2000);
        },
        () => {
          setLoading(false);
        }
      )
    );
  };

  return (
    <div>
      <div onClick={handleOpen} className={classes.open}>
        <FormattedMessage id="forgotPassword" /> ?
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>
            <FormattedMessage id="forgotPassword" />
          </h3>

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
            <div className={classes.button}>
              <Button variant="contained" type="submit" size="small" disabled={loading} className={classes.submit}>
                <FormattedMessage id="send" />
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForgotPassword;
