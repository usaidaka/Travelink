import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import './style.css';
import 'leaflet-geosearch/dist/geosearch.css';

const SearchField = ({ onSearchResult }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const provider = new OpenStreetMapProvider();
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      autoComplete: true,
      autoClose: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (data) => {
      onSearchResult(data.location);
    });
    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onSearchResult, provider]);

  return null;
};

SearchField.propTypes = {
  onSearchResult: PropTypes.func,
};

export default SearchField;
