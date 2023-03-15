package org.egov.commons.model;

import lombok.*;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Setter
public class DepartmentCriteria {
    private String departmentName;

    private Boolean active;

    private List<Long> ids;

    private String tenantId;

    private String sortBy;

    private String sortOrder;

}

