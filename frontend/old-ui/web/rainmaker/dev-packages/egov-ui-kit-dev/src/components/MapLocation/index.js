import React from "react";
import _ from "lodash";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import "./index.css";
import Icon from "../Icon";
import commonConfig from "config/common";
import Label from "egov-ui-kit/utils/translationNode";

const styles = [
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#d6e2e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#cfd4d5",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#7492a8",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [
      {
        lightness: 25,
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#dde2e3",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#cfd4d5",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#dde2e3",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#7492a8",
      },
    ],
  },
  {
    featureType: "landscape.natural.terrain",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#dde2e3",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#588ca4",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [
      {
        saturation: -100,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a9de83",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#bae6a1",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#c6e8b3",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#bae6a1",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#41626b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        saturation: -45,
      },
      {
        lightness: 10,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#c1d1d6",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#a6b5bb",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#9fb6bd",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [
      {
        saturation: -70,
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b4cbd4",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#588ca4",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#008cb5",
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "transit.station.airport",
    elementType: "geometry.fill",
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: -5,
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a6cbe3",
      },
    ],
  },
];

const { compose, withProps, lifecycle, withStateHandlers } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, Marker } = require("react-google-maps");

const MapLocation = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${commonConfig.MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="map-container" />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 12.972442, lng: 77.580643 },
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        markers: [],
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
            lat: refs.map.getCenter().lat(),
            lng: refs.map.getCenter().lng(),
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
        onSearchBoxMounted: (ref) => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();

          places.forEach((place) => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map((place) => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, "0.position", this.state.center);
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          refs.map.fitBounds(bounds);
        },
      });
    },
  }),
  withStateHandlers(
    () => ({
      isOpen: false,
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      }),
    }
  ),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={18}
    center={props.currLoc ? props.currLoc : props.center}
    onBoundsChanged={props.onBoundsChanged}
    draggable={true}
    defaultOptions={{
      styles,
    }}
  >
    <div className="search-icon">
      <Icon
        id="searchIcon"
        style={{
          height: 24,
          width: 24,
          color: "#484848",
        }}
        action="action"
        name={"search"}
      />
    </div>
    <div className="myLoc">
      <Icon
        id="my-location"
        style={{
          background: "#969696",
          borderRadius: "50%",
          padding: "12px",
          height: 55,
          width: 55,
          color: "rgb(255, 255, 255)",
        }}
        action="maps"
        name={"my-location"}
        onClick={props.getMyLoc}
      />
    </div>
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input type="text" className="searchBoxStyles" placeholder="Search address" style={props.searchBoxStyles} />
    </SearchBox>

    {props.markers.length > 0 ? (
      props.markers.map((marker, index) => {
        return (
          <div>
            <div className="markerInfoBox">
              <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.8700000047683716)",
                  textAlign: "center",
                  padding: "7px 10px",
                }}
              >
                <div style={{ color: "#fff" }}>
                  <Label buttonLabel={true} label="CS_MAP_MOVE_PIN" />
                </div>
              </div>
              <div
                style={{
                  width: "0px",
                  height: "0px",
                  left: 0,
                  right: 0,
                  margin: "auto",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "15px solid rgba(0, 0, 0, 0.87)",
                  position: "absolute",
                }}
              />
            </div>
            <Marker key={index} position={props.center} draggable={false} icon={props.icon} />;
          </div>
        );
      })
    ) : (
      <div>
        <div className="markerInfoBox">
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8700000047683716)",
              textAlign: "center",
              padding: "7px 10px",
            }}
          >
            <div style={{ color: "#fff" }}>
              <Label buttonLabel={true} label="CS_MAP_MOVE_PIN" />
            </div>
          </div>
          <div
            style={{
              width: "0px",
              height: "0px",
              left: 0,
              right: 0,
              margin: "auto",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "15px solid rgba(0, 0, 0, 0.87)",
              position: "absolute",
            }}
          />
        </div>
        <Marker
          position={props.viewLocation ? props.currLoc : props.center}
          icon={props.icon}
          draggable={false}
          animation={window.google.maps.Animation.DROP}
        />
      </div>
    )}
    {props.setLocation && props.setLocation(props.lat, props.lng)}
  </GoogleMap>
));

export default MapLocation;
