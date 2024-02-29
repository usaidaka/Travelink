import Maps from '@components/Maps';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getDestination } from '@pages/Destination/actions';
import { createStructuredSelector } from 'reselect';
import { selectDestination } from '@pages/Destination/selectors';
import _ from 'lodash';
import decryptPayload from '@utils/decryptionHelper';

import classes from './style.module.scss';

const DestinationRecommendation = ({ destination }) => {
  const [decryptedDestination, setDecryptedDestination] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDestination());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(destination)) {
      setDecryptedDestination(decryptPayload(destination));
    }
  }, [destination]);

  return (
    <div className={classes.container}>
      <div>test</div>
      <div className={classes.maps}>
        <Maps
          element="DestinationRecommendation"
          zoom={4}
          marker={decryptedDestination}
          center={[-4.0743014592420055, 119.73651081035104]}
          isSearch={false}
        />
      </div>
    </div>
  );
};

DestinationRecommendation.propTypes = {
  destination: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  destination: selectDestination,
});

export default connect(mapStateToProps)(DestinationRecommendation);
