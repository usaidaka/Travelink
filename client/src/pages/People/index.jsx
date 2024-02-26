import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { useSearchParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import toast, { Toaster } from 'react-hot-toast';

import classes from './style.module.scss';
import { selectUserList } from './selectors';
import { doFollow, getUserList } from './actions';
import CardPeople from './components/CardPeople';

const People = ({ userList }) => {
  const dispatch = useDispatch();

  const [next, setNext] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('username');

  const [userListData, setUserListData] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [search, setSearch] = useState('');

  const getUserListSearch = (query) => {
    console.log(query);
    if (query) {
      setSearchParams({ username: query });
    } else {
      setSearchParams({});
    }
    dispatch(getUserList({ ...(query !== '' && { username: query, next }) }));
  };

  const handleFollow = (followTo) => {
    dispatch(
      doFollow(followTo, (message) => {
        console.log(message);
        toast.success(message, { duration: 1000 });
        getUserListSearch();
      })
    );
  };

  const getUserListFromApi = () => {
    dispatch(getUserList());
  };
  console.log(userList);

  const handleSearch = () => {
    setUserListData([]);
    getUserListSearch(search);
  };

  console.log(userListData);

  const handleLoadMore = () => {
    setNext((prev) => prev + 6);
    getUserListSearch();
  };

  useEffect(() => {
    if (userList) {
      setUserListData((prev) => [...prev, ...userList]);
      setIsMore(userList.length >= 6);
    }
  }, [userList]);

  useEffect(() => {
    getUserListSearch();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
      getUserListSearch(searchQuery);
    }
  }, []);

  return (
    <div className={classes.container}>
      <h4 className={classes.title}>
        <FormattedMessage id="explore" />
      </h4>
      <div className={classes.searchContainer}>
        <div className={classes.debounce}>
          <div className={classes.resetInput}>
            <input
              type="text"
              className={classes.input}
              value={search}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <ClearIcon
                onClick={() => {
                  getUserListFromApi();
                  setSearch('');
                  setSearchParams({});
                }}
                className={classes.reset}
              />
            )}
          </div>
          <Button variant="contained" onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </div>
      </div>
      <div className={classes['card-container']}>
        {userListData.map((data) => (
          <CardPeople key={data.id} data={data} handleFollow={handleFollow} />
        ))}
      </div>

      {(isMore && (
        <div onClick={handleLoadMore} className={classes.expand}>
          <button type="button">
            <ExpandMoreIcon />
          </button>
        </div>
      )) ||
        (userList.length === 0 && null) || (
          <a href="#top" className={classes.expand}>
            <button type="button">
              <VerticalAlignTopIcon />
            </button>
          </a>
        )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

People.propTypes = {
  userList: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  userList: selectUserList,
});

export default connect(mapStateToProps)(People);
