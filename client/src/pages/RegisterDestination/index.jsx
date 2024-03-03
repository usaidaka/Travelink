import Maps from '@components/Maps';
import { FormattedMessage } from 'react-intl';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { selectProvince } from '@pages/Home/selectors';
import { selectCurrentCityList } from '@pages/Trip/selectors';
import { getProvince } from '@pages/Home/actions';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import uploadImage from '@assets/uploadImage.png';
import encryptPayload from '@utils/encryptionHelper';
import Loader from '@components/Loader';
import { getCurrentCityList } from '@pages/Trip/actions';
import { doCreateDestination } from '@pages/Destination/actions';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';

// koading select province masih eerror

const RegisterDestination = ({ province, currentCity }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [valueSearch, setValueSearch] = useState(null);
  const [selectedCurrentProvince, setSelectedCurrentProvince] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [image, setImage] = useState(null);
  const uploadRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(searchResult);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    dispatch(
      getProvince(() => {
        setLoading(false);
      })
    );
  }, [dispatch]);

  const handleCurrentCityList = (provinceId) => {
    dispatch(getCurrentCityList(provinceId));
  };

  useEffect(() => {
    if (selectedCurrentProvince) {
      handleCurrentCityList(selectedCurrentProvince);
    }
  }, [selectedCurrentProvince]);

  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('file', image);
    const dataJSON = {
      province_id: data.province_id,
      city_id: data.city_id,
      phone: data.phone,
      detail: data.detail,
      latitude: String(searchResult.lat),
      longitude: String(searchResult.lng),
      description: data.description,
    };

    const encryptedData = encryptPayload(dataJSON);

    formData.append('encryptedData', encryptedData);
    dispatch(
      doCreateDestination(
        formData,
        (message) => {
          toast.success(message, { duration: 1000 });
          setLoading(false);
          setTimeout(() => {
            navigate('/admin/destination');
          }, 3000);
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

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <div data-testid="registerDestination" className={classes.container}>
      <div className={classes.navigation}>
        <Link to={-1}>
          <ArrowBackIcon />
        </Link>
        <h2>
          <FormattedMessage id="registerDestination" />
        </h2>
      </div>
      <div className={classes.maps}>
        <Maps
          element="RegisterDestination"
          zoom={4}
          marker={searchResult}
          setSearchResult={setSearchResult}
          isSearch
          valueSearch={valueSearch}
          setValueSearch={setValueSearch}
        />
      </div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.form}>
          <div className={classes.current}>
            <div className={classes['main-wrapper']}>
              <div className={classes.top}>
                <div className={classes['image-wrapper']}>
                  <input type="file" name="" id="" className={classes.upload} ref={uploadRef} onChange={handleFile} />
                  <div onClick={() => uploadRef.current.click()}>
                    <img src={showImage || uploadImage} alt="" className={classes.image} />
                  </div>
                </div>
                <div className={classes['short-input']}>
                  <div className={classes.wrapper}>
                    <label htmlFor="">
                      <FormattedMessage id="province" />
                    </label>
                    <select
                      name="province_id"
                      id="province_id"
                      className={classes.input}
                      {...register('province_id', {
                        required: 'Select province is a must',
                      })}
                      onChange={(e) => {
                        setSelectedCurrentProvince(e.target.value);
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
                    {errors.province_id && (
                      <span role="alert" className={classes['error-validation']}>
                        {errors.province_id.message}
                      </span>
                    )}
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
                        required: 'Select city_id is a must',
                      })}
                      aria-invalid={errors.city_id ? 'true' : 'false'}
                    >
                      <option value="" disabled>
                        <FormattedMessage id="choose" />
                      </option>
                      {currentCity.map((list) => (
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
                  <div className={classes.wrapper}>
                    <label htmlFor="">
                      <FormattedMessage id="phone" />
                    </label>
                    <input
                      type="text"
                      className={classes.input}
                      id="phone"
                      name="phone"
                      placeholder="0896524xxx"
                      {...register('phone', {
                        optional: 'phone is optional',
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
                      <FormattedMessage id="detail" />
                    </label>
                    <textarea
                      name=""
                      id=""
                      cols="30"
                      rows="10"
                      placeholder="The tourist area is located in the heart of the city, offering stunning views of the surrounding mountains and easy access to local attractions."
                      className={classes.textarea}
                      {...register('detail', {
                        required: 'Detail current address is a must',
                      })}
                      aria-invalid={errors.detail ? 'true' : 'false'}
                    />
                    {errors.detail && (
                      <span role="alert" className={classes['error-validation']}>
                        {errors.detail.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className={classes.region}>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <p>Latitude</p>
                  </label>
                  <input
                    type="text"
                    className={classes.input}
                    id="latitude"
                    name="latitude"
                    placeholder="-6.3048308711504335"
                    {...register('latitude', {
                      optional: 'latitude is optional',
                    })}
                    aria-invalid={errors.latitude ? 'true' : 'false'}
                  />
                  {errors.latitude && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.latitude.message}
                    </span>
                  )}
                </div>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <p>Longitude</p>
                  </label>
                  <input
                    type="text"
                    className={classes.input}
                    id="longitude"
                    name="longitude"
                    placeholder="106.85281762703461"
                    {...register('longitude', {
                      optional: 'longitude is optional',
                    })}
                    aria-invalid={errors.longitude ? 'true' : 'false'}
                  />
                  {errors.longitude && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.longitude.message}
                    </span>
                  )}
                </div>
              </div> */}
              <div className={classes.region}>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <FormattedMessage id="description" />
                  </label>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Explore the enchanting beauty of our serene tourist area, where lush greenery meets the crystal-clear waters of the river, offering a peaceful retreat for nature lovers. Experience the rich cultural heritage as you stroll through ancient temples and traditional villages, immersing yourself in the local way of life. Whether you seek adventure or tranquility, our tourist area promises an unforgettable experience for all."
                    className={classes.textarea}
                    {...register('description', {
                      required: 'description is a must',
                    })}
                    aria-invalid={errors.description ? 'true' : 'false'}
                  />
                  {errors.description && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={classes.button}>
            <Button size="small" type="submit" variant="contained" className={classes.submit}>
              <FormattedMessage id="submit" />
            </Button>
          </div>
        </div>
      </form>{' '}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

RegisterDestination.propTypes = {
  province: PropTypes.array,
  currentCity: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  province: selectProvince,
  currentCity: selectCurrentCityList,
});

export default connect(mapStateToProps)(RegisterDestination);
