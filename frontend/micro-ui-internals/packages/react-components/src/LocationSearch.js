import React, { useEffect } from "react";
import { SearchIconSvg } from "./svgindex";

const GetPinCode = (places) => {
  console.log("Places addre component:", places.address_components);
  let postalCode = null;
  places.address_components.forEach((place) => {
    let hasPostalCode = place.types.includes("postal_code");
    postalCode = hasPostalCode ? place.long_name : null;
  });
  console.log("GetPinCode:", postalCode);
  return postalCode;
};

const LocationSearch = (props) => {
  useEffect(() => {
    const script = document.createElement("script");
    //AIzaSyCvzuo69lmgwc2XoqhACHcQhrGLALBUZAU
    const key = "AIzaSyCbVz7R7btwMPqVLnd7Pnhra_c62SJHYws";

    async function mapScriptCall() {
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initAutocomplete&libraries=places`;
      script.async = true;
      script.defer = true;

      window.initAutocomplete = function () {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: {
            lat: 28.5355,
            lng: 77.391,
          },
          zoom: 15,
          mapTypeId: "roadmap",
        }); // Create the search box and link it to the UI element.

        const input = document.getElementById("pac-input");
        const searchBox = new window.google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); // Bias the SearchBox results towards current map's viewport.

        map.addListener("bounds_changed", () => {
          searchBox.setBounds(map.getBounds());
        });
        let markers = []; // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.

        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();
          console.log("places", places);

          if (places.length === 0) {
            return;
          } // Clear out the old markers.
          let pincode = GetPinCode(places[0]);
          if (pincode) {
            props.onChange(pincode);
          }
          markers.forEach((marker) => {
            marker.setMap(null);
          });
          markers = []; // For each place, get the icon, name and location.

          const bounds = new window.google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }

            const icon = {
              url: place.icon,
              size: new window.google.maps.Size(71, 71),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(17, 34),
              scaledSize: new window.google.maps.Size(25, 25),
            }; // Create a marker for each place.

            markers.push(
              new window.google.maps.Marker({
                map,
                icon,
                title: place.name,
                position: place.geometry.location,
              })
            );
            console.log("place.geometry.location:", place.geometry.location);
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      };
    }
    mapScriptCall();

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="map-wrap">
      <div className="map-search-bar-wrap">
        {/* <img src={searchicon} className="map-search-bar-icon" alt=""/> */}
        <SearchIconSvg className="map-search-bar-icon" />
        <input id="pac-input" className="map-search-bar" type="text" placeholder="Search Address" />
      </div>
      <div id="map" className="map"></div>
    </div>
  );
};

export default LocationSearch;
