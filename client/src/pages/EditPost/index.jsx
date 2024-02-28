import { connect, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { getCurrentCityList } from '@pages/Trip/actions';
import Loader from '@components/Loader';
import { selectProvince } from '@pages/Home/selectors';
import { selectCurrentCityList } from '@pages/Trip/selectors';

import classes from './style.module.scss';
import { getPostDetail } from './actions';
import { selectPostDetail } from './selectors';

const EditPost = ({ province, city, postDetail }) => {
  const [render, setRender] = useState(true);
  const { postId } = useParams();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [cityName, setCityName] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [postDetailData, setPostDetailData] = useState({});

  const dispatch = useDispatch();

  console.log(cityName);
  console.log(provinceName);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleCurrentCityList = (provinceId) => {
    dispatch(getCurrentCityList(provinceId));
  };
  useEffect(() => {
    if (selectedProvince) {
      handleCurrentCityList(selectedProvince);
    }
    if (postDetail) {
      setPostDetailData(postDetail);
    }
  }, [selectedProvince]);

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    dispatch(
      getPostDetail(postId, () => {
        setRender(false);
      })
    );
  }, [dispatch, postId]);
  console.log(postDetailData);
  if (render) {
    return <Loader isLoading={render} />;
  }

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className={classes.container}>
      <div className={classes['main-wrapper']}>
        <div className={classes['image-container']}>
          <div className={classes.carousel}>
            <Carousel>
              {postDetail?.ImagePosts?.map((item, i) => (
                <img key={i} alt="" src={item.image} className={classes.image} />
              ))}
            </Carousel>
          </div>
        </div>
        <div className={classes.form}>
          <div className={classes.wrapper}>
            <label htmlFor="">
              <FormattedMessage id="caption" />
            </label>
            <textarea
              type="text"
              className={classes.text}
              id="caption"
              name="caption"
              placeholder="caption"
              {...register('caption', {
                optional: 'caption is optional',
              })}
              aria-invalid={errors.caption ? 'true' : 'false'}
              onChange={(e) => setPostDetailData((prev) => ({ ...prev, caption: e.target.value }))}
              value={postDetailData?.caption}
            />
            {errors.caption && (
              <span role="alert" className={classes['error-validation']}>
                {errors.caption.message}
              </span>
            )}
          </div>

          <div className={classes.group}>
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
                  setProvinceName(e.target.options[e.target.selectedIndex].text);
                  setSelectedProvince(e.target.value);
                  setPostDetailData((prev) => ({
                    ...prev,
                    Province: { ...prev.Province, id: e.target.value },
                  }));
                }}
                value={postDetailData.Province?.id}
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
                onChange={(e) => {
                  setPostDetailData((prev) => ({
                    ...prev,
                    City: { ...prev.City, id: e.target.value },
                  }));
                  setCityName(e.target.options[e.target.selectedIndex].text);
                }}
                value={postDetailData.Province?.id}
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
            </div>
          </div>

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
              onChange={(e) => setPostDetailData((prev) => ({ ...prev, location_name: e.target.value }))}
              value={postDetailData?.location_name}
              aria-invalid={errors.location_name ? 'true' : 'false'}
            />
          </div>
        </div>
      </div>

      <div className={classes.submit}>
        <Button type="submit" size="small" variant="contained">
          <FormattedMessage id="submit" />
        </Button>
      </div>
    </form>
  );
};

EditPost.propTypes = { city: PropTypes.array, postDetail: PropTypes.object, province: PropTypes.array };

const mapStateToProps = createStructuredSelector({
  city: selectCurrentCityList,
  province: selectProvince,
  postDetail: selectPostDetail,
});

export default connect(mapStateToProps)(EditPost);