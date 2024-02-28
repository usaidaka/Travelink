import { Button, Chip } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Modal from '@mui/material/Modal';
import { deleteComment, doComment, getComment } from '@pages/Home/actions';
import { createStructuredSelector } from 'reselect';
import { selectComment } from '@pages/Home/selectors';
import { connect, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { selectUser } from '@containers/Client/selectors';
import decryptPayload from '@utils/decryptionHelper';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';

const CardPost = ({ post, comment, user }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [decryptedUser, setDecryptedUser] = useState({});
  const [loading, setLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const dispatch = useDispatch();
  console.log(comment);
  console.log(post);
  console.log(user);

  useEffect(() => {
    setDecryptedUser(decryptPayload(user));
  }, [user]);

  console.log(decryptedUser);

  const getCommentPost = () => {
    dispatch(getComment(post.id));
  };

  useEffect(() => {
    dispatch(getComment(post.id));
  }, [dispatch, post.id]);

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleDeleteComment = (commentId) => {
    console.log(commentId);
    dispatch(
      deleteComment(commentId, (message) => {
        toast.success(message, { duration: 1000 });
        setLoading(false);
        dispatch(getComment(post.id));
        handleCloseDelete();
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
    <div className={classes.container}>
      <div className={classes['image-profile']}>
        <div className={classes['image-wrapper']}>
          <img src={post?.User?.image} alt="" className={classes.image} />
        </div>
        <div className={classes['name-tag']}>
          <span>{post?.User?.username}</span>
          <div className={classes['chip-wrapper']}>
            {!_.isEmpty(post.location_name) && (
              <Chip label={post.location_name} size="small" className={classes.chip} color="primary" />
            )}
            {!_.isEmpty(post?.City?.name) && (
              <Chip label={post?.City?.name} size="small" className={classes.chip} color="success" />
            )}
            {!_.isEmpty(post?.Province?.name) && (
              <Chip label={post?.Province?.name} size="small" className={classes.chip} color="warning" />
            )}
          </div>
        </div>
      </div>
      <div className={classes.carousel}>
        <Carousel>
          {post.ImagePosts.map((item, i) => (
            <img key={i} alt="" src={item.image} />
          ))}
        </Carousel>
      </div>
      <div
        onClick={() => {
          handleOpen();
          getCommentPost();
        }}
        className={classes['button-modal']}
      >
        <AddCommentIcon />
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
                <Button disabled={loading} type="submit" size="small" variant="contained">
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
                    <div onClick={handleOpenDelete} className={classes.delete}>
                      <DeleteIcon className={classes.icon} />
                    </div>
                    <Modal
                      open={openDelete}
                      onClose={handleCloseDelete}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <div className={classes['delete-modal']}>
                        <div className={classes.message}>
                          <FormattedMessage id="deleteCommentConfirmation" />
                          <div className={classes.button}>
                            <Button onClick={handleCloseDelete} size="small" variant="outlined" color="error">
                              <FormattedMessage id="no" />
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleDeleteComment(content.id)}
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

CardPost.propTypes = { post: PropTypes.object, comment: PropTypes.array, user: PropTypes.string };

const mapStateToProps = createStructuredSelector({
  comment: selectComment,
  user: selectUser,
});

export default connect(mapStateToProps)(CardPost);
