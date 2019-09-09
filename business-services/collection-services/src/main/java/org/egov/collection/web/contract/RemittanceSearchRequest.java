package org.egov.collection.web.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class RemittanceSearchRequest {

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
