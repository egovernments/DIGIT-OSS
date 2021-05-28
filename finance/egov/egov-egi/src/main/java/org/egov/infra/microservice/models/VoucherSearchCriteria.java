package org.egov.infra.microservice.models;

import java.util.Set;

import org.hibernate.validator.constraints.SafeHtml;

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
    @SafeHtml
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    private Set<String> voucherNumbers;
    private Long voucherFromDate;
    private Long voucherToDate;
    @SafeHtml
    private String voucherType;
    @SafeHtml
    private String voucherName;
    @SafeHtml
    private String fundId;
    @SafeHtml
    private String deptCode;
}
