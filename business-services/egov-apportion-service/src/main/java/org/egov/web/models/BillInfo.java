package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * BillInfo
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2019-02-25T15:07:36.183+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillInfo {
    // TODO some of the fields are mandatory in yml, lets discuss billdetail and billaccountdetail also for more clarity

    @JsonProperty("id")
    private String id = null;

    @JsonProperty("mobileNumber")
    private String mobileNumber = null;

    @JsonProperty("paidBy")
    private String paidBy = null;

    @JsonProperty("payerName")
    private String payerName = null;

    @JsonProperty("payerAddress")
    private String payerAddress = null;

    @JsonProperty("payerEmail")
    private String payerEmail = null;

    @JsonProperty("isActive")
    private Boolean isActive = null;

    @JsonProperty("isCancelled")
    private Boolean isCancelled = null;

    @JsonProperty("additionalDetails")
    private Object additionalDetails = null;

    @JsonProperty("taxAndPayments")
    @Valid
    @NotNull
    private List<TaxAndPayment> taxAndPayments = null;

    @JsonProperty("billDetails")
    @Valid
    private List<BillDetail> billDetails = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails = null;

}