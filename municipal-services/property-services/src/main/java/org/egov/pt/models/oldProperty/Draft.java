package org.egov.pt.models.oldProperty;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Draft {
	
	@JsonProperty("id")
	private String id;
	
	@JsonProperty("userId")
	@NotNull
	private String userId;
	
	@JsonProperty("tenantId")
	@NotNull
	private String tenantId;
	
	@JsonProperty("draftRecord")
	private Object draftRecord;
	
	@JsonProperty("auditDetails")
	private OldAuditDetails oldAuditDetails;
	
	

}
