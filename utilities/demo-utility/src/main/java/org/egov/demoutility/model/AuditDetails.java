package org.egov.demoutility.model;

import lombok.*;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@AllArgsConstructor
@Builder
@Getter
@NoArgsConstructor
@Setter
@ToString
@JsonIgnoreProperties
public class AuditDetails {

    private String createdBy;

    private Long createdDate;

    private String lastModifiedBy;

    private Long lastModifiedDate;
    
    private Long createdTime;
    
    private Long lastModifiedTime;


}