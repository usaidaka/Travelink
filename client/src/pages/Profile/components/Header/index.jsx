import PropTypes from 'prop-types';
import Maps from '@components/Maps';
import _ from 'lodash';
import { Chip, Modal } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { useState } from 'react';

import classes from './style.module.scss';
import CardFollowing from '../CardFollowing';
import CardFollower from '../CardFollower';

const Header = ({ follow, src, marker, profile, totalPost, handleFollow, handleDeleteFollower }) => {
  const { pathname } = useLocation();

  const [openFollowing, setOpenFollowing] = useState(false);
  const handleOpenFollowing = () => setOpenFollowing(true);
  const handleCloseFollowing = () => setOpenFollowing(false);

  const [openFollower, setOpenFollower] = useState(false);
  const handleOpenFollower = () => setOpenFollower(true);
  const handleCloseFollower = () => setOpenFollower(false);

  return (
    <div className={classes['header-container']}>
      <div className={classes.header}>
        <div className={classes.backdrop}>
          <div className={classes.maps}>
            <Maps isSearch={false} element="Trip" marker={marker} zoom={4} center={marker[0]?.position} />
          </div>
        </div>

        <div className={classes['image-container']}>
          <img src={src} alt="" className={classes.image} />
        </div>
        <div className={classes['footer-header']}>
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
                    <div className={classes.follow} onClick={handleOpenFollower}>
                      <FormattedMessage id="follower" />
                      <p>{follow?.follower?.length}</p>
                    </div>
                    <Modal
                      open={openFollower}
                      onClose={handleCloseFollower}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <div className={classes.modal}>
                        <h1>
                          <FormattedMessage id="follower" />
                        </h1>
                        <div>
                          {!_.isEmpty(follow.follower) &&
                            follow.follower.map((followTo, idx) => (
                              <CardFollower handleDeleteFollower={handleDeleteFollower} key={idx} follow={followTo} />
                            ))}
                        </div>
                      </div>
                    </Modal>
                  </div>
                  <div>
                    <div className={classes.follow} onClick={handleOpenFollowing}>
                      <FormattedMessage id="following" />
                      <p>{follow?.following?.length}</p>
                    </div>
                    <Modal
                      open={openFollowing}
                      onClose={handleCloseFollowing}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <div className={classes.modal}>
                        <h1>
                          <FormattedMessage id="following" />
                        </h1>
                        <div>
                          {!_.isEmpty(follow.following) &&
                            follow.following.map((followTo, idx) => (
                              <CardFollowing key={idx} follow={followTo} handleFollow={handleFollow} />
                            ))}
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!_.isEqual(pathname, '/profile') && (
            <div className={classes['button-wrapper']}>
              {profile.Follow ? (
                <button onClick={() => handleFollow(profile.id)} type="button" className={classes.unfollow}>
                  <PersonAddDisabledIcon className={classes.icon} />
                  <FormattedMessage id="unfollow" />
                </button>
              ) : (
                <button onClick={() => handleFollow(profile.id)} type="button" className={classes.follow}>
                  <PersonAddAlt1Icon className={classes.icon} />
                  <FormattedMessage id="follow" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  profile: PropTypes.object,
  src: PropTypes.string,
  marker: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  totalPost: PropTypes.number,
  handleDeleteFollower: PropTypes.func,
  handleFollow: PropTypes.func,
  follow: PropTypes.object,
};

export default Header;
