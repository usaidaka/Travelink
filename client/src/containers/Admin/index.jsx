import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLogin, selectUser } from '@containers/Client/selectors';
import decryptPayload from '@utils/decryptionHelper';

const Admin = ({ login, children, user }) => {
  const [decryptedUser, setDecryptedUser] = useState({});
  useEffect(() => {
    if (user) {
      setDecryptedUser(decryptPayload(user));
    }
  }, [user]);

  const navigate = useNavigate();

  const isAdmin = !login && (decryptedUser.role !== 'Admin' || decryptedUser.role !== 'Super');

  useEffect(() => {
    if (!isAdmin) {
      navigate(-1);
    }
  }, [isAdmin, navigate, decryptedUser.role]);

  return children;
};

Admin.propTypes = {
  login: PropTypes.bool,
  user: PropTypes.object,
  children: PropTypes.element,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  user: selectUser,
});

export default connect(mapStateToProps)(Admin);
