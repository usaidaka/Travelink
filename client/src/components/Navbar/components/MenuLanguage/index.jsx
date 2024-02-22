import { Avatar, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const MenuLanguage = ({ open, anchorEl, onClose, onSelectLang, locale }) => (
  <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
    <MenuItem onClick={() => onSelectLang('id')} selected={locale === 'id'}>
      <div className={classes.menu}>
        <Avatar className={classes.menuAvatar} src="/id.png" />
        <div className={classes.menuLang}>
          <FormattedMessage id="app_lang_id" />
        </div>
      </div>
    </MenuItem>
    <MenuItem onClick={() => onSelectLang('en')} selected={locale === 'en'}>
      <div className={classes.menu}>
        <Avatar className={classes.menuAvatar} src="/en.png" />
        <div className={classes.menuLang}>
          <FormattedMessage id="app_lang_en" />
        </div>
      </div>
    </MenuItem>
  </Menu>
);

MenuLanguage.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.func,
  onClose: PropTypes.func,
  onSelectLang: PropTypes.func,
  locale: PropTypes.string,
};

export default MenuLanguage;
