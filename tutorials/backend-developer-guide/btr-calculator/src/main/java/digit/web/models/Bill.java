package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * Bill
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Bill {
    @JsonProperty("id")
    private String id = null;

    @JsonProperty("mobileNumber")
    private String mobileNumber = null;

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
    private List<TaxAndPayment> taxAndPayments = null;

    @JsonProperty("billDetails")
    @Valid
    private List<BillDetail> billDetails = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails = null;


    public Bill addTaxAndPaymentsItem(TaxAndPayment taxAndPaymentsItem) {
        if (this.taxAndPayments == null) {
            this.taxAndPayments = new ArrayList<>();
        }
        this.taxAndPayments.add(taxAndPaymentsItem);
        return this;
    }

    public Bill addBillDetailsItem(BillDetail billDetailsItem) {
        if (this.billDetails == null) {
            this.billDetails = new ArrayList<>();
        }
        this.billDetails.add(billDetailsItem);
        return this;
    }

}

