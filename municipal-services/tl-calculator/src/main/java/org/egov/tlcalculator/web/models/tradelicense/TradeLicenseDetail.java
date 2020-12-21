package org.egov.tlcalculator.web.models.tradelicense;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.annotations.ApiModel;

import java.util.ArrayList;
import java.util.List;

import org.egov.tlcalculator.web.models.*;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * A Object holds the basic data for a Trade License
 */
@ApiModel(description = "A Object holds the basic data for a Trade License")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeLicenseDetail   {

    @JsonProperty("id")
    private String id;

    @JsonProperty("surveyNo")
    private String surveyNo = null;

    @JsonProperty("subOwnerShipCategory")
    private String subOwnerShipCategory = null;

    @JsonProperty("structureType")
    private String structureType;

    @JsonProperty("operationalArea")
    private Double operationalArea;

    @JsonProperty("noOfEmployees")
    private Integer noOfEmployees;

    @JsonProperty("adhocExemption")
    private BigDecimal adhocExemption;

    @JsonProperty("adhocPenalty")
    private BigDecimal adhocPenalty;

    @Size(max=1024)
    @JsonProperty("adhocExemptionReason")
    private String adhocExemptionReason;

    @Size(max=1024)
    @JsonProperty("adhocPenaltyReason")
    private String adhocPenaltyReason;

    @NotNull
    @JsonProperty("owners")
    @Valid
    private List<OwnerInfo> owners = new ArrayList<>();

    /**
     * License can be created from different channels
     */
    public enum ChannelEnum {
        COUNTER("COUNTER"),

        CITIZEN("CITIZEN"),

        DATAENTRY("DATAENTRY");

        private String value;

        ChannelEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static ChannelEnum fromValue(String text) {
            for (ChannelEnum b : ChannelEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

    @JsonProperty("channel")
    private ChannelEnum channel = null;

    @JsonProperty("address")
    private Address address = null;

    @NotNull
    @JsonProperty("tradeUnits")
    @Valid
    private List<TradeUnit> tradeUnits = new ArrayList<>();

    @JsonProperty("accessories")
    @Valid
    private List<Accessory> accessories = null;

    @JsonProperty("applicationDocuments")
    @Valid
    private List<Document> applicationDocuments = null;

    @JsonProperty("verificationDocuments")
    @Valid
    private List<Document> verificationDocuments = null;

    @JsonProperty("additionalDetail")
    private Object additionalDetail = null;

    @JsonProperty("institution")
    private Institution institution = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails = null;


    public TradeLicenseDetail addOwnersItem(OwnerInfo ownersItem) {
        if(this.owners==null)
            this.owners = new ArrayList<>();
        if(!this.owners.contains(ownersItem))
            this.owners.add(ownersItem);
        return this;
    }

    public TradeLicenseDetail addTradeUnitsItem(TradeUnit tradeUnitsItem) {
        if(this.tradeUnits==null)
            this.tradeUnits = new ArrayList<>();
        if(!this.tradeUnits.contains(tradeUnitsItem))
            this.tradeUnits.add(tradeUnitsItem);
        return this;
    }

    public TradeLicenseDetail addAccessoriesItem(Accessory accessoriesItem) {
        if (this.accessories == null) {
            this.accessories = new ArrayList<>();
        }
        if(!this.accessories.contains(accessoriesItem))
            this.accessories.add(accessoriesItem);
        return this;
    }

    public TradeLicenseDetail addApplicationDocumentsItem(Document applicationDocumentsItem) {
        if (this.applicationDocuments == null) {
            this.applicationDocuments = new ArrayList<>();
        }
        if(!this.applicationDocuments.contains(applicationDocumentsItem))
            this.applicationDocuments.add(applicationDocumentsItem);
        return this;
    }

    public TradeLicenseDetail addVerificationDocumentsItem(Document verificationDocumentsItem) {
        if (this.verificationDocuments == null) {
            this.verificationDocuments = new ArrayList<>();
        }
        if(!this.verificationDocuments.contains(verificationDocumentsItem))
            this.verificationDocuments.add(verificationDocumentsItem);
        return this;
    }

}



