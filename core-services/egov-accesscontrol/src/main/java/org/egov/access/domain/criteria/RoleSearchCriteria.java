package org.egov.access.domain.criteria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Builder
@Getter
@EqualsAndHashCode
public class RoleSearchCriteria {
    private List<String> codes;
    private String tenantId;
}
