package org.egov.tenant.persistence.entity;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class City {

    public static final String
        ID = "id",
        NAME = "name",
        LOCAL_NAME = "localname",
        DISTRICT_CODE = "districtcode",
        DISTRICT_NAME = "districtname",
        REGION_NAME = "regionname",
        LONGITUDE = "longitude",
        LATITUDE = "latitude",
        ULB_GRADE = "ulbgrade",
        TENANT_CODE = "tenantcode",
        CREATED_BY = "createdby",
        CREATED_DATE = "createddate",
        LAST_MODIFIED_BY = "lastmodifiedby",
        LAST_MODIFIED_DATE = "lastmodifieddate",
        SHAPEFILE_LOCATION = "shapefilelocation",
        CAPTCHA = "captcha",
        CODE = "code";
    
    
    
    
    private Long id;
    private String name;
    private String localName;
    private String districtCode;
    private String districtName;
    private String regionName;
    private Double longitude;
    private Double latitude;
    private String tenantCode;
    private String ULBGrade;
    private Long createdBy;
    private Date createdDate;
    private Long lastModifiedBy;
    private Date lastModifiedDate;
    private String shapeFileLocation;
    private String captcha;
    private String code;
  
    public org.egov.tenant.domain.model.City toDomain() {
        return org.egov.tenant.domain.model.City.builder()
            .id(id)
            .name(name)
            .localName(localName)
            .districtCode(districtCode)
            .districtName(districtName)
            .regionName(regionName)
            .longitude(longitude)
            .latitude(latitude)
            .tenantCode(tenantCode)
            .ulbGrade(ULBGrade)
            .createdBy(createdBy)
            .createdDate(createdDate)
            .lastModifiedBy(lastModifiedBy)
            .lastModifiedDate(lastModifiedDate)
            .shapeFileLocation(shapeFileLocation)
            .captcha(captcha)
            .code(code)
            .build();
    }
}
