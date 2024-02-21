import { useState } from 'react';
import Maps from '@components/Maps';
import classes from './style.module.scss';

const Home = () => {
  const [searchResult, setSearchResult] = useState(null);
  console.log('test');
  console.log(searchResult);
  return (
    <div className={classes.maps}>
      <Maps setSearchResult={setSearchResult} />
    </div>
  );
};

export default Home;
