import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getPost } from '@pages/Home/actions';
import { createStructuredSelector } from 'reselect';
import { selectPost } from '@pages/Home/selectors';
import _ from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import { doDeletePost } from '@pages/Profile/actions';
import toast from 'react-hot-toast';

import classes from './style.module.scss';
import CardExplore from './CardExplore';

const Explore = ({ post }) => {
  const dispatch = useDispatch();
  const [next, setNext] = useState(0);
  const [allPostData, setAllPostData] = useState([]);
  const [isMore, setIsMore] = useState(false);

  const handleLoadMore = () => {
    setNext((prev) => prev + 18);
  };

  useEffect(() => {
    dispatch(getPost({ next, limit: 18 }));
  }, [dispatch, next]);

  const handleDeletePost = (postId) => {
    dispatch(
      doDeletePost(postId, (message) => {
        toast.success(message, { duration: 1000 });
        setAllPostData((prev) => prev.filter((x) => x.id !== postId));
      })
    );
  };

  useEffect(() => {
    if (!_.isEmpty(post) && !_.isEmpty(post.allPost)) {
      setAllPostData((prev) => [...prev, ...post.allPost]);
      setIsMore(post.allPost?.length >= 6);
    }
    if (post?.allPost?.length === 0) {
      setIsMore(false);
    }
  }, [post, post.allPost]);

  useEffect(() => {
    setAllPostData([]);
  }, [setAllPostData]);

  return (
    <div data-testid="explore" className={classes.container}>
      <div className={classes['card-container']}>
        {allPostData?.map((data, idx) => (
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

Explore.propTypes = {
  post: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  post: selectPost,
});

export default connect(mapStateToProps)(Explore);
