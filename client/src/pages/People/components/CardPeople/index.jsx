import Maps from '@components/Maps';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import classes from './style.module.scss';

const CardPeople = ({ data, handleFollow }) => {
  const [marker, setMarker] = useState([]);
  const [isFollow, setIsFollow] = useState(data.Follow);

  useEffect(() => {
    setIsFollow(data.Follow);
  }, [data.Follow]);

  console.log(data);

  useEffect(() => {
    setMarker([
      {
        id: 1,
        position: [data?.Route?.current_latitude, data?.Route?.current_longitude],
        province: data?.Route?.current_province?.name,
        city: data?.Route?.current_city?.name,
        type: 'current',
      },
      {
        id: 2,
        position: [data?.Route?.direction_latitude, data?.Route?.direction_longitude],
        province: data?.Route?.direction_province?.name,
        city: data?.Route?.direction_city?.name,
        type: 'direction',
      },
    ]);
  }, [
    data?.Route?.current_city?.name,
    data?.Route?.current_latitude,
    data?.Route?.current_longitude,
    data?.Route?.current_province?.name,
    data?.Route?.direction_city?.name,
    data?.Route?.direction_latitude,
    data?.Route?.direction_longitude,
    data?.Route?.direction_province?.name,
  ]);

  console.log(data.Route);
  return (
    <div className={classes['card-people']}>
      <div className={classes['header-wrapper']}>
        <Link to={`/profile/${data.id}`} className={classes['image-container']}>
          <img src={data.image} alt="" className={classes.image} />
        </Link>
      </div>
      <div className={classes['info-container']}>
        <div className={classes.info}>
          <div className={classes['button-wrapper']}>
            {
              /* data.Follow */ !isFollow ? (
                <button
                  onClick={() => {
                    handleFollow(data.id);
                    setIsFollow(!isFollow);
                  }}
                  type="button"
                  className={classes.unfollow}
                >
                  <FormattedMessage id="unfollow" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFollow(data.id);
                    setIsFollow(!isFollow);
                  }}
                  type="button"
                  className={classes.follow}
                >
                  <FormattedMessage id="follow" />
                </button>
              )
            }
          </div>
          <div className={classes.data}>
            <span className={classes.username}>@{data.username}</span>
            <span className={classes.email}>
              <a href={`mailto: ${data.email}`}>{data.email && ` | ${data.email}`}</a>
            </span>
            <span className={classes.phone}>
              <a
                target="_blank"
                href={`https://api.whatsapp.com/send/?phone=${data?.UserDetail?.phone}&text=Hi!%20${data?.UserDetail?.firstName},%20I%20got%20your%20phone%20number%20from%20Travelink.&type=phone_number&app_absent=0`}
                rel="noreferrer"
              >
                {data?.UserDetail?.phone && ` | ${data.UserDetail?.phone}`}
              </a>
            </span>
          </div>
          {!_.isEmpty(data.Route) ? (
            <div className={classes.maps}>
              <Maps marker={marker} isSearch={false} zoom={3} element="People" />
            </div>
          ) : (
            <div className={classes.maps}>
              <Maps isSearch={false} zoom={9} element="UnRoute" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CardPeople.propTypes = {
  data: PropTypes.object,
  handleFollow: PropTypes.func,
};

export default CardPeople;
