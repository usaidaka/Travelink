import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { selectUserRoute } from '@pages/Trip/selectors';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Carousel from 'react-material-ui-carousel';
import CardMarker from '@pages/AdminDashboard/components/CardMarker';
import CardNearby from '@pages/NearbyCurrent/components/CardNearby';

import CardDestination from '@pages/Destination/components/CardDestination';

import SearchField from './components/SearchField';
import classes from './style.module.scss';

const Maps = ({
  handleDeleteDestination = () => {},
  isSearch = true,
  element,
  center = [-6.224269936812463, 106.84171813081441],
  marker,
  setSearchResult,
  setClickedPosition,
  valueSearch,
  setValueSearch,
  zoom = 50,
}) => {
  let renderedMarker;

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
      console.log(marker);
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
                    <Link to={`/profile/${pin?.user_id}`}>
                      <FormattedMessage id="goToProfile" />
                    </Link>
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ));

      break;
    case 'People':
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

    case 'Destination':
      console.log(marker);
      renderedMarker =
        !_.isEmpty(marker) &&
        marker?.map((pin) => (
          <Marker key={pin.id} position={[pin?.latitude, pin?.longitude]}>
            <Popup>
              <CardDestination pin={pin} handleDeleteDestination={handleDeleteDestination} />
            </Popup>
          </Marker>
        ));
      break;

    case 'DestinationRecommendation':
      console.log(marker);
      renderedMarker =
        !_.isEmpty(marker) &&
        marker?.map((pin) => (
          <Marker key={pin.id} position={[pin?.latitude, pin?.longitude]}>
            <Popup>
              <CardDestination pin={pin} />
            </Popup>
          </Marker>
        ));
      break;

    case 'EditDestination':
      console.log(marker);
      renderedMarker = !_.isEmpty(marker) && (
        <Marker position={[marker?.latitude, marker?.longitude]}>
          <Popup>
            <div className={classes['container-destination']}>
              <div className={classes['image-container']}>
                <Carousel>
                  {marker.ImageDestinations.map((src, idx) => (
                    <img key={idx} src={src.image} alt="" />
                  ))}
                </Carousel>
              </div>
              <div className={classes.information}>
                <div className={classes.region}>
                  <span>{marker.Province.name}</span>, <span>{marker.City.name}</span>
                </div>
                <div className={classes.text}>
                  <div className={classes.detail}>
                    <span className={classes.label}>
                      <FormattedMessage id="detail" />
                    </span>
                    <span>{marker.detail}</span>
                  </div>
                  <div className={classes.desc}>
                    <span className={classes.label}>
                      <FormattedMessage id="description" />
                    </span>
                    <span>{marker.description}</span>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      );
      break;

    case 'RegisterDestination':
      console.log(marker);
      console.log(valueSearch);
      renderedMarker = !_.isEmpty(marker) && (
        <Marker position={[marker?.lat, marker?.lng]}>
          <Popup>
            <p>{valueSearch.label}</p>
          </Popup>
        </Marker>
      );
      break;

    case 'UnRoute':
      renderedMarker = !_.isEmpty(marker) && (
        <Marker position={marker}>
          <Popup>Current Position</Popup>
        </Marker>
      );
      break;

    case 'Dashboard':
      console.log(marker);
      renderedMarker =
        !_.isEmpty(marker) &&
        marker.map((mark, idx) => (
          <Marker key={idx} position={mark.location}>
            <Popup>
              <CardMarker mark={mark} />
            </Popup>
          </Marker>
        ));
      break;

    case 'nearby':
      console.log(marker);
      renderedMarker =
        !_.isEmpty(marker) &&
        marker.map((mark, idx) => (
          <Marker key={idx} position={mark.current_position}>
            <Popup>
              <CardNearby mark={mark} />
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
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup chunkedLoading>
        {isSearch && (
          <SearchField
            isSearch={isSearch}
            onSearchResult={handleSearchResult}
            setClickedPosition={setClickedPosition}
            setValueSearch={setValueSearch}
          />
        )}

        {renderedMarker}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

Maps.propTypes = {
  handleDeleteDestination: PropTypes.func,
  valueSearch: PropTypes.object,
  setValueSearch: PropTypes.func,
  element: PropTypes.string,
  setSearchResult: PropTypes.func,
  zoom: PropTypes.number,
  center: PropTypes.array,
  isSearch: PropTypes.bool,
  marker: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setClickedPosition: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  location: selectUserRoute,
});

export default connect(mapStateToProps)(Maps);
