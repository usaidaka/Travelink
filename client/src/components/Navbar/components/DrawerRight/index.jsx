// import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import MapIcon from '@mui/icons-material/Map';
import Maps from '@components/Maps';
import { selectNearby } from '@pages/Home/selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';

import classes from './style.module.scss';

// eslint-disable-next-line react/function-component-definition
const DrawerRight = ({ nearby }) => {
  const [state, setState] = useState({
    right: false,
  });

  const [decryptedNearby, setDecryptedNearby] = useState({});

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    if (!_.isEmpty(nearby)) {
      setDecryptedNearby(decryptPayload(nearby));
    }
  }, [nearby]);

  const list = (anchor) => (
    <div className={classes['sidebar-right']}>
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <div className={classes.maps}>
          <Maps
            center={decryptedNearby[0]?.current_position}
            zoom={9}
            marker={decryptedNearby}
            element="SidebarRight"
          />
        </div>
      </Box>
    </div>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MapIcon />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

DrawerRight.propTypes = {
  nearby: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  nearby: selectNearby,
});

export default connect(mapStateToProps)(DrawerRight);
