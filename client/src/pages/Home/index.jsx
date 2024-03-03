import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserRoute } from '@pages/Trip/actions';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import _ from 'lodash';
import Loader from '@components/Loader';

import classes from './style.module.scss';
import { getNearby, getProfile, getProvince, getFollowingPost } from './actions';
import Post from './components/Post';
import { selectFollowingPost } from './selectors';
import CardPost from './components/CardPost';

const Home = ({ followingPost, loadingTest = true }) => {
  const dispatch = useDispatch();
  const [next, setNext] = useState(0);
  const [followingData, setFollowingData] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(
          getProfile(() => {
            setLoading(false);
          })
        ),
        dispatch(
          getProvince(() => {
            setLoading(false);
          })
        ),
        dispatch(
          getNearby(() => {
            setLoading(false);
          })
        ),
        dispatch(
          getUserRoute(() => {
            setLoading(false);
          })
        ),
      ]);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFollowingPost({ next }));
  }, [dispatch, next]);

  useEffect(() => {
    if (!_.isEmpty(followingPost)) {
      setFollowingData((prev) => [...prev, ...followingPost]);
      setIsMore(followingPost.length >= 6);
    } else {
      setIsMore(false);
    }
  }, [followingPost]);

  const handleLoadMore = () => {
    setNext((prev) => prev + 6);
  };

  if (loading && loadingTest) {
    return <Loader isLoading={loading} />;
  }

  return (
    <div data-testid="home" id="top" className={classes.container}>
      <Post fetch={setFollowingData} next={next} />
      {followingData.map((data, idx) => (
        <CardPost key={idx} post={data} />
      ))}
      {isMore ? (
        <div onClick={handleLoadMore} className={classes.expand}>
          <button type="button">
            <ExpandMoreIcon />
          </button>
        </div>
      ) : (
        <a href="#top" className={classes.expand}>
          <button type="button">
            <VerticalAlignTopIcon />
          </button>
        </a>
      )}
    </div>
  );
};

Home.propTypes = {
  followingPost: PropTypes.array,
  loadingTest: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  followingPost: selectFollowingPost,
});

export default connect(mapStateToProps)(Home);
