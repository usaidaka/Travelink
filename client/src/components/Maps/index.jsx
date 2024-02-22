import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';

import SearchField from './components/SearchField';
import classes from './style.module.scss';

const Maps = ({ center = [-6.224269936812463, 106.84171813081441], marker, setSearchResult, zoom = 50 }) => {
  const handleSearchResult = (result) => {
    setSearchResult(result);
  };

  console.log(marker);

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className={classes.maps}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchField onSearchResult={handleSearchResult} />
      {marker ? (
        marker.map((pin) => (
          <Marker key={pin.id} position={pin.position}>
            <Popup>
              <span>{pin.province}</span>, <span>{pin.city}</span>
            </Popup>
          </Marker>
        ))
      ) : (
        <Marker position={center}>
          <Popup>Current Position</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

Maps.propTypes = {
  setSearchResult: PropTypes.func,
  zoom: PropTypes.number,
  center: PropTypes.array,
  marker: PropTypes.array,
};
export default Maps;
