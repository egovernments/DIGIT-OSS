import React, { useEffect } from "react";
import { SearchIconSvg } from "./svgindex";
import { Loader } from "@googlemaps/js-api-loader";

let defaultBounds = {};

const updateDefaultBounds = (center) => {
  if (!center.lat || !center.lng) {
    return;
  }
  defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };
};
const GetPinCode = (places) => {
  let postalCode = null;
  places?.address_components?.forEach((place) => {
    let hasPostalCode = place.types.includes("postal_code");
    postalCode = hasPostalCode ? place.long_name : null;
  });
  return postalCode;
};

const getName = (places) => {
  let name = "";
  places?.address_components?.forEach((place) => {
    let hasName = place.types.includes("sublocality_level_2") || place.types.includes("sublocality_level_1");
    if (hasName) {
      name = hasName ? place.long_name : null;
    }
  });
  return name;
};

const loadGoogleMaps = (callback) => {
  const key = globalConfigs?.getConfig("GMAPS_API_KEY");
  const loader = new Loader({
    apiKey: key,
    version: "weekly",
    libraries: ["places"],
  });

  loader
    .load()
    .then(() => {
      if (callback) callback();
    })
    .catch((e) => {
      // do something
    });
};

const mapStyles = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

const setLocationText = (location, onChange, isPlaceRequired=false) => {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    {
      location,
    },
    function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          let pincode = GetPinCode(results[0]);
          const infoWindowContent = document.getElementById("pac-input");
          infoWindowContent.value = getName(results[0]);
          if (onChange) {
            if(isPlaceRequired)
            onChange(pincode, { longitude: location.lng, latitude: location.lat }, infoWindowContent.value);
            else
            onChange(pincode, { longitude: location.lng, latitude: location.lat });
          }
        }
      }
    }
  );
};

const onMarkerDragged = (marker, onChange, isPlaceRequired = false) => {
  if (!marker) return;
  const { latLng } = marker;
  const currLat = latLng.lat();
  const currLang = latLng.lng();
  const location = {
    lat: currLat,
    lng: currLang,
  };
  if(isPlaceRequired)
  setLocationText(location, onChange, true);
  else
  setLocationText(location, onChange);
};

const initAutocomplete = (onChange, position, isPlaceRequired=false) => {
  const map = new window.google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: 15,
    mapTypeId: "roadmap",
    styles: mapStyles,
  }); // Create the search box and link it to the UI element.

  const input = document.getElementById("pac-input");
  updateDefaultBounds(position);
  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "in" },
    fields: ["address_components", "geometry", "icon", "name"],
    origin: position,
    strictBounds: false,
    types: ["address"],
  };
  const searchBox = new window.google.maps.places.Autocomplete(input, options);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); // Bias the SearchBox results towards current map's viewport.

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [
    new window.google.maps.Marker({
      map,
      title: "a",
      position: position,
      draggable: true,
      clickable: true,
    }),
  ];

  if(isPlaceRequired)
  setLocationText(position, onChange,true);
  else
  setLocationText(position, onChange);

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  markers[0].addListener("dragend", (marker) => onMarkerDragged(marker, onChange, isPlaceRequired));
  searchBox.addListener("place_changed", () => {
    const place = searchBox.getPlace();

    if (!place) {
      return;
    } // Clear out the old markers.
    let pincode = GetPinCode(place);
    if (pincode) {
      const { geometry } = place;
      const geoLocation = {
        latitude: geometry.location.lat(),
        longitude: geometry.location.lng(),
      };
      if(isPlaceRequired)
      onChange(pincode, geoLocation, place.name);
      else
      onChange(pincode, geoLocation);
    }
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = []; // For each place, get the icon, name and location.

    const bounds = new window.google.maps.LatLngBounds();
    if (!place.geometry) {
      return;
    }

    markers.push(
      new window.google.maps.Marker({
        map,
        title: place.name,
        position: place.geometry.location,
        draggable: true,
        clickable: true,
      })
    );
    markers[0].addListener("dragend", (marker) => onMarkerDragged(marker, onChange, isPlaceRequired));
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
};

const LocationSearch = (props) => {
  useEffect(() => {
    async function mapScriptCall() {
      const getLatLng = (position) => {
        initAutocomplete(props.onChange, { lat: position.coords.latitude, lng: position.coords.longitude }, props.isPlaceRequired);
      };
      const getLatLngError = (error) => {
        let defaultLatLong = {};
        if (props?.isPTDefault) {
          defaultLatLong = props?.PTdefaultcoord?.defaultConfig || { lat: 31.6160638, lng: 74.8978579 };
        } else {
          defaultLatLong = {
            lat: 31.6160638,
            lng: 74.8978579,
          };
        }
        initAutocomplete(props.onChange, defaultLatLong, props.isPlaceRequired);
      };

      const initMaps = () => {
        if (props.position?.latitude && props.position?.longitude) {
          getLatLng({ coords: props.position });
        } else if (navigator?.geolocation) {
          navigator.geolocation.getCurrentPosition(getLatLng, getLatLngError);
        } else {
          getLatLngError();
        }
      };

      loadGoogleMaps(initMaps);
    }
    mapScriptCall();
  }, []);

  return (
    <div className="map-wrap">
      <div className="map-search-bar-wrap">
        {/* <img src={searchicon} className="map-search-bar-icon" alt=""/> */}
        <SearchIconSvg className="map-search-bar-icon" />
        <input id="pac-input" className="map-search-bar" type="text" placeholder="Search Address"  style={{backgroundPosition: "left"}}/>
      </div>
      <div id="map" className="map"></div>
    </div>
  );
};

export default LocationSearch;
