import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';
import CardExplore from '@pages/Explore/CardExplore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import Header from '@pages/Profile/components/Header';

import { getUserConnection, getUserPost, getUserProfile } from './actions';
import classes from './style.module.scss';
import { selectUserConnection, selectUserPost, selectUserProfile } from './selectors';

const UserProfile = ({ userProfile, posts, userConnection }) => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [decryptedUserProfile, setDecryptedUserProfile] = useState({});
  const [decryptedUserConnection, setDecryptedUserConnection] = useState({});

  const [next, setNext] = useState(0);
  const [userProfilePost, setUserProfilePost] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [marker, setMarker] = useState([]);

  console.log(decryptedUserConnection);
  console.log(next);

  useEffect(() => {
    dispatch(getUserProfile(userId));
    dispatch(getUserPost(userId, { next, limit: 6 }));
    dispatch(getUserConnection(userId));
  }, [dispatch, next, userId]);

  useEffect(() => {
    if (!_.isEmpty(userProfile)) {
      setDecryptedUserProfile(decryptPayload(userProfile));
    }
    if (!_.isEmpty(userConnection)) {
      setDecryptedUserConnection(decryptPayload(userConnection));
    }
  }, [userConnection, userProfile]);

  useEffect(() => {
    if (!_.isEmpty(decryptedUserProfile)) {
      setMarker([
        {
          id: 1,
          position: [decryptedUserProfile?.Route?.current_latitude, decryptedUserProfile?.Route?.current_longitude],
          province: decryptedUserProfile?.Route?.current_province?.name,
          city: decryptedUserProfile?.Route?.current_city?.name,
          type: 'current',
        },
        {
          id: 2,
          position: [decryptedUserProfile?.Route?.direction_latitude, decryptedUserProfile?.Route?.direction_longitude],
          province: decryptedUserProfile?.Route?.direction_province?.name,
          city: decryptedUserProfile?.Route?.direction_city?.name,
          type: 'direction',
        },
      ]);
    }
  }, [decryptedUserProfile]);

  const handleLoadMore = () => {
    setNext((prev) => prev + 6);
  };

  useEffect(() => {
    if (!_.isEmpty(posts)) {
      setUserProfilePost((prev) => [...prev, ...posts]);
      setIsMore(posts?.length >= 6);
    }
    if (posts.length === 0) {
      setIsMore(false);
    }
  }, [posts]);

  console.log(decryptedUserProfile.Follow);
  console.log(marker);

  console.log(userId);
  console.log('tet');

  console.log('object');
  return (
    <div className={classes.container}>
      <Header
        src={decryptedUserProfile.image}
        marker={marker}
        profile={decryptedUserProfile}
        followerCount={decryptedUserConnection.followersCount}
        followingCount={decryptedUserConnection.followingsCount}
        totalPost={decryptedUserConnection.totalPost}
      />
      <div className={classes['card-container']}>
        {userProfilePost?.map((data, idx) => (
          <CardExplore key={idx} post={data} />
        ))}
      </div>
      {(isMore && (
        <div onClick={handleLoadMore} className={classes.expand}>
          <button type="button">
            <ExpandMoreIcon />
          </button>
        </div>
      )) ||
        (posts?.length === 0 && null) || (
          <a href="#top" className={classes.expand}>
            <button type="button">
              <VerticalAlignTopIcon />
            </button>
          </a>
        )}
    </div>
  );
};

UserProfile.propTypes = {
  userProfile: PropTypes.string,
  posts: PropTypes.array,
  userConnection: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  userProfile: selectUserProfile,
  posts: selectUserPost,
  userConnection: selectUserConnection,
});

export default connect(mapStateToProps)(UserProfile);