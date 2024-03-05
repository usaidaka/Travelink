import { useState } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Modal } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getMyGroup, updateGroup } from '@pages/Group/actions';
import toast, { Toaster } from 'react-hot-toast';
import _ from 'lodash';

import classes from './style.module.scss';
import MultipleSelect from '../CreateGroup/MultipleSelect';

const UpdateGroup = ({ group }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [personName, setPersonName] = useState([]);

  const dispatch = useDispatch();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    if (personName) {
      data.member = personName;
    }
    if (_.isEmpty(data.group_name)) {
      data.group_name = group?.groups?.group_name;
    }

    dispatch(
      updateGroup(group?.groups?.id, data, (message) => {
        toast.success(message, { duration: 1000 });
        dispatch(getMyGroup());
        handleClose();
        reset();
      })
    );
  };

  return (
    <div className={classes.container}>
      <div
        onClick={() => {
          handleOpen();
        }}
        className={classes.edit}
      >
        <EditIcon />
      </div>
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
                  optional: 'group name is optional',
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

UpdateGroup.propTypes = {
  group: PropTypes.array,
};

export default UpdateGroup;
