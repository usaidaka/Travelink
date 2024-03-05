import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLogin, selectUser } from '@containers/Client/selectors';
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';

const Admin = ({ login, children, user }) => {
  const [decryptedUser, setDecryptedUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(user)) {
      setDecryptedUser(decryptPayload(user));
      setIsAdmin(decryptedUser?.role !== 'Admin' || decryptedUser?.role !== 'Super');
    }
  }, [decryptedUser?.role, login, user]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      navigate(-1);
    } else if (decryptPayload(user).role !== 'Admin') {
      navigate('/home');
    }
  }, [isAdmin, navigate, decryptedUser.role, login, user]);

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
