import { Button, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectUserRoute } from '@pages/Trip/selectors';
import { connect, useDispatch } from 'react-redux';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';
import { selectMyGroup } from '@pages/Group/selectors';
import { createGroup, getMyGroup, leaveGroup, removeGroup } from '@pages/Group/actions';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Maps from '@components/Maps';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';
import MultipleSelect from './MultipleSelect';
import CardGroup from './CardGroup';
import UpdateGroup from '../UpdateGroup';

const CreateGroup = ({ location, myGroup }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [openLeave, setOpenLeave] = useState(false);
  const handleOpenLeave = () => setOpenLeave(true);
  const handleCloseLeave = () => setOpenLeave(false);

  const [personName, setPersonName] = useState([]);
  const [myRoute, setMyRoute] = useState({});
  const [decryptedMyGroup, setDecryptedMyGroup] = useState([]);

  const dispatch = useDispatch();

  console.log(myGroup);

  useEffect(() => {
    if (myGroup.decryptedData === null) {
      setDecryptedMyGroup([]);
    } else if (!_.isEmpty(myGroup)) {
      setDecryptedMyGroup(decryptPayload(myGroup));
    }
  }, [myGroup]);

  useEffect(() => {
    dispatch(getMyGroup());
  }, [dispatch]);

  const {
    register,
    // reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (!_.isEmpty(location)) {
      setMyRoute(decryptPayload(location));
    }
  }, [location]);

  const onSubmit = (data) => {
    if (!_.isEmpty(personName)) {
      data.member = personName;
    }
    if (!_.isEmpty(myRoute)) {
      data.route_id = myRoute.id;
    }
    dispatch(
      createGroup(data, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyGroup());
        handleClose();
      })
    );
  };

  const handleLeaveGroup = () => {
    dispatch(
      leaveGroup(decryptedMyGroup?.groups?.id, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyGroup());
        handleCloseLeave();
      })
    );
  };
  console.log(decryptedMyGroup);
  const handleDeleteGroup = () => {
    dispatch(
      removeGroup(decryptedMyGroup?.groups?.id, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyGroup());
        handleCloseDelete();
      })
    );
  };

  const renderActionButton = () => {
    let actionButton = null;

    if (_.isEmpty(decryptedMyGroup)) {
      actionButton = (
        <div onClick={handleOpen} className={classes.create}>
          <GroupAddIcon />
        </div>
      );
    } else if (decryptedMyGroup.is_leader) {
      actionButton = (
        <div className={classes.leader}>
          <div
            onClick={() => {
              handleOpenDelete();
            }}
            className={classes.remove}
          >
            <PersonRemoveIcon />
          </div>
          <UpdateGroup myRoute={myRoute} group={decryptedMyGroup} setGroup={setDecryptedMyGroup} />
        </div>
      );
    } else {
      actionButton = (
        <div className={classes['not-leader']}>
          <div
            onClick={() => {
              handleOpenLeave();
            }}
            className={classes.leave}
          >
            <ExitToAppIcon />
          </div>
        </div>
      );
    }

    return actionButton;
  };

  console.log(myGroup);

  return (
    <div className={classes.container}>
      <div className={classes['add-group']}>
        {!_.isEmpty(decryptedMyGroup) ? (
          <CardGroup key={decryptedMyGroup.id} data={decryptedMyGroup} />
        ) : (
          <div className={classes['maps-container']}>
            <div className={classes.maps}>
              <Maps />
            </div>
            <div className={classes.text}>
              <h1>
                <FormattedMessage id="startJourney" />
              </h1>
            </div>
          </div>
        )}
        {renderActionButton()}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={classes.modal}>
            <form action="" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.wrapper}>
                <label htmlFor="">
                  <FormattedMessage id="groupName" />
                </label>
                <input
                  type="text"
                  className={classes.input}
                  id="group_name"
                  name="group_name"
                  placeholder="My Trip My Adventure Goes To Bali"
                  {...register('group_name', {
                    required: 'group name is required',
                  })}
                  aria-invalid={errors.group_name ? 'true' : 'false'}
                />
                {errors.group_name && (
                  <span role="alert" className={classes['error-validation']}>
                    {errors.group_name.message}
                  </span>
                )}
              </div>
              <div>
                <MultipleSelect setPersonName={setPersonName} personName={personName} />
              </div>

              <div className={classes.button}>
                <Button variant="contained" type="submit" size="small" className={classes.submit}>
                  <FormattedMessage id="send" />
                </Button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={classes['delete-modal']}>
            <div className={classes.message}>
              <FormattedMessage id="deleteGroupConfirmation" />
              <div className={classes.button}>
                <Button onClick={handleCloseDelete} size="small" variant="outlined" color="error">
                  <FormattedMessage id="no" />
                </Button>
                <Button size="small" variant="contained" color="primary" onClick={handleDeleteGroup}>
                  <FormattedMessage id="yes" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          open={openLeave}
          onClose={handleCloseLeave}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={classes['delete-modal']}>
            <div className={classes.message}>
              <FormattedMessage id="leaveGroupConfirmation" />
              <div className={classes.button}>
                <Button onClick={handleCloseLeave} size="small" variant="outlined" color="error">
                  <FormattedMessage id="no" />
                </Button>
                <Button size="small" variant="contained" color="primary" onClick={handleLeaveGroup}>
                  <FormattedMessage id="yes" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

CreateGroup.propTypes = {
  location: PropTypes.string,
  myGroup: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const mapStateToProps = createStructuredSelector({
  location: selectUserRoute,
  myGroup: selectMyGroup,
});

export default connect(mapStateToProps)(CreateGroup);
