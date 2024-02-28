import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Maps from '@components/Maps';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button, Modal, Popover } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { deleteMember, getMyGroup } from '@pages/Group/actions';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';

const CardGroup = ({ data }) => {
  const [marker, setMarker] = useState([]);
  const [userId, setUserId] = useState(0);
  const [selectedUsername, setSelectedUsername] = useState('');

  console.log(data);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, username, id) => {
    setSelectedUsername(username);
    setUserId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSelectedUsername('');
    setAnchorEl(null);
  };
  console.log(data);
  const handleRemove = () => {
    dispatch(
      deleteMember(userId, data?.groups?.id, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyGroup());
        handleCloseDelete();
      })
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setMarker([
      {
        id: 1,
        position: [data?.groups?.Route?.current_latitude, data?.groups?.Route?.current_longitude],
        province: data?.groups?.Route?.current_province?.name,
        city: data?.groups?.Route?.current_city?.name,
        type: 'current',
      },
      {
        id: 2,
        position: [data?.groups?.Route?.direction_latitude, data?.groups?.Route?.direction_longitude],
        province: data?.groups?.Route?.direction_province?.name,
        city: data?.groups?.Route?.direction_city?.name,
        type: 'direction',
      },
    ]);
  }, [
    data?.groups?.Route?.current_city?.name,
    data?.groups?.Route?.current_latitude,
    data?.groups?.Route?.current_longitude,
    data?.groups?.Route?.current_province?.name,
    data?.groups?.Route?.direction_city?.name,
    data?.groups?.Route?.direction_latitude,
    data?.groups?.Route?.direction_longitude,
    data?.groups?.Route?.direction_province?.name,
  ]);

  console.log(marker);

  return (
    <div className={classes.container}>
      <div className={classes.maps}>
        <Maps isSearch={false} element="People" marker={marker} zoom={4} center={marker[0]?.position} />
      </div>
      <div className={classes['group-name']}>
        <h1>{data?.groups?.group_name}</h1>
      </div>
      <div className={classes.member}>
        <AvatarGroup max={20}>
          {data?.groups?.users?.map((user) => (
            <Avatar
              onClick={(event) => handleClick(event, user.username, user.id)}
              key={user.id}
              alt={user.username}
              src={user.image}
            />
          ))}
        </AvatarGroup>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className={classes['pop-over-container']}>
            <div className={classes['pop-over']}>
              <p>{selectedUsername}</p>
              {data.is_leader && data.user_id !== userId && (
                <RemoveCircleIcon onClick={handleOpenDelete} className={classes.icon} />
              )}
              <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className={classes['delete-modal']}>
                  <div className={classes.message}>
                    <FormattedMessage id="deleteGroupMemberConfirmation" />
                    <div className={classes.button}>
                      <Button onClick={handleCloseDelete} size="small" variant="outlined" color="error">
                        <FormattedMessage id="no" />
                      </Button>
                      <Button size="small" variant="contained" color="primary" onClick={handleRemove}>
                        <FormattedMessage id="yes" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
            <Link to={`/profile/${userId}`} className={classes.redirect}>
              <FormattedMessage id="goToProfile" />
            </Link>
          </div>
        </Popover>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

CardGroup.propTypes = {
  data: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(CardGroup);
