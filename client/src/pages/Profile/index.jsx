import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { selectPost, selectProfile } from '@pages/Home/selectors';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';
import { selectUserRoute } from '@pages/Trip/selectors';
import { getUserRoute } from '@pages/Trip/actions';
import CardExplore from '@pages/Explore/CardExplore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getPost } from '@pages/Home/actions';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

import classes from './style.module.scss';
import Header from './components/Header';
import { getConnectionData } from './actions';
import { selectConnection } from './selectors';

const Profile = ({ post, profile, location, connection }) => {
  const [decryptedConnection, setDecryptedConnection] = useState({});
  const [decryptedProfile, setDecryptedProfile] = useState({});
  const [decryptedLocation, setDecryptedLocation] = useState([]);
  const [next, setNext] = useState(0);
  const [isMore, setIsMore] = useState(false);

  const [marker, setMarker] = useState([]);

  const [myPosts, setMyPosts] = useState([]);

  const dispatch = useDispatch();

  console.log(post.myPost);

  useEffect(() => {
    dispatch(getUserRoute());
    dispatch(getConnectionData());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(decryptedLocation)) {
      setMarker([
        {
          id: 1,
          position: [decryptedLocation?.current_latitude, decryptedLocation?.current_longitude],
          province: decryptedLocation?.current_province?.name,
          city: decryptedLocation?.current_city?.name,
          type: 'current',
        },
        {
          id: 2,
          position: [decryptedLocation?.direction_latitude, decryptedLocation?.direction_longitude],
          province: decryptedLocation?.direction_province?.name,
          city: decryptedLocation?.direction_city?.name,
          type: 'direction',
        },
      ]);
    }
  }, [decryptedLocation]);

  const handleLoadMore = () => {
    setNext((prev) => prev + 6);
  };

  useEffect(() => {
    dispatch(getPost({ next, limit: 6 }));
  }, [dispatch, next]);

  useEffect(() => {
    if (!_.isEmpty(post) && !_.isEmpty(post.myPost)) {
      setMyPosts((prev) => [...prev, ...post.myPost]);
      setIsMore(post.myPost?.length >= 6);
    }
    if (post?.myPost?.length === 0) {
      setIsMore(false);
    }
  }, [post, post.myPost]);

  useEffect(() => {
    if (!_.isEmpty(profile)) {
      setDecryptedProfile(decryptPayload(profile));
    }

    if (!_.isEmpty(location)) {
      setDecryptedLocation(decryptPayload(location));
    }
    if (connection) {
      setDecryptedConnection(decryptPayload(connection));
    }
  }, [connection, location, profile]);

  return (
    <div className={classes.container}>
      <Header
        src={decryptedProfile.image}
        marker={marker}
        profile={decryptedProfile}
        followerCount={decryptedConnection.followersCount}
        followingCount={decryptedConnection.followingsCount}
        totalPost={decryptedConnection.totalPost}
      />
      <div className={classes['card-container']}>
        {myPosts?.map((data, idx) => (
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
        (post?.myPost?.length === 0 && null) || (
          <a href="#top" className={classes.expand}>
            <button type="button">
              <VerticalAlignTopIcon />
            </button>
          </a>
        )}
    </div>
  );
};

Profile.propTypes = {
  post: PropTypes.object,
  profile: PropTypes.string,
  location: PropTypes.string,
  connection: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  post: selectPost,
  profile: selectProfile,
  connection: selectConnection,
  location: selectUserRoute,
});

export default connect(mapStateToProps)(Profile);
