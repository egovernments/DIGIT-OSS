package org.egov.tenant.web.contract;

import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CityTest {

    @Test
    public void test_should_convert_from_contract_to_domain() {
        City cityContract = City.builder()
            .name("Bengaluru")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();

        org.egov.tenant.domain.model.City expectedCityModel = org.egov.tenant.domain.model.City.builder()
            .name("Bengaluru")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();


        org.egov.tenant.domain.model.City domain = cityContract.toDomain();

        assertThat(domain).isEqualTo(expectedCityModel);
    }

    @Test
    public void test_should_convert_from_domain_to_contract() throws Exception {
        org.egov.tenant.domain.model.City cityModel = org.egov.tenant.domain.model.City.builder()
            .name("Bengaluru")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();

        City cityContract = new City(cityModel);

        assertThat(cityContract.getName()).isEqualTo("Bengaluru");
        assertThat(cityContract.getLocalName()).isEqualTo("localname");
        assertThat(cityContract.getDistrictCode()).isEqualTo("districtcode");
        assertThat(cityContract.getDistrictName()).isEqualTo("districtname");
        assertThat(cityContract.getRegionName()).isEqualTo("regionname");
        assertThat(cityContract.getLongitude()).isEqualTo(35.456);
        assertThat(cityContract.getLatitude()).isEqualTo(75.443);
        assertThat(cityContract.getShapeFileLocation()).isEqualTo("shapeFileLocation");
        assertThat(cityContract.getCaptcha()).isEqualTo("captcha");
    }
}