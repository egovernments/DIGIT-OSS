package org.egov.infra.microservice.models;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.SafeHtml;

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
    @SafeHtml
    private String voucherHeader;
    @SafeHtml
    private String function;
    @SafeHtml
    private String fund;
    @SafeHtml
    private String remarks;
    @SafeHtml
    private String reasonForDelay;
    @SafeHtml
    private String status;
    @SafeHtml
    private String bankaccount;
    @SafeHtml
    @NotNull
    private String tenantId;
    @SafeHtml
    private String sortBy;
    @SafeHtml
    private String sortOrder;
    private Integer pageSize;
    private Integer limit;
    private Integer offset;
}
