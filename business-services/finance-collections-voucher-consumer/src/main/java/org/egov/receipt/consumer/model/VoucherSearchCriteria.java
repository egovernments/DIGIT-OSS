package org.egov.receipt.consumer.model;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoucherSearchCriteria {
    private Set<Long> ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    private Set<String> voucherNumbers;
    private Long voucherFromDate;
    private Long voucherToDate;
    private String voucherType;
    private String voucherName;
    private String fundId;
    private String deptCode;
    private String tenantId;
}
