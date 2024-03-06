import PropTypes from 'prop-types';
import { Button, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { createStructuredSelector } from 'reselect';
import { selectComment } from '@pages/Home/selectors';
import { selectUser } from '@containers/Client/selectors';
import { connect, useDispatch } from 'react-redux';
import decryptPayload from '@utils/decryptionHelper';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteComment, doComment, getComment } from '@pages/Home/actions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import _ from 'lodash';

import classes from './style.module.scss';

const CardExplore = ({ post, comment, user, handleDeletePost }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [decryptedUser, setDecryptedUser] = useState({});

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [openDeleteComment, setOpenDeleteComment] = useState(false);
  const handleOpenDeleteComment = () => setOpenDeleteComment(true);
  const handleCloseDeleteComment = () => setOpenDeleteComment(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(user)) {
      setDecryptedUser(decryptPayload(user));
    }
  }, [user]);

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getCommentPost = (postId) => {
    dispatch(getComment(postId));
  };

  const handleDeleteComment = (commentId) => {
    dispatch(
      deleteComment(commentId, (message) => {
        toast.success(message, { duration: 1000 });
        setLoading(false);
        handleCloseDeleteComment();
        dispatch(getComment(post.id));
      })
    );
  };

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(
      doComment(post.id, data, (message) => {
        toast.success(message, { duration: 1000 });
        setLoading(false);
        dispatch(getComment(post.id));
        reset();
      })
    );
  };

  return (
    <div data-testid="cardExplore" className={classes.card}>
      <div className={classes['image-container']}>
        <span
          onClick={() => {
            handleOpen();
            getCommentPost(post.id);
          }}
        >
          <img src={post?.ImagePosts[0]?.image} alt="" className={classes.image} />
        </span>
        {decryptedUser.id === post.user_id && (
          <div className={classes.menu}>
            <div
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickMenu}
              className={classes.burger}
            >
              <KeyboardArrowDownIcon className={classes.icon} />
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={() => {
                handleCloseMenu();
              }}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                sx={{ fontSize: 12 }}
                onClick={() => {
                  // handleCloseMenu();
                }}
              >
                <div onClick={() => handleOpenDelete()}>
                  <FormattedMessage id="delete" />
                </div>
                <Modal
                  open={openDelete}
                  onClose={handleCloseDelete}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <div className={classes['delete-modal']}>
                    <div className={classes.message}>
                      <FormattedMessage id="deletePostConfirmation" />
                      <div className={classes.button}>
                        <Button onClick={handleCloseDelete} size="small" variant="outlined" color="error">
                          <FormattedMessage id="no" />
                        </Button>
                        <Button
                          onClick={() => {
                            handleDeletePost(post.id);
                            handleCloseDelete();
                            handleCloseMenu();
                          }}
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          <FormattedMessage id="yes" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </MenuItem>
              <Link to={`/post/${post.id}`}>
                <MenuItem
                  sx={{ fontSize: 12 }}
                  onClick={() => {
                    handleCloseMenu();
                  }}
                >
                  <FormattedMessage id="edit" />
                </MenuItem>
              </Link>
            </Menu>
          </div>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes['box-modal']}>
          <div className={classes['post-detail']}>
            <div className={classes.carousel}>
              <Carousel>
                {post.ImagePosts.map((item, i) => (
                  <img key={i} alt="" src={item.image} />
                ))}
              </Carousel>
            </div>
          </div>
          <div className={classes['comment-section']}>
            <div className={classes.caption}>
              <p>{post?.User?.username}</p>
              <p>{post.caption}</p>
              <p className={classes.date}>{dayjs(post.createdAt).format('dddd, MMMM D, YYYY h:mm A')}</p>
              <hr />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.wrapper}>
                <label htmlFor="">
                  <FormattedMessage id="comment" />
                </label>

                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  className={classes.textarea}
                  {...register('comment', {
                    required: 'comment is required',
                  })}
                />

                {errors.comment && (
                  <span role="alert" className={classes['error-validation']}>
                    {errors.comment.message}
                  </span>
                )}
              </div>
              <div className={classes['button-wrapper']}>
                <Button type="submit" size="small" variant="contained">
                  <FormattedMessage id="send" />
                </Button>
              </div>
            </form>
            {comment.map((content) => (
              <div key={content.id} className={classes['comment-card']}>
                <div className={classes['image-profile']}>
                  <div className={classes['image-wrapper']}>
                    <img src={content?.User?.image} alt="" className={classes.image} />
                  </div>
                  <div className={classes['name-tag']}>
                    <span className={classes.username}>{content?.User?.username}</span>
                    <span>{dayjs(content.createdAt).format('dddd, MMMM D, YYYY h:mm A')}</span>
                  </div>
                </div>
                <span>{content.comment}</span>
                {decryptedUser.id === content.user_id && (
                  <>
                    <div onClick={handleOpenDeleteComment} className={classes.delete}>
                      <DeleteIcon className={classes.icon} />
                    </div>
                    <Modal
                      open={openDeleteComment}
                      onClose={handleCloseDeleteComment}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <div className={classes['delete-modal']}>
                        <div className={classes.message}>
                          <FormattedMessage id="deleteCommentConfirmation" />
                          <div className={classes.button}>
                            <Button onClick={handleClose} size="small" variant="outlined" color="error">
                              <FormattedMessage id="no" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteComment(content.id)}
                              size="small"
                              variant="contained"
                              color="primary"
                              disabled={loading}
                            >
                              <FormattedMessage id="yes" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

CardExplore.propTypes = {
  post: PropTypes.object,
  comment: PropTypes.array,
  user: PropTypes.string,
  handleDeletePost: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  comment: selectComment,
  user: selectUser,
});

export default connect(mapStateToProps)(CardExplore);
