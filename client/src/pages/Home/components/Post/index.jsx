// import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getCurrentCityList } from '@pages/Trip/actions';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Chip, Modal } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import PlaceIcon from '@mui/icons-material/Place';
import { selectCurrentCityList } from '@pages/Trip/selectors';

import classes from './style.module.scss';
import { doPost, getPost } from '../../actions';
import { selectPost, selectProvince } from '../../selectors';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Post = ({ province, city, fetch, next }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();
  const uploadRef = useRef();
  const [showImage, setShowImage] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [cityName, setCityName] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCurrentCityList = (provinceId) => {
    dispatch(getCurrentCityList(provinceId));
  };

  useEffect(() => {
    dispatch(getPost({ next, limit: 6 }));
  }, [dispatch, next]);

  useEffect(() => {
    if (selectedProvince) {
      handleCurrentCityList(selectedProvince);
    }
  }, [selectedProvince]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (!image) {
      return toast.error('Image is required', { duration: 1000 });
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('caption', data.caption);
    formData.append('province_id', data.province_id);
    formData.append('city_id', data.city_id);
    formData.append('location_name', data.location_name);
    setLoading(true);
    dispatch(
      doPost(
        formData,
        (message) => {
          toast.success(message, { duration: 1000 });
          reset();
          setShowImage(null);
          setImage(null);
          setProvinceName('');
          setCityName('');
          setLoading(false);
          dispatch(getPost());
          fetch([]);
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
    <>
      <div className={classes.header}>
        <form action="" className={classes['create-post']} onSubmit={handleSubmit(onSubmit)}>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            className={classes.text}
            placeholder="How was your traveling?"
            {...register('caption', {
              optional: 'caption is optional',
            })}
            aria-invalid={errors.caption ? 'true' : 'false'}
          />

          {showImage && (
            <div className={classes['preview-image']}>
              <img src={showImage} alt="" className={classes.image} />
              <div
                className={classes.cancel}
                onClick={() => {
                  if (loading) {
                    return;
                  }
                  setShowImage(null);
                  setImage(null);
                }}
              >
                <CloseIcon />
              </div>
            </div>
          )}
          {errors.image && (
            <span role="alert" className={classes['error-validation']}>
              {errors.image.message}
            </span>
          )}
          <div className={classes['upload-ref']}>
            <div className={classes.button}>
              <input
                type="file"
                name=""
                onChange={handleFile}
                id=""
                className={classes['input-image']}
                ref={uploadRef}
                aria-invalid={errors.image ? 'true' : 'false'}
              />
              <button
                type="button"
                className={classes.ref}
                onClick={() => {
                  uploadRef.current.click();
                }}
              >
                <ImageIcon />
              </button>
              <button onClick={handleOpen} type="button" className={classes.ref}>
                <PlaceIcon />
              </button>

              {cityName && (
                <div className={classes['tag-location']}>
                  <Chip label={cityName} />
                </div>
              )}
              {provinceName && (
                <div className={classes['tag-location']}>
                  <Chip label={provinceName} />
                </div>
              )}

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div className={classes.wrapper}>
                    <label htmlFor="">
                      <FormattedMessage id="location_name" />
                    </label>
                    <input
                      type="location_name"
                      className={classes.input}
                      id="location_name"
                      name="location_name"
                      placeholder="Coban Rondo"
                      {...register('location_name', {
                        optional: 'location_name is optional',
                      })}
                      aria-invalid={errors.location_name ? 'true' : 'false'}
                    />
                  </div>
                  <div className={classes.wrapper}>
                    <label htmlFor="">
                      <FormattedMessage id="province" />
                    </label>
                    <select
                      name="province_id"
                      id="province_id"
                      className={classes.input}
                      {...register('province_id', {
                        optional: 'Select province is optional',
                      })}
                      onChange={(e) => {
                        setSelectedProvince(e.target.value);
                        setProvinceName(e.target.options[e.target.selectedIndex].text);
                      }}
                      aria-invalid={errors.province_id ? 'true' : 'false'}
                    >
                      <option value="" disabled>
                        <FormattedMessage id="choose" />
                      </option>
                      {province.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={classes.wrapper}>
                    <label htmlFor="">
                      <FormattedMessage id="city" />
                    </label>
                    <select
                      name="city_id"
                      id="city_id"
                      className={classes.input}
                      {...register('city_id', {
                        optional: 'Select city is optional',
                      })}
                      aria-invalid={errors.city_id ? 'true' : 'false'}
                      onChange={(e) => setCityName(e.target.options[e.target.selectedIndex].text)}
                    >
                      <option value="" disabled>
                        <FormattedMessage id="choose" />
                      </option>
                      {city.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                    {errors.city_id && (
                      <span role="alert" className={classes['error-validation']}>
                        {errors.city_id.message}
                      </span>
                    )}
                  </div>
                  <Button onClick={handleClose}>
                    <FormattedMessage id="submit" />
                  </Button>
                </Box>
              </Modal>
            </div>

            <Button disabled={loading} size="small" variant="contained" type="submit" className={classes.submit}>
              <FormattedMessage id="send" />
            </Button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

Post.propTypes = {
  province: PropTypes.array,
  city: PropTypes.array,
  fetch: PropTypes.func,
  post: PropTypes.object,
  next: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  province: selectProvince,
  city: selectCurrentCityList,
  post: selectPost,
});

export default connect(mapStateToProps)(Post);
