import PropTypes from 'prop-types';
import logo from '@assets/logo.png';

import classes from './style.module.scss';

const CardAuth = ({ children, src }) => (
  <div className={classes.container}>
    <div className={classes.decoration}>
      <img src={src} alt="" className={classes.image} />
    </div>
    <div className={classes.main}>
      <div>
        <img src={logo} alt="" className={classes.image} />
      </div>
      <div className={classes.form}>{children}</div>
    </div>
  </div>
);

CardAuth.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  src: PropTypes.any.isRequired,
};

export default CardAuth;
