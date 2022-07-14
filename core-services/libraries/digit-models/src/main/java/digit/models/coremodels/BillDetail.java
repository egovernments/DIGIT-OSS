package digit.models.coremodels;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.springframework.util.CollectionUtils;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class BillDetail {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("demandId")
    private String demandId;

    @JsonProperty("billId")
    private String billId;

    @JsonProperty("amount")
    @NotNull
    private BigDecimal amount;

    @JsonProperty("amountPaid")
    private BigDecimal amountPaid;

    @NotNull
    @JsonProperty("fromPeriod")
    private Long fromPeriod;

    @NotNull
    @JsonProperty("toPeriod")
    private Long toPeriod;

    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails;

    @JsonProperty("channel")
    private String channel;

    @JsonProperty("voucherHeader")
    private String voucherHeader;

    @JsonProperty("boundary")
    private String boundary;

    @JsonProperty("manualReceiptNumber")
    private String manualReceiptNumber;

    @JsonProperty("manualReceiptDate")
    private Long manualReceiptDate;

    @JsonProperty("billAccountDetails")
    private List<BillAccountDetail> billAccountDetails;

    @NotNull
    @JsonProperty("collectionType")
    private String collectionType;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    private String billDescription;

    @NotNull
    @JsonProperty("expiryDate")
    private Long expiryDate;


    public Boolean addBillAccountDetail(BillAccountDetail billAccountDetail) {

        if (CollectionUtils.isEmpty(billAccountDetails)) {

            billAccountDetails = new ArrayList<>();
            return billAccountDetails.add(billAccountDetail);
        } else {

            if (!billAccountDetails.contains(billAccountDetail))
                return billAccountDetails.add(billAccountDetail);
            else
                return false;
        }
    }

}
