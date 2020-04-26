package org.egov.infra.microservice.models;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
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
}
