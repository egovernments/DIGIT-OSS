package org.egov.boundary.domain.service;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.InvalidRequestException;
import com.google.maps.model.AddressComponent;
import com.google.maps.model.AddressComponentType;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import org.egov.boundary.domain.model.Location;
import org.egov.boundary.util.BoundaryConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class GoogleLocationService {

    private static final Logger LOG = LoggerFactory.getLogger(GoogleLocationService.class);
    private static final String API_KEY = BoundaryConstants.GMAPS_API_KEY;
    private static final GeoApiContext gtx = new GeoApiContext.Builder()
            .apiKey(API_KEY)
            .build();

    /**
     * Reverse geocode using Google Location Service
     * Parse the response and construct a corresponding Location object
     *
     * @param lat Latitude
     * @param lng Longitude
     * @return Location Object if exists, else empty.
     */
    public Optional<Location> reverseGeoCode(double lat, double lng) {

        try {
            GeocodingResult[] gResp = GeocodingApi.newRequest(gtx).latlng(new LatLng(lat, lng)).region("IN")
                    .await();


            Location location = new Location();
            for (AddressComponent addressComponent : gResp[0].addressComponents) {
                List<AddressComponentType> addressComponentTypes = Arrays.asList(addressComponent.types);

                if (addressComponentTypes.contains(AddressComponentType.COUNTRY))
                    location.setCountry(addressComponent.longName);
                else if (addressComponentTypes.contains(AddressComponentType.ADMINISTRATIVE_AREA_LEVEL_1))
                    location.setState(addressComponent.longName);
                else if (addressComponentTypes.contains(AddressComponentType.ADMINISTRATIVE_AREA_LEVEL_2))
                    location.setDistrict(addressComponent.longName);
                else if (addressComponentTypes.contains(AddressComponentType.LOCALITY))
                    location.setCity(addressComponent.longName);
                else if (addressComponentTypes.contains(AddressComponentType.POSTAL_CODE))
                    location.setPostalCode(addressComponent.longName);
            }

            return Optional.of(location);

        } catch (InvalidRequestException e) {
            LOG.error("Invalid latitude longitude pair provided. ");
            return Optional.empty();
        } catch (Exception e) {
            LOG.error("Unable to reverse geocode");
            return Optional.empty();
        }
    }

}
