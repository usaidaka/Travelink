import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

import classes from './style.module.scss';

const CardMarker = ({ mark }) => {
  console.log(mark);
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes['image-container']}>
          <img src={mark.image} alt="" />
        </div>
      </div>
      <div className={classes.data}>
        <span>{mark.username}</span>
        <a href={`mailto: ${mark.email}`}>{mark.email}</a>
        <a
          href={`https://api.whatsapp.com/send/?phone=${mark.phone}&text=Hi!,%20I%20got%20your%20phone%20number%20from%20Travelink.&type=phone_number&app_absent=0`}
        >
          {mark.phone}
        </a>
        <div className={classes.chip}>
          <Chip label={mark.city} size="small" className={classes.chip} color="success" />
          <Chip label={mark.province} size="small" className={classes.chip} color="warning" />
        </div>
      </div>
    </div>
  );
};

CardMarker.propTypes = {
  mark: PropTypes.object,
};

export default CardMarker;
