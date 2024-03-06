import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

import classes from './style.module.scss';

const CardFollower = ({ follow, handleDeleteFollower }) => {
  const { pathname } = useLocation();

  return (
    <div data-testid="cardFollower" className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes['image-container']}>
          <img src={follow?.followBy?.image} alt="" />
        </div>
        <h6>{follow?.followBy?.username}</h6>
      </div>
      <div className={classes.action}>
        {pathname === '/profile' && (
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: '12px' }}
            onClick={() => handleDeleteFollower(follow.id)}
          >
            <FormattedMessage id="delete" />
          </Button>
        )}
      </div>
    </div>
  );
};

CardFollower.propTypes = {
  follow: PropTypes.object,
  handleDeleteFollower: PropTypes.func,
};

export default CardFollower;
