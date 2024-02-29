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
import Loader from '@components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { doFollow } from '@pages/People/actions';

import classes from './style.module.scss';
import Header from './components/Header';
import { doDeleteFollower, doDeletePost, getConnectionData, getMyFollow } from './actions';
import { selectConnection, selectMyFollow } from './selectors';

const Profile = ({ post, profile, location, connection, myFollow }) => {
  const [decryptedConnection, setDecryptedConnection] = useState({});
  const [decryptedProfile, setDecryptedProfile] = useState({});
  const [decryptedLocation, setDecryptedLocation] = useState([]);
  const [decryptedMyFollow, setDecryptedMyFollow] = useState({});
  const [next, setNext] = useState(0);
  const [isMore, setIsMore] = useState(false);

  const [marker, setMarker] = useState([]);
  const [render, setRender] = useState(true);

  const [myPosts, setMyPosts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserRoute());
    dispatch(getConnectionData());
    dispatch(getMyFollow());
  }, [dispatch]);

  const handleFollow = (followTo) => {
    dispatch(
      doFollow(followTo, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyFollow());
      })
    );
  };

  const handleDeleteFollower = (followId) => {
    console.log(followId);
    dispatch(
      doDeleteFollower(followId, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyFollow());
      })
    );
  };

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

  const handleDeletePost = (postId) => {
    dispatch(
      doDeletePost(postId, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getPost());
        setMyPosts(myPosts.filter((postTest) => postTest.id !== postId));
      })
    );
  };

  useEffect(() => {
    dispatch(
      getPost({ next, limit: 6 }, () => {
        setRender(false);
      })
    );
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

    if (myFollow) {
      setDecryptedMyFollow(decryptPayload(myFollow));
    }
  }, [connection, location, myFollow, profile]);

  if (render) {
    return <Loader isLoading={render} />;
  }

  return (
    <div className={classes.container}>
      <Header
        handleDeleteFollower={handleDeleteFollower}
        handleFollow={handleFollow}
        follow={decryptedMyFollow}
        src={decryptedProfile.image}
        marker={marker}
        profile={decryptedProfile}
        followerCount={decryptedConnection.followersCount}
        followingCount={decryptedConnection.followingsCount}
        totalPost={decryptedConnection.totalPost}
      />
      <div className={classes['card-container']}>
        {myPosts?.map((data, idx) => (
          <CardExplore key={idx} post={data} handleDeletePost={handleDeletePost} />
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

Profile.propTypes = {
  post: PropTypes.object,
  profile: PropTypes.string,
  location: PropTypes.string,
  connection: PropTypes.string,
  myFollow: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  post: selectPost,
  profile: selectProfile,
  connection: selectConnection,
  location: selectUserRoute,
  myFollow: selectMyFollow,
});

export default connect(mapStateToProps)(Profile);
