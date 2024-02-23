import { Link } from 'react-router-dom';

import classes from './style.module.scss';

const Tabs = () => {
  console.log('object');
  return (
    <div className={classes.container}>
      <div>
        <Link to="/">test</Link>
      </div>
      <div>
        <Link to="/">test</Link>
      </div>
    </div>
  );
};

export default Tabs;
