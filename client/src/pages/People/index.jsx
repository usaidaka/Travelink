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
import decryptPayload from '@utils/decryptionHelper';
import _ from 'lodash';

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

  /* CODE BARU */

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(userList)) {
      const decryptedData = decryptPayload(userList);
      setUserListData((prev) => [...prev, ...decryptedData]);
      setIsMore(decryptedData.length >= 6);
    }
  }, [userList]);

  const getUserListSearch = (query, nextLoad) => {
    if (query) {
      setSearchParams({ username: query });
    } else {
      setSearchParams({});
    }
    dispatch(getUserList({ ...(query !== '' && { username: query, next: nextLoad, limit: 6 }) }));
  };

  const getUserListFromApi = () => {
    dispatch(getUserList());
  };

  const handleSearch = () => {
    setUserListData([]);
    getUserListSearch(search);
  };

  const handleLoadMore = () => {
    setNext((prev) => {
      getUserListSearch(null, prev + 6);
      return prev + 6;
    });
  };

  useEffect(() => {
    setUserListData([]);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, []);

  const handleFollow = (followTo) => {
    dispatch(
      doFollow(followTo, (message) => {
        toast.success(message, { duration: 1000 });
        if (search) {
          handleSearch();
        } else {
          setNext(0);
        }
      })
    );
  };

  // ===========================

  return (
    <div data-testid="people" className={classes.container}>
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
                  setUserListData([]);
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
        {!_.isEmpty(userListData) &&
          userListData?.map((data) => <CardPeople key={data.id} data={data} handleFollow={handleFollow} />)}
      </div>

      {(isMore && (
        <div onClick={handleLoadMore} className={classes.expand}>
          <button type="button">
            <ExpandMoreIcon />
          </button>
        </div>
      )) ||
        (userListData.length === 0 && null) || (
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
  userList: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  userList: selectUserList,
});

export default connect(mapStateToProps)(People);
