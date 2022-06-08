import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Polygon, InfoWindow, Marker } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import _ from 'lodash';

const GisMapView = _.flowRight(withScriptjs, withGoogleMap)(props => {
  const onPolygonClick = (e, ward) => {
    if (!ward.name) {
      props.closeInfoWindow();
      return;
    }

    let boundaryDetails = {
      latLng: { lat: e.latLng.lat(), lng: e.latLng.lng() },
      boundaryCode: ward.boundaryCode,
    };
    props.openInfoWindow(boundaryDetails);
  };

  let markerWithInfoWindow;

  if (props.boundaryInfoWindowOpened) {
    let ward = _.find(props.wardsPolygons, function(w) {
      return w.boundaryCode == props.boundaryInfoWindowOpened.boundaryCode;
    });
    if (ward) {
      markerWithInfoWindow = (
        <Marker position={props.boundaryInfoWindowOpened.latLng} onClick={props.closeInfoWindow}>
          <InfoWindow onCloseClick={props.closeInfoWindow}>
            <div style={{ paddingTop: 5, paddingBottom: 5 }}>
              <div style={{ padding: 5, fontWeight: 'bold' }}>Ward Name : {ward.name}</div>
              <div style={{ padding: 5, fontWeight: 'bold' }}>No. Of Complaints : {ward.noOfComplaints}</div>
            </div>
          </InfoWindow>
        </Marker>
      );
    }
  }

  const renderPolygons =
    props.wardsPolygons &&
    props.wardsPolygons.map(ward => {
      return ward.polygons.map((polygon, idx) => {
        onPolygonClick.bind(this, ward.boundaryCode);

        return <Polygon key={idx} onClick={e => onPolygonClick(e, ward)} options={ward.style} paths={polygon} />;
      });
    });

  // let zoomLevel = markerWithInfoWindow ? 15 : 12;
  // let center = markerWithInfoWindow ? props.boundaryInfoWindowOpened.latLng : props.center;

  return (
    <GoogleMap ref={props.onMapMounted} defaultZoom={12} center={props.center || null}>
      {props.wardsPolygons && renderPolygons}
      {markerWithInfoWindow}
    </GoogleMap>
  );
});

export default GisMapView;
