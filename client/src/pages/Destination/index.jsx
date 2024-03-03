import Maps from '@components/Maps';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Button } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import decryptPayload from '@utils/decryptionHelper';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';
import { selectDestination } from './selectors';

import { doDeleteDestination, getDestination } from './actions';

const Destination = ({ destination }) => {
  const dispatch = useDispatch();
  const [decryptedDestination, setDecryptedDestination] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(destination)) {
      setDecryptedDestination(decryptPayload(destination));
    }
  }, [destination]);

  const handleDeleteDestination = (destinationId) => {
    console.log(destinationId);
    dispatch(
      doDeleteDestination(destinationId, (message) => {
        console.log(message);
        toast.success(message, { duration: 1000 });
        dispatch(getDestination());
      })
    );
  };

  useEffect(() => {
    dispatch(getDestination());
  }, [dispatch]);
  return (
    <div data-testid="destination" className={classes.container}>
      <div className={classes.navigation}>
        <h2>
          <FormattedMessage id="destination" />
        </h2>
        <Link to="register">
          <Button variant="contained" size="small" color="warning">
            <AddLocationAltIcon />
            <FormattedMessage sage id="registerDestination" />
          </Button>
        </Link>
      </div>
      <div className={classes.maps}>
        <Maps
          handleDeleteDestination={handleDeleteDestination}
          element="Destination"
          marker={decryptedDestination}
          isSearch={false}
          zoom={5}
          center={[-3.576250460636885, 115.94562950053937]}
        />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

Destination.propTypes = {
  destination: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  destination: selectDestination,
});

export default connect(mapStateToProps)(Destination);
