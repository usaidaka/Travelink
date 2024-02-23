import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectUserRoute } from '@pages/Trip/selectors';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import SearchField from './components/SearchField';
import classes from './style.module.scss';

const Maps = ({ element, center = [-6.224269936812463, 106.84171813081441], marker, setSearchResult, zoom = 50 }) => {
  let renderedMarker;
  console.log(marker);
  switch (element) {
    case 'Trip':
      renderedMarker =
        !_.isEmpty(marker) && !_.isEmpty(marker[0]?.position[0])
          ? marker.map((pin) => (
              <Marker key={pin.id} position={pin.position}>
                <Popup>
                  <span>{pin.province}</span>, <span>{pin.city}</span>
                </Popup>
              </Marker>
            ))
          : null;
      break;
    case 'SidebarRight':
      renderedMarker =
        !_.isEmpty(marker) &&
        marker.map((pin) => (
          <Marker key={pin.id} position={pin.current_position}>
            <Popup>
              <div className={classes['sidebar-right']}>
                <div className={classes['image-wrapper']}>
                  <img src={pin?.profile?.image} alt="" className={classes.image} />
                </div>
                <div className={classes.info}>
                  <span>@{pin?.profile?.username}</span>
                  <span>
                    <a href={`mailto: ${pin?.profile?.email}`}>{pin?.profile?.email}</a>
                  </span>
                  <span className={classes.wa}>
                    <a
                      target="_blank"
                      href={`https://api.whatsapp.com/send/?phone=${pin.profile?.phone}&text=Hi!%20${pin?.profile?.firstName},%20I%20got%20your%20phone%20number%20from%20Travelink.&type=phone_number&app_absent=0`}
                      rel="noreferrer"
                    >
                      {pin?.profile?.phone}
                    </a>
                  </span>

                  <span className={classes.profile}>
                    <Link to="/">
                      <FormattedMessage id="goToProfile" />
                    </Link>
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ));
      break;

    default:
      renderedMarker = (
        <Marker position={center}>
          <Popup>Current Position</Popup>
        </Marker>
      );
      break;
  }

  const handleSearchResult = (result) => {
    setSearchResult(result);
  };

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className={classes.maps}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchField onSearchResult={handleSearchResult} />

      {renderedMarker}
    </MapContainer>
  );
};

Maps.propTypes = {
  element: PropTypes.string,
  setSearchResult: PropTypes.func,
  zoom: PropTypes.number,
  center: PropTypes.array,
  marker: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

const mapStateToProps = createStructuredSelector({
  location: selectUserRoute,
});

export default connect(mapStateToProps)(Maps);
