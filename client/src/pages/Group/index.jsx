import CreateGroup from './components/CreateGroup';
import classes from './style.module.scss';

const Group = () => (
  <div data-testid="group" className={classes.container}>
    <CreateGroup />
  </div>
);

export default Group;
