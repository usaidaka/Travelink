import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SearchField from './components/SearchField';
import classes from './style.module.scss';

const Maps = ({ setSearchResult }) => {
  const [currentLocation, setCurrentLocation] = useState([]);

  const position = !_.isEmpty(currentLocation) ? currentLocation : [-6.224269936812463, 106.84171813081441];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((current) => {
      setCurrentLocation([current.coords.latitude, current.coords.longitude]);
    });
  }, []);

  const handleSearchResult = (result) => {
    setSearchResult(result);
  };

  return (
    <MapContainer center={position} zoom={50} scrollWheelZoom={false} className={classes.maps}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchField onSearchResult={handleSearchResult} />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

Maps.propTypes = {
  setSearchResult: PropTypes.func,
};
export default Maps;
