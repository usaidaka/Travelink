import PropTypes from 'prop-types';
import Maps from '@components/Maps';
import _ from 'lodash';
import { Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const Header = ({ src, marker, profile, followerCount, followingCount, totalPost }) => {
  console.log(profile);
  return (
    <div className={classes['header-container']}>
      <div className={classes.header}>
        <div className={classes.backdrop}>
          <div className={classes.maps}>
            <Maps isSearch={false} element="Trip" marker={marker} zoom={6} center={marker[0]?.position} />
          </div>
        </div>

        <div className={classes['image-container']}>
          <img src={src} alt="" className={classes.image} />
        </div>
        <div className={classes.information}>
          <div className={classes.detail}>
            <div className={classes.data}>
              <span>{profile?.UserDetail?.first_name}</span> <span>{profile?.UserDetail?.last_name}</span>
              <p className={classes.username}>@{profile.username}</p>
              {!_.isEmpty(marker[0]?.city) && (
                <span className={classes.region}>
                  <Chip label={marker[0]?.city} size="small" color="success" sx={{ fontSize: 10 }} />
                </span>
              )}{' '}
              {!_.isEmpty(marker[0]?.province) && (
                <span className={classes.region}>
                  <Chip label={marker[0]?.province} size="small" color="warning" sx={{ fontSize: 10 }} />
                </span>
              )}
              <hr className={classes.divider} />
              <div className={classes.measure}>
                <div>
                  <p>Posts</p>
                  <p>{totalPost}</p>
                </div>
                <div>
                  <Link to="/">
                    <FormattedMessage id="follower" />
                    <p>{followerCount}</p>
                  </Link>
                </div>
                <div>
                  <Link to="/">
                    <FormattedMessage id="following" />
                    <p>{followingCount}</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  profile: PropTypes.object,
  src: PropTypes.string,
  marker: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  followerCount: PropTypes.number,
  followingCount: PropTypes.number,
  totalPost: PropTypes.number,
};

export default Header;
