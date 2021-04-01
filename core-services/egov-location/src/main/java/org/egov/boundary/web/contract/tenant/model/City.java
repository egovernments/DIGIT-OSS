package org.egov.boundary.web.contract.tenant.model;


import lombok.*;

import java.util.Date;

import static org.springframework.util.ObjectUtils.isEmpty;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class City {

    private Long id;
    private String name;
    private String localName;
    private String districtCode;
    private String districtName;
    private String regionName;
    private Double longitude;
    private Double latitude;
    private String tenantCode;
    private String ulbGrade;
    private Long createdBy;
    private Date createdDate;
    private Long lastModifiedBy;
    private Date lastModifiedDate;
    private String shapeFileLocation;
    private String captcha;
    private String code;


    public boolean isValid() {
        return !isNameAbsent() && !isULBGradeAbsent();
    }

    public boolean isNameAbsent() {
        return isEmpty(name);
    }

    public boolean isULBGradeAbsent() {
        return isEmpty(ulbGrade);
    }
}
