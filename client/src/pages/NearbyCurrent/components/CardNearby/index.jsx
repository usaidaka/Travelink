import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';

import classes from './style.module.scss';

const CardNearby = ({ mark }) => {
  console.log(mark);
  return (
    <div className={classes.container}>
      <div className={classes['card-container']}>
        <div className={classes.information}>
          <div className={classes.wrapper}>
            <div className={classes['image-container']}>
              <img src={mark?.profile?.image} alt="" />
            </div>
            <div className={classes.profile}>
              <span>{mark?.profile?.username}</span>
              <span>{mark?.profile?.email}</span>
              <span>{mark?.profile?.phone}</span>
            </div>
          </div>
          <div className={classes.trip}>
            <div className={classes.direction}>
              <h6>
                <FormattedMessage id="from" />
              </h6>
              <div>
                <span>
                  <Chip label={mark?.current_region?.city} size="small" className={classes.chip} color="success" />
                </span>
                <span>
                  <Chip label={mark?.current_region?.province} size="small" className={classes.chip} color="warning" />
                </span>
              </div>
            </div>
            <div className={classes.direction}>
              <h6>
                <FormattedMessage id="to" />
              </h6>
              <div>
                <span>
                  <Chip label={mark?.direction_region?.city} size="small" className={classes.chip} color="success" />
                </span>
                <span>
                  <Chip
                    label={mark?.direction_region?.province}
                    size="small"
                    className={classes.chip}
                    color="warning"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CardNearby.propTypes = {
  mark: PropTypes.object,
};

export default CardNearby;
