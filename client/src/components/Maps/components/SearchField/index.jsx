import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import './style.css';
import 'leaflet-geosearch/dist/geosearch.css';

const SearchField = ({ onSearchResult, setClickedPosition, isSearch, setValueSearch }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const provider = new OpenStreetMapProvider();
  const map = useMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onMapClick(e) {
    setClickedPosition(e.latlng);
  }
  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      autoComplete: true,
      autoClose: true,
      keepResult: true,
    });

    map.addControl(isSearch && searchControl);

    map.on('click', onMapClick);

    isSearch &&
      map.on('geosearch/showlocation', (data) => {
        onSearchResult({ lat: data.location.y, lng: data.location.x });
        setValueSearch(data.location);
      });
    return () => {
      map.removeControl(searchControl);
    };
  }, [isSearch, map, onMapClick, onSearchResult, provider]);

  return null;
};

SearchField.propTypes = {
  onSearchResult: PropTypes.func,
  setValueSearch: PropTypes.func,
  setClickedPosition: PropTypes.func,
  isSearch: PropTypes.bool,
};

export default SearchField;
