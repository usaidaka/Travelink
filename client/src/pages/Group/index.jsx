import CreateGroup from './components/CreateGroup';
import classes from './style.module.scss';

const Group = () => {
  console.log('tet');

  console.log('object');
  return (
    <div className={classes.container}>
      <CreateGroup />
    </div>
  );
};

export default Group;
