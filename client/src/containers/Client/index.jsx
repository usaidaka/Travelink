import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLogin, selectUser } from '@containers/Client/selectors';
import decryptPayload from '@utils/decryptionHelper';

const Client = ({ login, children, user }) => {
  const [decryptedUser, setDecryptedUser] = useState({});
  const [isUser, setIsUser] = useState(false);
  console.log(user);

  useEffect(() => {
    if (user) {
      setDecryptedUser(decryptPayload(user));
      setIsUser(!login && decryptedUser?.role !== 'User');
    }
  }, [decryptedUser?.role, login, user]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isUser) {
      navigate(-1);
    }
  }, [isUser, login, navigate]);

  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  children: PropTypes.element,
  user: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  user: selectUser,
});

export default connect(mapStateToProps)(Client);
