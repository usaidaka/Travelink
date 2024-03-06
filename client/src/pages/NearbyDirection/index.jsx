import Header from '@pages/NearbyCurrent/components/Header';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';
import Maps from '@components/Maps';

import classes from './style.module.scss';
import { getNearbyDirection } from './action';
import { selectNearbyDirection } from './selectors';

const NearbyDirection = ({ nearbyDirection }) => {
  const [decryptedNearbyDirection, setDecryptedNearbyDirection] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNearbyDirection());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(nearbyDirection)) {
      setDecryptedNearbyDirection(decryptPayload(nearbyDirection));
    }
  }, [nearbyDirection]);

  useEffect(() => {}, []);
  return (
    <div data-testid="nearbyDirection" className={classes.container}>
      <Header />
      <div className={classes.maps}>
        <Maps
          element="nearby"
          marker={decryptedNearbyDirection}
          zoom={4}
          center={[-4.0743014592420055, 119.73651081035104]}
          isSearch={false}
        />
      </div>
    </div>
  );
};

NearbyDirection.propTypes = {
  nearbyDirection: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  nearbyDirection: selectNearbyDirection,
});

export default connect(mapStateToProps)(NearbyDirection);
