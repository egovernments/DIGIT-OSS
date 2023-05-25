package org.egov.tenant.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class City {

    private String name;
    private String localName;
    private String districtCode;
    private String districtName;
    private String regionName;
    @JsonProperty("ulbGrade")
    private String ulbGrade;
    private Double longitude;
    private Double latitude;
    private String shapeFileLocation;
    private String captcha;
    private String code;
    
    

    public City(org.egov.tenant.domain.model.City city) {
        this.name = city.getName();
        this.localName = city.getLocalName();
        this.districtCode = city.getDistrictCode();
        this.districtName = city.getDistrictName();
        this.regionName = city.getRegionName();
        this.longitude = city.getLongitude();
        this.latitude = city.getLatitude();
        this.ulbGrade = city.getUlbGrade();
        this.shapeFileLocation= city.getShapeFileLocation();
        this.captcha = city.getCaptcha();
        this.code = city.getCode();
    }

    @JsonIgnore
    public org.egov.tenant.domain.model.City toDomain() {
        return org.egov.tenant.domain.model.City.builder()
            .name(name)
            .localName(localName)
            .districtCode(districtCode)
            .districtName(districtName)
            .ulbGrade(ulbGrade)
            .regionName(regionName)
            .longitude(longitude)
            .latitude(latitude)
            .shapeFileLocation(shapeFileLocation)
            .captcha(captcha)
            .code(code)
            .build();
    }
}
