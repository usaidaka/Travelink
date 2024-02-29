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
import { Link, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import encryptPayload from '@utils/encryptionHelper';
import Carousel from 'react-material-ui-carousel';
import { getCurrentCityList } from '@pages/Trip/actions';
import toast, { Toaster } from 'react-hot-toast';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';

import classes from './style.module.scss';
import { doEditDestination, getDestinationById } from './actions';
import { selectDestinationById } from './selectors';

const EditDestination = ({ province, currentCity, destinationById }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCurrentProvince, setSelectedCurrentProvince] = useState('');
  const [loading, setLoading] = useState(false);

  const [showImage, setShowImage] = useState(null);
  const [image, setImage] = useState(null);
  const [decryptedDestinationById, setDecryptedDestinationById] = useState({});
  const uploadRef = useRef();

  const { destinationId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!_.isEmpty(destinationById)) {
      setDecryptedDestinationById(decryptPayload(destinationById));
    }
  }, [destinationById]);

  useEffect(() => {
    dispatch(
      getDestinationById(
        destinationId,
        () => {},
        () => {}
      )
    );
  }, [dispatch, destinationId]);

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
    console.log(data);
    formData.append('file', image);
    const dataJSON = {
      province_id: data.province_id,
      city_id: data.city_id,
      phone: data.phone,
      detail: data.detail,
      latitude: searchResult ? String(searchResult.lat) : decryptedDestinationById.latitude,
      longitude: searchResult ? String(searchResult.lng) : decryptedDestinationById.longitude,
      description: data.description,
    };

    const encryptedData = encryptPayload(dataJSON);

    formData.append('encryptedData', encryptedData);

    dispatch(
      doEditDestination(
        destinationId,
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

  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <Link to={-1}>
          <ArrowBackIcon />
        </Link>
        <h2>
          <FormattedMessage id="editDestination" />
        </h2>
      </div>
      <div className={classes.maps}>
        <Maps
          element="EditDestination"
          zoom={4}
          marker={decryptedDestinationById}
          setSearchResult={setSearchResult}
          isSearch
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
                    <Carousel>
                      {decryptedDestinationById?.ImageDestinations?.map((src, idx) => (
                        <img key={idx} src={showImage || src.image} alt="" className={classes.image} />
                      ))}
                    </Carousel>
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
                        optional: 'Select province is a must',
                      })}
                      value={decryptedDestinationById.province_id}
                      onChange={(e) => {
                        setSelectedCurrentProvince(e.target.value);
                        setDecryptedDestinationById((prev) => ({ ...prev, province_id: e.target.value }));
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
                        optional: 'Select city_id is a must',
                      })}
                      value={decryptedDestinationById.city_id}
                      onChange={(e) => setDecryptedDestinationById((prev) => ({ ...prev, city_id: e.target.value }))}
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
                        pattern: {
                          value: /^\d*$/,
                          message: 'Number only',
                        },
                      })}
                      value={decryptedDestinationById.phone}
                      onChange={(e) => setDecryptedDestinationById((prev) => ({ ...prev, phone: e.target.value }))}
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
                        optional: 'Detail current address is a must',
                      })}
                      value={decryptedDestinationById.detail}
                      onChange={(e) => setDecryptedDestinationById((prev) => ({ ...prev, detail: e.target.value }))}
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
                      optional: 'description is a optional',
                    })}
                    aria-invalid={errors.description ? 'true' : 'false'}
                    value={decryptedDestinationById.description}
                    onChange={(e) => setDecryptedDestinationById((prev) => ({ ...prev, description: e.target.value }))}
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
            <Button disabled={loading} size="small" type="submit" variant="contained" className={classes.submit}>
              <FormattedMessage id="submit" />
            </Button>
          </div>
        </div>
      </form>{' '}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

EditDestination.propTypes = {
  province: PropTypes.array,
  currentCity: PropTypes.array,
  destinationById: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  province: selectProvince,
  currentCity: selectCurrentCityList,
  destinationById: selectDestinationById,
});

export default connect(mapStateToProps)(EditDestination);
