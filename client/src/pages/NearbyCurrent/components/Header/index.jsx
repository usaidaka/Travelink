import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import classes from './style.module.scss';

const Header = () => {
  const { pathname } = useLocation();
  return (
    <div data-testid="header" className={classes.header}>
      <Link to="/nearby" className={classes.tab} data-active={pathname === '/nearby'}>
        <FormattedMessage id="nearbyCurrent" />
      </Link>
      <Link to="/nearby/direction" className={classes.tab} data-active={pathname === '/nearby/direction'}>
        <FormattedMessage id="nearbyDirection" />
      </Link>
    </div>
  );
};

export default Header;
