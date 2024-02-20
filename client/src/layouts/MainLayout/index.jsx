import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLocale, selectTheme } from '@containers/App/selectors';

import Navbar from '@components/Navbar';
import NavbarAdmin from '@components/NavbarAdmin';
import { selectUser } from '@containers/Client/selectors';
import decryptPayload from '@utils/decryptionHelper';
import { useEffect, useState } from 'react';

const MainLayout = ({ children, locale, theme, intl: { formatMessage }, user }) => {
  const [decryptedUser, setDecryptedUser] = useState({});

  useEffect(() => {
    if (user) {
      setDecryptedUser(decryptPayload(user));
    }
  }, [user]);

  console.log(decryptedUser);

  let renderNav;

  switch (decryptedUser.role) {
    case 'Super':
    case 'Admin':
      renderNav = (
        <NavbarAdmin title={formatMessage({ id: 'app_title_header' })} locale={locale} theme={theme}>
          {children}
        </NavbarAdmin>
      );
      break;
    case 'User':
      renderNav = (
        <>
          <Navbar title={formatMessage({ id: 'app_title_header' })} locale={locale} theme={theme} />
          {children}
        </>
      );
      break;
    default:
      renderNav = (
        <>
          <Navbar title={formatMessage({ id: 'app_title_header' })} locale={locale} theme={theme} />
          {children}
        </>
      );
      break;
  }
  return <div>{renderNav}</div>;
};

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  theme: selectTheme,
  user: selectUser,
});

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  theme: PropTypes.string,
  intl: PropTypes.object,
  user: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps)(MainLayout));
