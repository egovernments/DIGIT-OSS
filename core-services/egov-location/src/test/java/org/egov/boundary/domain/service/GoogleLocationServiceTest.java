package org.egov.boundary.domain.service;

import org.egov.boundary.domain.model.Location;
import org.junit.Test;

import java.util.Optional;

import static junit.framework.TestCase.assertTrue;

public class GoogleLocationServiceTest {

    private final GoogleLocationService locationService = new GoogleLocationService();

    @Test
    public void reverseGeoCode() {
        double latitude = 16.56163928157282;
        double longitude = 81.99713218957186;
        String cityName = "Amalapuram";
        Optional<Location> location = locationService.reverseGeoCode(latitude, longitude);
        location.ifPresent(location1 -> assertTrue("Correct city is being returned", location1.getCity().equalsIgnoreCase(cityName)));
    }


    @Test
    public void reverseGeoCodeError() {
        double latitude = 1612.56163928157282;
        double longitude = 81.99713218957186;
        Optional<Location> location = locationService.reverseGeoCode(latitude, longitude);
        assertTrue("Empty is returned for invalid lat lng combination", !location.isPresent());
    }
}
