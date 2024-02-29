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
  console.log(userList);

  const [next, setNext] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('username');

  const [decryptedUserList, setDecrytedUserList] = useState({});
  const [userListData, setUserListData] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [search, setSearch] = useState('');

  const getUserListSearch = (query) => {
    if (query) {
      setSearchParams({ username: query });
    } else {
      setSearchParams({});
    }
    dispatch(getUserList({ ...(query !== '' && { username: query, next, limit: 6 }) }));
  };

  const getUserListFromApi = () => {
    dispatch(getUserList());
  };

  const handleSearch = () => {
    setUserListData([]);
    getUserListSearch(search);
  };

  const handleLoadMore = () => {
    setNext((prev) => prev + 6);
    getUserListSearch();
  };

  useEffect(() => {
    if (!_.isEmpty(userList)) {
      setDecrytedUserList(decryptPayload(userList));
    }
  }, [userList]);

  useEffect(() => {
    if (!_.isEmpty(decryptedUserList)) {
      setUserListData((prev) => [...prev, ...decryptedUserList]);
      setIsMore(decryptedUserList.length >= 6);
    }
  }, [decryptedUserList]);

  useEffect(() => {
    getUserListSearch();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
      getUserListSearch(searchQuery);
    }
  }, []);

  const handleFollow = (followTo) => {
    dispatch(
      doFollow(followTo, (message) => {
        toast.success(message, { duration: 1000 });
        if (search) {
          handleSearch();
        } else {
          getUserListFromApi();
          setUserListData([]);
        }
      })
    );
  };

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
        {!_.isEmpty(decryptedUserList) &&
          userListData?.map((data) => <CardPeople key={data.id} data={data} handleFollow={handleFollow} />)}
      </div>

      {(isMore && (
        <div onClick={handleLoadMore} className={classes.expand}>
          <button type="button">
            <ExpandMoreIcon />
          </button>
        </div>
      )) ||
        (decryptedUserList.length === 0 && null) || (
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
