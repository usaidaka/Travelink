import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { createStructuredSelector } from 'reselect';
import { selectLogin } from '@containers/Client/selectors';
import { setLocale, setTheme } from '@containers/App/actions';
import { Button } from '@mui/material';
import { logout } from '@utils/logout';
import decryptPayload from '@utils/decryptionHelper';
import logo from '@assets/logo.png';

import GroupsIcon from '@mui/icons-material/Groups';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HikingIcon from '@mui/icons-material/Hiking';
import { selectNearby, selectProfile } from '@pages/Home/selectors';
import _ from 'lodash';

import Maps from '@components/Maps';

import { getProfile } from '@pages/Home/actions';

import classes from './style.module.scss';
import DrawerLeft from './components/DrawerLeft';
import DrawerRight from './components/DrawerRight';
import MenuLanguage from './components/MenuLanguage';

const Navbar = ({ locale, theme, isLogin, profile, children, nearby }) => {
  const [decryptedUser, setDecryptedUser] = useState({});
  const [decryptedNearby, setDecryptedNearby] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuPosition, setMenuPosition] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const open = Boolean(menuPosition);
  const openDropdown = Boolean(dropdownPosition);

  const { pathname } = useLocation();

  useEffect(() => {
    if (!_.isEmpty(profile)) {
      setDecryptedUser(decryptPayload(profile));
    }

    if (!_.isEmpty(nearby)) {
      setDecryptedNearby(decryptPayload(nearby));
    }
  }, [nearby, profile]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleClickDropdown = (event) => {
    setDropdownPosition(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setDropdownPosition(null);
  };

  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleClose();
  };

  const goHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout(dispatch, navigate);
  };

  return (
    <>
      <div className={classes.headerWrapper} data-testid="navbar">
        <div className={classes.contentWrapper}>
          <div className={classes['drawer-phone']}>
            <DrawerLeft user={decryptedUser} />
          </div>
          <div className={classes.logoImage} onClick={goHome}>
            <Link to="/" className={classes.header}>
              <img src={logo} alt="" width={140} />
            </Link>
          </div>
          <div className={classes['drawer-phone']}>
            <DrawerRight />
          </div>
          <div className={classes.dropDown}>
            <div className={classes.toolbar}>
              <div className={classes.theme} onClick={handleTheme} data-testid="toggleTheme">
                {theme === 'light' ? <NightsStayIcon /> : <LightModeIcon />}
              </div>
              <div className={classes.toggle} onClick={handleClick}>
                <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
                <div className={classes.lang}>{locale}</div>
                <ExpandMoreIcon />
              </div>
            </div>
            <MenuLanguage
              locale={locale}
              open={open}
              anchorEl={menuPosition}
              onClose={handleClose}
              onSelectLang={onSelectLang}
            />

            {isLogin ? (
              <div>
                <div className={classes.toolbar}>
                  <div className={classes.toggleImage} onClick={handleClickDropdown}>
                    <img src={decryptedUser.image} alt="" className={classes['photo-profile']} />
                  </div>
                </div>
                <Menu open={openDropdown} anchorEl={dropdownPosition} onClose={handleCloseDropdown}>
                  <Link
                    to="/profile"
                    onClick={() => {
                      handleClose();
                      handleCloseDropdown();
                    }}
                  >
                    <MenuItem>
                      <div className={classes.menu}>
                        <div className={classes.menuLang}>
                          <FormattedMessage id="profile" />
                        </div>
                      </div>
                    </MenuItem>
                  </Link>

                  <MenuItem onClick={handleLogout}>
                    <div className={classes.menu}>
                      <div className={classes.menuLang}>
                        <FormattedMessage id="logout" />
                      </div>
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Link to="/login">
                <Button size="small" variant="contained">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* LAYOUT */}

      <div className={classes.layout}>
        <div className={classes['sidebar-left']}>
          <div className={classes['profile-bar']}>
            <div className={classes.card}>
              <Link to="/profile" className={classes.image}>
                <img src={decryptedUser.image} alt="" />
              </Link>
              <div className={classes.user}>
                <p>@{decryptedUser.username}</p>
                <p>{decryptedUser.mbti}</p>
              </div>
            </div>
          </div>
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

            <Link to="/group" className={classes.nav} data-active={pathname === '/group'}>
              <GroupsIcon />
              <span>
                <FormattedMessage id="group" />
              </span>
            </Link>

            <Link to="/trip" className={classes.nav} data-active={pathname === '/trip'}>
              <HikingIcon />
              <span>
                <FormattedMessage id="trip" />
              </span>
            </Link>

            <Link to="/nearby" className={classes.nav} data-active={pathname === '/nearby'}>
              <PersonPinIcon />
              <span>
                <FormattedMessage id="nearby" />
              </span>
            </Link>

            <Link
              to="/destination-recommendation"
              className={classes.nav}
              data-active={pathname === '/destination-recommendation'}
            >
              <WhereToVoteIcon />
              <span>
                <FormattedMessage id="destinationRecommendation" />
              </span>
            </Link>

            <Link to="/setting" className={classes.nav} data-active={pathname === '/setting'}>
              <SettingsOutlinedIcon />
              <span>
                <FormattedMessage id="setting" />
              </span>
            </Link>
          </div>
        </div>
        <div className={classes.children} data-active={pathname.includes('nearby')}>
          {children}
        </div>
        {pathname.includes('nearby') || (
          <div className={classes['sidebar-right']}>
            <div className={classes.maps}>
              <Maps
                center={decryptedNearby[0]?.current_position}
                zoom={9}
                marker={decryptedNearby}
                element="SidebarRight"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Navbar.propTypes = {
  locale: PropTypes.string.isRequired,
  theme: PropTypes.string,
  isLogin: PropTypes.bool,
  profile: PropTypes.string,
  children: PropTypes.element.isRequired,
  nearby: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  isLogin: selectLogin,
  profile: selectProfile,
  nearby: selectNearby,
});

export default connect(mapStateToProps)(Navbar);
