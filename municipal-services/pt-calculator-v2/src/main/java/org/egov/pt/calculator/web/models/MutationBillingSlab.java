package org.egov.pt.calculator.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;
import org.egov.pt.calculator.web.models.property.AuditDetails;

import javax.validation.constraints.NotNull;

/**
 * Mutation BillingSlab
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class MutationBillingSlab   {

    @NotNull
    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("id")
    private String id;

    @JsonProperty("propertyType")
    private String propertyType;

    @JsonProperty("propertySubType")
    private String propertySubType;

    @JsonProperty("usageCategoryMajor")
    private String usageCategoryMajor;

    @JsonProperty("usageCategoryMinor")
    private String usageCategoryMinor;

    @JsonProperty("usageCategorySubMinor")
    private String usageCategorySubMinor;

    @JsonProperty("usageCategoryDetail")
    private String usageCategoryDetail;

    @JsonProperty("ownerShipCategory")
    private String ownerShipCategory;

    @JsonProperty("subOwnerShipCategory")
    private String subOwnerShipCategory;

    @JsonProperty("minMarketValue")
    private Double minMarketValue;

    @JsonProperty("maxMarketValue")
    private Double maxMarketValue;

    @NotNull
    @JsonProperty("fixedAmount")
    private Double fixedAmount;

    @NotNull
    @JsonProperty("rate")
    private Double rate;

    @JsonProperty("type")
    private TypeEnum type = null;

    public enum TypeEnum {
        RATE("RATE"),

        FLAT("FLAT");

        private String value;

        TypeEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static TypeEnum fromValue(String text) {
            for (TypeEnum b : TypeEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

}


