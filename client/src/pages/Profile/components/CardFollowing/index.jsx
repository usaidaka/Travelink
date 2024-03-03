import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

import classes from './style.module.scss';

const CardFollowing = ({ follow, handleFollow }) => {
  const { pathname } = useLocation();
  return (
    <div data-testid="cardFollowing" className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes['image-container']}>
          <img src={follow?.followTo?.image} alt="" />
        </div>
        <h6>{follow?.followTo?.username}</h6>
      </div>
      <div className={classes.action}>
        {pathname === '/profile' && (
          <Button
            onClick={() => handleFollow(follow?.followTo?.id)}
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: '12px' }}
          >
            <FormattedMessage id="unfollow" />
          </Button>
        )}
      </div>
    </div>
  );
};

CardFollowing.propTypes = {
  handleFollow: PropTypes.func,
  follow: PropTypes.object,
};

export default CardFollowing;
