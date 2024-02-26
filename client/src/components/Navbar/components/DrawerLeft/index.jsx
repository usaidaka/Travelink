import PropTypes from 'prop-types';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import GroupsIcon from '@mui/icons-material/Groups';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HikingIcon from '@mui/icons-material/Hiking';

import classes from './style.module.scss';

// eslint-disable-next-line react/function-component-definition
const DrawerLeft = ({ user }) => {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const { pathname } = useLocation();

  const list = (anchor) => (
    <div className={classes['sidebar-left']}>
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <div className={classes['profile-bar']}>
          <div className={classes.card}>
            <Link to="/profile" className={classes.image}>
              <img src={user.image} alt="" />
            </Link>
            <div className={classes.user}>
              <p>@{user.username}</p>
              <p>{user.mbti}</p>
            </div>
          </div>
        </div>

        <Divider />

        <div className={classes['side-nav']}>
          <Link to="/home" className={classes.nav} data-active={pathname === '/home' || pathname === '/'}>
            <HomeOutlinedIcon />
            <span>
              <FormattedMessage id="home" />
            </span>
          </Link>

          <Link to="/explore" className={classes.nav} data-active={pathname === '/explore'}>
            <ExploreOutlinedIcon />
            <span>
              <FormattedMessage id="explore" />
            </span>
          </Link>

          <Link to="/people" className={classes.nav} data-active={pathname === '/people'}>
            <PermIdentityOutlinedIcon />
            <span>
              <FormattedMessage id="people" />
            </span>
          </Link>

          <Link to="/trip" className={classes.nav} data-active={pathname === '/trip'}>
            <HikingIcon />
            <span>
              <FormattedMessage id="trip" />
            </span>
          </Link>

          <Link to="/group" className={classes.nav} data-active={pathname === '/group'}>
            <GroupsIcon />
            <span>
              <FormattedMessage id="group" />
            </span>
          </Link>

          <Link to="/setting" className={classes.nav} data-active={pathname === '/setting'}>
            <SettingsOutlinedIcon />
            <span>
              <FormattedMessage id="setting" />
            </span>
          </Link>
        </div>
      </Box>
    </div>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <AccountCircleIcon />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

DrawerLeft.propTypes = {
  user: PropTypes.object,
};

export default DrawerLeft;
