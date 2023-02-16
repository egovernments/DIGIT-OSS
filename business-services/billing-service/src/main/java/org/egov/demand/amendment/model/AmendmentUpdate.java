package org.egov.demand.amendment.model;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.demand.amendment.model.enums.AmendmentReason;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.egov.demand.model.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The update object which carries the workflow action info along with the
 * amendment id
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmendmentUpdate {

	@NotNull
	@JsonProperty("amendmentId")
	private String amendmentId;
	
	@JsonProperty("amendedDemandId")
	private String amendedDemandId;
	
	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails;

	@JsonProperty("workflow")
	@NotNull
	private ProcessInstance workflow;
	
	private AmendmentStatus status;

	@JsonProperty("documents")
	@Valid
	private List<Document> documents;

	@NotNull
	@JsonProperty("amendmentReason")
	private AmendmentReason amendmentReason;

	@JsonProperty("reasonDocumentNumber")
	private String reasonDocumentNumber;

	@JsonProperty("effectiveFrom")
	private Long effectiveFrom;

	@JsonProperty("effectiveTill")
	private Long effectiveTill;

	public AmendmentCriteria toSearchCriteria() {
		
		return AmendmentCriteria.builder()
				.amendmentId(amendmentId)
				.tenantId(tenantId)
				.build();
	}

}
