import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';

const MapComponent = ({kmlData}) => {

    const handleApiLoaded = (map, maps) => {
        // Load KML data onto the map
        const kmlLayer = new maps.KmlLayer({
          url: kmlData,
          map: map,
        });
      };


    return (
        <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDArDwCVzA1KU4wJSmmuedl1bZ4ojXSoag' }}
            defaultCenter={{ lat: 0, lng: 0 }}
            defaultZoom={1}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          />
        </div>
      );
}

export default MapComponent;