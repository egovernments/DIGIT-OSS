package org.egov.pt.calculator.web.models;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.egov.pt.calculator.web.models.property.AuditDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * BillingSlab
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(exclude = { "unitRate", "propertyType", "roadType", "mohalla", "constructionType", "id",
        "auditDetails" })
public class BillingSlab {

    @NotNull
    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("id")
    private String id;

    @NotNull
    @JsonProperty("propertyType")
    private String propertyType;

    @NotNull
    @JsonProperty("roadType")
    private String roadType;

    @NotNull
    @JsonProperty("constructionType")
    private String constructionType;

    @NotNull
    @JsonProperty("ward")
    private String ward;

    @NotNull
    @JsonProperty("mohalla")
    private String mohalla;

    @NotNull
    @JsonProperty("unitRate")
    private Double unitRate;

    @NotNull
    @JsonProperty("fromDate")
    private Date fromDate;

    @NotNull
    @JsonProperty("toDate")
    private Date toDate;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
}