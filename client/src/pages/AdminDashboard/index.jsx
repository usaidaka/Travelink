import Maps from '@components/Maps';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';
import { getUserList } from '@pages/People/actions';
import { FormattedMessage } from 'react-intl';
import { selectUserList } from '@pages/People/selectors';

import { getDashboardData } from './actions';
import classes from './style.module.scss';
import { selectDashboard } from './selectors';

const Dashboard = ({ dashboard, userList }) => {
  const [decryptedDashboard, setDecryptedDashboard] = useState({});

  console.log(decryptedDashboard.remapData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getUserList({ limit: 100000 }));
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(dashboard)) {
      setDecryptedDashboard(decryptPayload(dashboard));
    }
  }, [dispatch, dashboard, userList]);

  return (
    <div data-testid="adminDashboard" className={classes.container}>
      <div className={classes.maps}>
        <Maps
          marker={decryptedDashboard.remapData}
          zoom={4}
          center={[-3.436477736698971, 123.74766634273212]}
          element="Dashboard"
          isSearch={false}
        />
      </div>
      <div className={classes.data}>
        <div className={classes.user}>
          <h2>
            <FormattedMessage id="user" />
          </h2>
          <h1>{decryptedDashboard.countUser}</h1>
        </div>
        <div className={classes.trip}>
          <h2>
            <FormattedMessage id="trip" />
          </h2>
          <h1>{decryptedDashboard.countTrip}</h1>
        </div>
        <div className={classes.post}>
          <h2>
            <FormattedMessage id="post" />
          </h2>
          <h1>{decryptedDashboard.countPost}</h1>
        </div>
        <div className={classes.group}>
          <h2>
            <FormattedMessage id="group" />
          </h2>
          <h1>{decryptedDashboard.countGroup}</h1>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  dashboard: PropTypes.string,
  userList: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  dashboard: selectDashboard,
  userList: selectUserList,
});

export default connect(mapStateToProps)(Dashboard);
