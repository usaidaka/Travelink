import { useState } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import Carousel from 'react-material-ui-carousel';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useLocation } from 'react-router-dom';

import classes from './style.module.scss';

const CardDestination = ({ pin, handleDeleteDestination }) => {
  /* HANDLE DELETE DESTINATION */
  const [openDeleteDestination, setOpenDeleteDestination] = useState(false);
  const handleOpenDeleteDestination = () => setOpenDeleteDestination(true);
  const handleCloseDeleteDestination = () => setOpenDeleteDestination(false);

  const { pathname } = useLocation();

  console.log(pin);
  return (
    <div data-testid="cardDestination" className={classes['container-destination']}>
      <div className={classes['image-container']}>
        <Carousel>
          {pin.ImageDestinations.map((src, idx) => (
            <img key={idx} src={src.image} alt="" />
          ))}
        </Carousel>
      </div>
      <div className={classes.information}>
        <div className={classes.region}>
          <span>{pin.Province.name}</span>, <span>{pin.City.name}</span>
          <div>
            <a
              target="_blank"
              href={`https://api.whatsapp.com/send/?phone=${pin.phone}&text=Hi!,%20I%20got%20your%20phone%20number%20from%20Travelink.&type=phone_number&app_absent=0`}
              rel="noreferrer"
              className={classes.whatsapp}
            >
              {pin.phone}
            </a>
          </div>
        </div>
        <div className={classes.text}>
          <div className={classes.detail}>
            <span className={classes.label}>
              <FormattedMessage id="detail" />
            </span>
            <span>{pin.detail}</span>
          </div>
          <div className={classes.desc}>
            <span className={classes.label}>
              <FormattedMessage id="description" />
            </span>
            <span>{pin.description}</span>
          </div>
        </div>
        {pathname !== '/admin/destination' || (
          <div className={classes.edit}>
            <div>
              <Button onClick={handleOpenDeleteDestination} variant="outlined" color="error" size="small">
                <DeleteIcon className={classes.icon} />
              </Button>
              <Modal
                open={openDeleteDestination}
                onClose={handleCloseDeleteDestination}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className={classes['delete-modal']}>
                  <div className={classes.message}>
                    <FormattedMessage id="deleteDestinationConfirmation" />
                    <div className={classes.button}>
                      <Button onClick={handleCloseDeleteDestination} size="small" variant="outlined" color="error">
                        <FormattedMessage id="no" />
                      </Button>
                      <Button
                        onClick={() => {
                          handleDeleteDestination(pin.id);
                          handleCloseDeleteDestination();
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
            </div>
            <Link to={`${pin.id}`}>
              <Button color="success" variant="contained" size="small">
                <EditIcon className={classes.icon} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

CardDestination.propTypes = {
  pin: PropTypes.object,
  handleDeleteDestination: PropTypes.func,
};

export default CardDestination;
