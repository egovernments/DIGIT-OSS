package org.egov.dataupload.property.models;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@EqualsAndHashCode(of = "code")
public class Role {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Long createdBy;
    private Date createdDate;
    private Long lastModifiedBy;
    private Date lastModifiedDate;
    private String tenantId;

    public Role(){}

    public Role(Role role){
        this.setCode(role.getCode());
        this.setName(role.getName());
        this.setId(role.getId());
    }

}