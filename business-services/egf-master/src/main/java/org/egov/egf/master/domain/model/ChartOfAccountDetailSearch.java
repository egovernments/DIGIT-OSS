package org.egov.egf.master.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ChartOfAccountDetailSearch extends ChartOfAccountDetail {
    private String ids;
    private String chartOfAccountIds;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
}