package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.infra.indexer.custom.bpa.AuditDetails;
import org.egov.infra.indexer.custom.bpa.Document;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * LandInfo
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class EnrichedLandInfo {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("landUId")
  private String landUId = null;

  @JsonProperty("landUniqueRegNo")
  private String landUniqueRegNo = null;

  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("status")
  private Status status = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("ownershipCategory")
  private String ownershipCategory = null;

  @JsonProperty("owners")
  @Valid
  private List<OwnerInfo> owners = new ArrayList<OwnerInfo>();

  @JsonProperty("institution")
  private Institution institution = null;

  @JsonProperty("source")
  private Source source = null;

  @JsonProperty("channel")
  private Channel channel = null;

  @JsonProperty("documents")
  @Valid
  private List<Document> documents = null;

  @JsonProperty("unit")
  @Valid
  private List<EnrichedUnit> unit = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

  @JsonProperty("plotAreaApproved")
  private Double plotAreaApproved = null;

  @JsonProperty("plotArea")
  private Integer plotArea = null;

}
