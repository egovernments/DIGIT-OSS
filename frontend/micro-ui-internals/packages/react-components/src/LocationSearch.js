import React, { useEffect } from "react";
import { SearchIconSvg } from "./svgindex";

const LocationSearch = (props) => {
  useEffect(() => {
    const script = document.createElement("script");

    async function mapScriptCall() {
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdKOqX6EPEX9djPm-vL_8zv0HBF8z0Qjg&callback=initAutocomplete&libraries=places";
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

          if (places.length === 0) {
            return;
          } // Clear out the old markers.

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
