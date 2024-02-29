import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { selectProfile } from '@pages/Home/selectors';
import { useEffect, useRef, useState } from 'react';
import decryptPayload from '@utils/decryptionHelper';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getProfile } from '@pages/Home/actions';
import encryptPayload from '@utils/encryptionHelper';

import classes from './style.module.scss';
import { doUpdateProfile } from './actions';

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

const Setting = ({ profile }) => {
  const [decryptedProfile, setDecryptedProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const uploadRef = useRef();

  useEffect(() => {
    setDecryptedProfile(decryptPayload(profile));
  }, [dispatch, profile]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();

    const dataJSON = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      mbti: data.mbti,
      phone: data.phone,
      phone_contact: data.phone_contact,
      email_contact: data.email_contact,
    };

    const encryptedData = encryptPayload(dataJSON);

    formData.append('encryptedData', encryptedData);
    image && formData.append('file', image);

    dispatch(
      doUpdateProfile(
        formData,
        (message) => {
          toast.success(message, { duration: 1000 });
          dispatch(getProfile());
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      )
    );
  };

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className={classes.container}>
      <input type="file" name="" id="" className={classes.upload} ref={uploadRef} onChange={handleFile} />
      <div className={classes['main-wrapper']}>
        <div
          className={classes['image-container']}
          onClick={() => {
            uploadRef.current.click();
          }}
        >
          <div className={classes['text-change']}>
            <h3>
              <FormattedMessage id="changePhoto" />
            </h3>
          </div>
          <img src={showImage || decryptedProfile.image} alt="" className={classes.image} />
        </div>
        <div className={classes.form}>
          <div className={classes.group}>
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
                  optional: 'username is optional',
                })}
                aria-invalid={errors.username ? 'true' : 'false'}
                onChange={(e) => setDecryptedProfile((prev) => ({ ...prev, username: e.target.value }))}
                value={decryptedProfile?.username}
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
                className={`${classes.input} + ' ' + ${classes.disabled}`}
                id="email"
                name="email"
                disabled
                aria-invalid={errors.email ? 'true' : 'false'}
                value={decryptedProfile?.email}
                onChange={(e) => setDecryptedProfile((prev) => ({ ...prev, email: e.target.value }))}
              />
              {errors.email && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <div className={classes.group}>
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
                  optional: 'first name is optional',
                })}
                aria-invalid={errors.first_name ? 'true' : 'false'}
                value={decryptedProfile?.UserDetail?.first_name}
                onChange={(e) =>
                  setDecryptedProfile((prev) => ({
                    ...prev,
                    UserDetail: {
                      ...prev.UserDetail,
                      first_name: e.target.value,
                    },
                  }))
                }
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
                  optional: 'last name is optional',
                })}
                aria-invalid={errors.last_name ? 'true' : 'false'}
                value={decryptedProfile?.UserDetail?.last_name}
                onChange={(e) =>
                  setDecryptedProfile((prev) => ({
                    ...prev,
                    UserDetail: {
                      ...prev.UserDetail,
                      last_name: e.target.value,
                    },
                  }))
                }
              />
              {errors.last_name && (
                <span role="alert" className={classes['error-validation']}>
                  {errors.last_name.message}
                </span>
              )}
            </div>
          </div>
          <div className={classes.group}>
            <div className={classes.wrapper}>
              <label htmlFor="">
                <FormattedMessage id="gender" />
              </label>
              <select
                className={classes.input}
                name="gender"
                placeholder="gender"
                {...register('gender', {
                  optional: 'Gender is optional',
                })}
                aria-invalid={errors.gender ? 'true' : 'false'}
                value={decryptedProfile?.UserDetail?.gender}
                onChange={(e) =>
                  setDecryptedProfile((prev) => ({
                    ...prev,
                    UserDetail: {
                      ...prev.UserDetail,
                      gender: e.target.value,
                    },
                  }))
                }
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
            <div className={classes.wrapper}>
              <label htmlFor="">
                <FormattedMessage id="personality" />
              </label>
              <select
                className={classes.input}
                name="mbti"
                placeholder="mbti"
                {...register('mbti', {
                  optional: 'mbti is optional',
                })}
                aria-invalid={errors.mbti ? 'true' : 'false'}
                value={decryptedProfile?.UserData?.mbti}
                onChange={(e) =>
                  setDecryptedProfile((prev) => ({
                    ...prev,
                    UserDetail: {
                      ...prev.UserDetail,
                      mbti: e.target.value,
                    },
                  }))
                }
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
          <div className={classes.group}>
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
                  optional: 'phone is optional',
                })}
                aria-invalid={errors.phone ? 'true' : 'false'}
                value={decryptedProfile?.UserDetail?.phone}
                onChange={(e) =>
                  setDecryptedProfile((prev) => ({
                    ...prev,
                    UserDetail: {
                      ...prev.UserDetail,
                      phone: e.target.value,
                    },
                  }))
                }
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
                  optional: 'phone contact is optional',
                })}
                aria-invalid={errors.phone_contact ? 'true' : 'false'}
                value={decryptedProfile?.UserDetail?.phone_contact}
                onChange={(e) =>
                  setDecryptedProfile((prev) => ({
                    ...prev,
                    UserDetail: {
                      ...prev.UserDetail,
                      phone_contact: e.target.value,
                    },
                  }))
                }
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
                optional: 'email contact is optional',
              })}
              aria-invalid={errors.email_contact ? 'true' : 'false'}
              value={decryptedProfile?.UserDetail?.email_contact}
              onChange={(e) =>
                setDecryptedProfile((prev) => ({
                  ...prev,
                  UserDetail: {
                    ...prev.UserDetail,
                    email_contact: e.target.value,
                  },
                }))
              }
            />
            {errors.email_contact && (
              <span role="alert" className={classes['error-validation']}>
                {errors.email_contact.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={classes['password-wrapper']}>
        <div className={classes.wrapper}>
          <label htmlFor="">
            <FormattedMessage id="password" />
          </label>
          <input value="password" type="password" className={`${classes.input} + " " + ${classes.disabled}`} />
        </div>
        <Link to="change-password" className={classes['change-password']}>
          <Button size="small" variant="contained" color="success">
            <EditIcon />
          </Button>
        </Link>
      </div>
      <div className={classes.submit}>
        <Button disabled={loading} type="submit" size="small" variant="contained">
          <FormattedMessage id="submit" />
        </Button>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </form>
  );
};

Setting.propTypes = {
  profile: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
});

export default connect(mapStateToProps)(Setting);
