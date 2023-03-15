package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Draft {

	@Size(max=64)
	@JsonProperty("id")
	private String id;
	
	@JsonProperty("userId")
	@NotNull
	@Size(max=64)
	private String userId;

	@Size(max=256)
	@JsonProperty("tenantId")
	@NotNull
	private String tenantId;

    @JsonProperty("isActive")
    private boolean isActive;

	@Size(max=64)
    @JsonProperty("assessmentNumber")
    private String assessmentNumber;
	
	@JsonProperty("draftRecord")
	private Object draftRecord;
	
	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;
	
	

}
