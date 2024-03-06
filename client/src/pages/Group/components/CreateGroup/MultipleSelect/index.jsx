import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getNearby } from '@pages/Home/actions';
import { selectNearby, selectProfile } from '@pages/Home/selectors';
import _ from 'lodash';
import decryptPayload from '@utils/decryptionHelper';
import { FormattedMessage } from 'react-intl';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const MultipleSelect = ({ setPersonName, personName, nearby, profile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [decryptedNearby, setDecryptedNearby] = useState([]);
  const [decryptedProfile, setDecryptedProfile] = useState({});

  const names = decryptedNearby.map((data) => data?.profile?.username);

  useEffect(() => {
    if (!_.isEmpty(nearby)) {
      setDecryptedNearby(decryptPayload(nearby));
    }
    if (!_.isEmpty(profile)) {
      setDecryptedProfile(decryptPayload(profile));
    }
  }, [nearby, profile]);

  useEffect(() => {
    dispatch(getNearby());
  }, [dispatch]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };
  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-chip-label" sx={{ width: 'fit-content' }}>
          <FormattedMessage id="inviteMember" />
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                console.log(value);
                return <Chip key={value} label={value} />;
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {decryptedNearby.map((data) => (
            <MenuItem
              key={data.id}
              name={data.id}
              value={data?.profile?.username}
              style={getStyles(names, personName, theme)}
              disabled={data.user_id === decryptedProfile.id}
            >
              {data?.profile?.username} {data.user_id === decryptedProfile.id && '(You)'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

MultipleSelect.propTypes = {
  setPersonName: PropTypes.func,
  personName: PropTypes.array,
  nearby: PropTypes.string,
  profile: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({ nearby: selectNearby, profile: selectProfile });

export default connect(mapStateToProps)(MultipleSelect);
