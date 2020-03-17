package org.egov.infra.microservice.models;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RemittanceSearcCriteria {
    private List<String> ids;
    private List<String> referenceNumbers;
    private Long fromDate;
    private Long toDate;
    private String voucherHeader;
    private String function;
    private String fund;
    private String remarks;
    private String reasonForDelay;
    private String status;
    private String bankaccount;
    @NotNull
    private String tenantId;
    private String sortBy;
    private String sortOrder;
    private Integer pageSize;
    private Integer limit;
    private Integer offset;
}
