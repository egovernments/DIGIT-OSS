package org.egov.tenant.domain.model;

import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CityTest {

    @Test
    public void test_should_return_false_when_name_is_not_present() {
        City city = City.builder()
            .name(null)
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .tenantCode("tenantcode")
            .ulbGrade("municipality")
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .code("code")
            .build();

        assertThat(city.isValid()).isFalse();
        assertThat(city.isNameAbsent()).isTrue();
    }

    @Test
    public void test_validity_should_return_false_when_ulb_grade_is_not_present() {
        City city = City.builder()
            .name("city name")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .tenantCode("tenantcode")
            .ulbGrade(null)
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .code("code")
            .build();

        assertThat(city.isValid()).isFalse();
        assertThat(city.isULBGradeAbsent()).isTrue();
    }

    @Test
    public void test_should_return_true_when_required_fields_are_present() throws Exception {
        City city = City.builder()
            .name("Bengaluru")
            .ulbGrade("municipality")
            .build();

        assertThat(city.isValid()).isTrue();
        assertThat(city.isNameAbsent()).isFalse();
        assertThat(city.isULBGradeAbsent()).isFalse();
    }
}