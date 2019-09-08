package org.egov.access.domain.criteria;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class ValidateActionCriteria {
    private List<String> roleNames;
    private String tenantId;
    private String actionUrl;
}
