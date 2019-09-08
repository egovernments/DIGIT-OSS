package org.egov.pt.calculator.web.models.property;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


/**
 * PropertyDetail
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
public class PropertyDetail   {
       /* @JsonProperty("id")
        private String id;*/

              /**
   * Source of a assessment data. The properties will be created in a system based on the data avaialble in their manual records or during field survey. There can be more from client to client.
   */

        @JsonProperty("tenantId")
        private String tenantId;

        @JsonProperty("citizenInfo")
        private OwnerInfo citizenInfo;


        public enum SourceEnum {
    MUNICIPAL_RECORDS("MUNICIPAL_RECORDS"),
    
    FIELD_SURVEY("FIELD_SURVEY");

    private String value;

    SourceEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static SourceEnum fromValue(String text) {
      for (SourceEnum b : SourceEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

        @JsonProperty("source")
        private SourceEnum source;

        @JsonProperty("usage")
        private String usage;

        @NotNull
        @Min(1)
        @JsonProperty("noOfFloors")
        private Long noOfFloors;

        @JsonProperty("landArea")
        private Double landArea;

        @JsonProperty("buildUpArea")
        private Double buildUpArea;

        @JsonProperty("units")
        @Valid
        private List<Unit> units;

        @JsonProperty("documents")
        @Valid
        private Set<Document> documents;

        @JsonProperty("additionalDetails")
        private Object additionalDetails;

        @NotEmpty
        @JsonProperty("financialYear")
        private String financialYear;

        @NotEmpty
        @JsonProperty("propertyType")
        private String propertyType;

        @JsonProperty("propertySubType")
        private String propertySubType;

        @JsonProperty("assessmentNumber")
        private String assessmentNumber;

        @JsonProperty("assessmentDate")
        private Long assessmentDate;

        @JsonProperty("usageCategoryMajor")
        private String usageCategoryMajor;

        @NotEmpty
        @JsonProperty("ownershipCategory")
        private String ownershipCategory;

        @JsonProperty("subOwnershipCategory")
        private String subOwnershipCategory;

        @JsonProperty("adhocExemption")
        private BigDecimal adhocExemption;

        @JsonProperty("adhocPenalty")
        private BigDecimal adhocPenalty;

        @JsonProperty("owners")
        @Valid
        @NotNull
        @Size(min=1)
        private Set<OwnerInfo> owners;


        @JsonProperty("auditDetails")
        private AuditDetails auditDetails;



    /**
   * Property can be created from different channels Eg. System (properties created by ULB officials), CFC Counter (From citizen faciliation counters) etc. Here we are defining some known channels, there can be more client to client.
   */
  public enum ChannelEnum {
    SYSTEM("SYSTEM"),
    
    CFC_COUNTER("CFC_COUNTER"),
    
    CITIZEN("CITIZEN"),
    
    DATA_ENTRY("DATA_ENTRY"),
    
    MIGRATION("MIGRATION");

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
        private ChannelEnum channel;


        public PropertyDetail addUnitsItem(Unit unitsItem) {
            if (this.units == null) {
            this.units = new ArrayList<>();
            }
        this.units.add(unitsItem);
        return this;
        }

        public PropertyDetail addDocumentsItem(Document documentsItem) {
            if (this.documents == null) {
            this.documents = new HashSet<>();
            }
        this.documents.add(documentsItem);
        return this;
        }


    public PropertyDetail addOwnersItem(OwnerInfo ownersItem) {
        if (this.owners == null) {
            this.owners = new HashSet<>();
        }
        this.owners.add(ownersItem);
        return this;
    }

}

