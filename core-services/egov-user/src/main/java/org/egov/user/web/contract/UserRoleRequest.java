package org.egov.user.web.contract;

import lombok.Getter;

import java.util.Date;

@Getter
public class UserRoleRequest {

    private Long id;
    private String name;
    private String description;
    private Long createdBy;
    private Date createdDate;
    private Long lastModifiedBy;
    private Date lastModifiedDate;
    
}
