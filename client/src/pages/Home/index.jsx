// import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserRoute } from '@pages/Trip/actions';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import _ from 'lodash';

import classes from './style.module.scss';
import { getPost, getNearby, getProfile, getProvince } from './actions';
import Post from './components/Post';
import { selectPost } from './selectors';
import CardPost from './components/CardPost';

const Home = ({ post }) => {
  const dispatch = useDispatch();
  const [next, setNext] = useState(0);
  const [followingData, setFollowingData] = useState([]);
  const [isMore, setIsMore] = useState(false);

  const handleLoadMore = () => {
    setNext((prev) => prev + 6);
  };

  useEffect(() => {
    if (!_.isEmpty(post) && !_.isEmpty(post.followingPost)) {
      setFollowingData((prev) => [...prev, ...post.followingPost]);
      setIsMore(post.followingPost?.length >= 6);
    }
    if (post?.followingPost?.length === 0) {
      setIsMore(false);
    }
  }, [post, post.followingPost]);

  console.log(post?.followingPost?.length === 0);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getProvince());
    dispatch(getNearby());
    dispatch(getUserRoute());
    dispatch(getPost({ next, limit: 6 }));
  }, [dispatch, next]);

  return (
    <div id="top" className={classes.container}>
      <Post fetch={setFollowingData} next={next} />
      {followingData?.map((data, idx) => (
        <CardPost key={idx} post={data} />
      ))}
      {(isMore && (
        <div onClick={handleLoadMore} className={classes.expand}>
          <button type="button">
            <ExpandMoreIcon />
          </button>
        </div>
      )) ||
        (post?.followingPost?.length === 0 && null) || (
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
  post: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  post: selectPost,
});

export default connect(mapStateToProps)(Home);
