import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setLocale /* setTheme */ } from '@containers/App/actions';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { logout } from '@utils/logout';
import { createStructuredSelector } from 'reselect';
import { selectUser } from '@containers/Client/selectors';
import logo from '@assets/logo.png';

/* ICONS */
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardIcon from '@mui/icons-material/Dashboard';
import decryptPayload from '@utils/decryptionHelper';

import classes from './style.module.scss';

const drawerWidth = 240;

const NavbarAdmin = ({ locale, children, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [menuPosition, setMenuPosition] = useState(null);
  const open = Boolean(menuPosition);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const openDropdown = Boolean(dropdownPosition);

  const [decryptedUser, setDecryptedUser] = useState('');

  useEffect(() => {
    if (user) {
      setDecryptedUser(decryptPayload(user));
    }
  }, [user]);

  const handleClickDropdown = (event) => {
    setDropdownPosition(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setDropdownPosition(null);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleClose();
  };

  const handleLogout = () => {
    logout(dispatch, navigate);
    handleCloseDropdown();
    handleClose();
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <Link to="/admin/dashboard">
        <List className={pathname === '/admin/dashboard' ? classes.active : ''}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <FormattedMessage id="dashboard" />
            </ListItemButton>
          </ListItem>
        </List>
      </Link>

      {decryptedUser.role === 'Super' && (
        <Link to="/admin/admin-list">
          <List className={pathname === '/admin/admin-list' ? classes.active : ''}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <FormattedMessage id="admin" />
              </ListItemButton>
            </ListItem>
          </List>
        </Link>
      )}

      <Link to="/admin/destination">
        <List className={pathname === '/admin/destination' ? classes.active : ''}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GpsFixedIcon />
              </ListItemIcon>
              <FormattedMessage id="destination" />
            </ListItemButton>
          </ListItem>
        </List>
      </Link>

      <Divider />
      <List onClick={handleLogout} className={classes.logout}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ExitToAppIcon color="error" />
            </ListItemIcon>
            <FormattedMessage id="logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box className={classes.headerWrapper}>
            <Link to="/admin/dashboard" className={classes.header}>
              <img src={logo} alt="" width={160} />
            </Link>
            <div className={classes.contentWrapper}>
              <div className={classes.toolbar}>
                <div className={classes.toggle} onClick={handleClick}>
                  <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
                  <div className={classes.lang}>{locale}</div>
                  <ExpandMoreIcon />
                </div>
              </div>
              <Menu open={open} anchorEl={menuPosition} onClose={handleClose}>
                <MenuItem onClick={() => onSelectLang('id')} selected={locale === 'id'}>
                  <div className={classes.menu}>
                    <Avatar className={classes.menuAvatar} src="/id.png" />
                    <div className={classes.menuLang}>
                      <FormattedMessage id="app_lang_id" />
                    </div>
                  </div>
                </MenuItem>
                <MenuItem onClick={() => onSelectLang('en')} selected={locale === 'en'}>
                  <div className={classes.menu}>
                    <Avatar className={classes.menuAvatar} src="/en.png" />
                    <div className={classes.menuLang}>
                      <FormattedMessage id="app_lang_en" />
                    </div>
                  </div>
                </MenuItem>
              </Menu>

              <div>
                <div className={classes.toolbar}>
                  <div className={classes.toggle} onClick={handleClickDropdown}>
                    <div className={classes.toggleImage} onClick={handleClickDropdown}>
                      <img src={decryptedUser.image} alt="" className={classes['photo-profile']} />
                    </div>
                  </div>
                </div>
                <Menu open={openDropdown} anchorEl={dropdownPosition} onClose={handleCloseDropdown}>
                  <MenuItem onClick={handleLogout}>
                    <div className={classes.menu}>
                      <div className={classes.menuLang}>
                        <FormattedMessage id="logout" />
                      </div>
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

NavbarAdmin.propTypes = {
  locale: PropTypes.string.isRequired,

  children: PropTypes.element.isRequired,
  user: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(NavbarAdmin);
