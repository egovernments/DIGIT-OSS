package org.egov.hrms.model;

import lombok.*;

import javax.validation.constraints.NotNull;


@AllArgsConstructor
@Builder
@Getter
@NoArgsConstructor
@Setter
@ToString
public class AuditDetails {

    private String createdBy;

    private Long createdDate;

    private String lastModifiedBy;

    private Long lastModifiedDate;


}