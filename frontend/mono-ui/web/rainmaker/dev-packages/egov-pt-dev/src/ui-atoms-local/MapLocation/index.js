import React from "react";
import get from "lodash/get";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import "./index.scss";
// import Icon from "../Icon";
// import commonConfig from "config/common";
import { Icon } from "egov-ui-framework/ui-atoms";
import commonConfig from "config/common.js";


const {
  compose,
  withProps,
  lifecycle,
  withStateHandlers
} = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} = require("react-google-maps");

const MapLocation = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${commonConfig.MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="map-container" />,
    mapElement: <div style={{ height: `100%` }} />
    // center: { lat: 30.7333, lng: 76.7794 }
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
            lat: refs.map.getCenter().lat(),
            lng: refs.map.getCenter().lng()
          });
          // var geocoder = new window.google.maps.Geocoder();
          // geocoder.geocode({ location: { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {
          //   if (status === "OK") {
          //     if (results[0]) {
          //       this.setState({
          //         address: results[0].formatted_address,
          //       });
          //     }
          //   }
          // });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }));
          const nextCenter = get(nextMarkers, "0.position", this.state.center);
          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
          refs.map.fitBounds(bounds);
        }
      });
    }
  }),
  withStateHandlers(
    () => ({
      isOpen: false
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen
      })
    }
  ),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={13}
    center={props.currLoc ? props.currLoc : props.center}
    onBoundsChanged={props.onBoundsChanged}
    draggable={true}
  >
    <div className="search-icon">
      <Icon
        id="searchIcon"
        style={{
          height: 24,
          width: 24,
          color: "#484848"
        }}
        action="action"
        iconName={"search"}
      />
    </div>
    <div className="myLoc">
      <Icon
        id="my-location"
        style={{
          background: "#969696",
          borderRadius: "50%",
          padding: "12px",
          color: "rgb(255, 255, 255)"
        }}
        action="maps"
        iconName={"gps_fixed"}
        onClick={props.getMyLoc}
      />
    </div>
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        className="searchBoxStyles"
        placeholder="Search address"
        style={props.searchBoxStyles}
      />
    </SearchBox>

    {props.markers.length > 0 ? (
      props.markers.map((marker, index) => {
        return (
          <Marker
            key={index}
            position={props.center}
            draggable={false}
            icon={props.icon}
          />
        );
      })
    ) : (
      <Marker
        position={props.viewLocation ? props.currLoc : props.center}
        icon={props.icon}
        draggable={false}
        animation={window.google.maps.Animation.DROP}
      />
    )}
    {props.setLocation && props.setLocation(props.lat, props.lng)}
  </GoogleMap>
));

export default MapLocation;
