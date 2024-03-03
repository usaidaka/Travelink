import Maps from '@components/Maps';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';

import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import encryptPayload from '@utils/encryptionHelper';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { selectProvince } from '@pages/Home/selectors';

import classes from './style.module.scss';
import { selectCurrentCityList, selectDirectionCityList, selectUserRoute } from './selectors';
import { doRoute, getCurrentCityList, getDirectionCityList, getUserRoute } from './actions';

const Trip = ({ location, province, currentCity, directionCity }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [myRoute, setMyRoute] = useState({});
  const [selectedCurrentProvince, setSelectedCurrentProvince] = useState('');
  const [selectedDirectionProvince, setSelectedDirectionProvince] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState([]);

  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  useEffect(() => {
    if (!_.isEmpty(myRoute)) {
      setMarker([
        {
          id: 1,
          position: [myRoute?.current_latitude, myRoute?.current_longitude],
          province: myRoute?.current_province?.name,
          city: myRoute?.current_city?.name,
          type: 'current',
        },
        {
          id: 2,
          position: [myRoute?.direction_latitude, myRoute?.direction_longitude],
          province: myRoute?.direction_province?.name,
          city: myRoute?.direction_city?.name,
          type: 'direction',
        },
      ]);
    }
  }, [myRoute]);

  useEffect(() => {
    if (!_.isEmpty(myRoute)) {
      setValue('current_province_id', myRoute.current_province_id || '');
      setValue('current_city_id', myRoute.current_city_id || '');
      setValue('current_detail', myRoute.current_detail || '');
      setValue('direction_province_id', myRoute.direction_province_id || '');
      setValue('direction_city_id', myRoute.direction_city_id || '');
      setValue('direction_detail', myRoute.direction_detail || '');
    }
  }, [myRoute, setValue]);

  const watchID = navigator.geolocation?.watchPosition((position) => {
    setCurrentLatitude(position?.coords?.latitude);
    setCurrentLongitude(position?.coords?.longitude);
  });

  useEffect(() => {
    if (!_.isEmpty(location)) {
      setMyRoute(decryptPayload(location));
    }
  }, [location]);

  const handleCurrentCityList = (provinceId) => {
    dispatch(getCurrentCityList(provinceId));
  };

  const handleDirectionCityList = (provinceId) => {
    dispatch(getDirectionCityList(provinceId));
  };

  useEffect(() => {
    if (selectedCurrentProvince) {
      handleCurrentCityList(selectedCurrentProvince);
    }
  }, [selectedCurrentProvince]);

  useEffect(() => {
    if (selectedDirectionProvince) {
      handleDirectionCityList(selectedDirectionProvince);
    }
  }, [selectedDirectionProvince]);

  const onSubmit = (data) => {
    console.log(searchResult);
    data.current_latitude = currentLatitude || myRoute.current_latitude;
    data.current_longitude = currentLongitude || myRoute.current_longitude;
    data.direction_latitude = searchResult.lat || myRoute.direction_latitude;
    data.direction_longitude = searchResult.lng || myRoute.direction_longitude;

    const encryptedData = encryptPayload(data);

    dispatch(
      doRoute({ encryptedData }, (message) => {
        toast.success(message, { duration: 2000 });
        setLoading(true);
        dispatch(getUserRoute());
        setTimeout(() => {
          setLoading(false);
        }, 4000);
      })
    );
  };

  console.log(marker);
  return (
    <div data-testid="trip" className={classes.container}>
      <h1>Trip</h1>
      <div className={classes.maps}>
        <Maps
          element="Trip"
          marker={marker}
          setSearchResult={setSearchResult}
          zoom={4}
          center={[-4.0743014592420055, 119.73651081035104]}
        />
      </div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.form}>
          <div className={classes.current}>
            <div className={classes.header}>
              <h3>
                <FormattedMessage id="current_location" />
              </h3>
              <div onClick={() => watchID()} className={classes['my-location']}>
                <MyLocationIcon />
              </div>
            </div>
            <div className={classes['main-wrapper']}>
              <div className={classes.region}>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <FormattedMessage id="current_province" />
                  </label>
                  <select
                    name="current_province_id"
                    id="current_province_id"
                    className={classes.input}
                    {...register('current_province_id', {
                      required: 'Select province is a must',
                    })}
                    onChange={(e) => {
                      setSelectedCurrentProvince(e.target.value);
                      setMyRoute((prev) => ({ ...prev, current_province_id: e.target.value }));
                    }}
                    aria-invalid={errors.current_province_id ? 'true' : 'false'}
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
                  {errors.current_province_id && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.current_province_id.message}
                    </span>
                  )}
                </div>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <FormattedMessage id="current_city" />
                  </label>
                  <select
                    name="current_city_id"
                    id="current_city_id"
                    className={classes.input}
                    {...register('current_city_id', {
                      required: 'Select city is a must',
                    })}
                    aria-invalid={errors.current_city_id ? 'true' : 'false'}
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
                  {errors.current_city_id && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.current_city_id.message}
                    </span>
                  )}
                </div>
              </div>
              <div className={classes.wrapper}>
                <label htmlFor="">
                  <FormattedMessage id="current_detail" />
                </label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  className={classes.textarea}
                  {...register('current_detail', {
                    required: 'Detail current address is a must',
                  })}
                  aria-invalid={errors.current_detail ? 'true' : 'false'}
                />
                {errors.current_detail && (
                  <span role="alert" className={classes['error-validation']}>
                    {errors.current_detail.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={classes.direction}>
            <div className={classes.header}>
              <h3>
                <FormattedMessage id="direction_location" />
              </h3>
              <div onClick={() => watchID()} className={classes['my-location']}>
                <MyLocationIcon />
              </div>
            </div>
            <div className={classes['main-wrapper']}>
              <div className={classes.region}>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <FormattedMessage id="direction_province" />
                  </label>
                  <select
                    name="direction_province_id"
                    id="direction_province_id"
                    onClick={(e) => {
                      setSelectedDirectionProvince(e.target.value);
                      setMyRoute((prev) => ({ ...prev, direction_province_id: e.target.value }));
                    }}
                    className={classes.input}
                    {...register('direction_province_id', {
                      required: 'Select province is a must',
                    })}
                    aria-invalid={errors.direction_province_id ? 'true' : 'false'}
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
                  {errors.direction_province_id && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.direction_province_id.message}
                    </span>
                  )}
                </div>
                <div className={classes.wrapper}>
                  <label htmlFor="">
                    <FormattedMessage id="direction_city" />
                  </label>
                  <select
                    name="direction_city_id"
                    id="direction_city_id"
                    className={classes.input}
                    {...register('direction_city_id', {
                      required: 'Select city is a must',
                    })}
                    aria-invalid={errors.direction_city_id ? 'true' : 'false'}
                  >
                    <option value="" disabled>
                      <FormattedMessage id="choose" />
                    </option>
                    {directionCity.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                  {errors.direction_city_id && (
                    <span role="alert" className={classes['error-validation']}>
                      {errors.direction_city_id.message}
                    </span>
                  )}
                </div>
              </div>
              <div className={classes.wrapper}>
                <label htmlFor="">
                  <FormattedMessage id="direction_detail" />
                </label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  className={classes.textarea}
                  {...register('direction_detail', {
                    required: 'Detail current address is a must',
                  })}
                  aria-invalid={errors.direction_detail ? 'true' : 'false'}
                />
                {errors.direction_detail && (
                  <span role="alert" className={classes['error-validation']}>
                    {errors.direction_detail.message}
                  </span>
                )}
              </div>
              <span className={classes.note}>test</span>
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
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

Trip.propTypes = {
  location: PropTypes.string,
  province: PropTypes.array,
  currentCity: PropTypes.array,
  directionCity: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  location: selectUserRoute,
  province: selectProvince,
  currentCity: selectCurrentCityList,
  directionCity: selectDirectionCityList,
});

export default connect(mapStateToProps)(Trip);
