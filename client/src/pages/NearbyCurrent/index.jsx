import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { getNearby } from '@pages/Home/actions';
import { createStructuredSelector } from 'reselect';
import { selectNearby } from '@pages/Home/selectors';
import _ from 'lodash';
import Maps from '@components/Maps';
import decryptPayload from '@utils/decryptionHelper';

import classes from './style.module.scss';
import Header from './components/Header';

const NearbyCurrent = ({ nearby }) => {
  const [decryptedCurrentNearby, setDecryptedCurrentNearby] = useState([]);
  const dispatch = useDispatch();

  console.log(decryptedCurrentNearby);

  useEffect(() => {
    dispatch(getNearby());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(nearby)) {
      setDecryptedCurrentNearby(decryptPayload(nearby));
    }
  }, [nearby]);

  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.maps}>
        <Maps
          element="nearby"
          marker={decryptedCurrentNearby}
          zoom={4}
          center={[-4.0743014592420055, 119.73651081035104]}
          isSearch={false}
        />
      </div>
    </div>
  );
};

NearbyCurrent.propTypes = {
  nearby: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  nearby: selectNearby,
});

export default connect(mapStateToProps)(NearbyCurrent);
