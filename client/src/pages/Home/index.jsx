// import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserRoute } from '@pages/Trip/actions';

import PropTypes from 'prop-types';

import classes from './style.module.scss';
import { getPost, getNearby, getProfile, getProvince } from './actions';
import Post from './components/Post';
import Tabs from './components/Tabs';
import { selectPost } from './selectors';

const Home = ({ post }) => {
  const dispatch = useDispatch();
  console.log(post);
  useEffect(() => {
    dispatch(getProfile());
    dispatch(getProvince());
    dispatch(getNearby());
    dispatch(getUserRoute());
    dispatch(getPost());
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <Post />
      <Tabs />
    </div>
  );
};

Home.propTypes = {
  post: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  post: selectPost,
});

export default connect(mapStateToProps)(Home);
