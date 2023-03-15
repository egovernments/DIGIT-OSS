package org.egov.fsm.web.model.idgen;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class IdRequest {
	 @JsonProperty("idName")
	    @NotNull
	    private String idName;

	    @NotNull
	    @JsonProperty("tenantId")
	    private String tenantId;

	    @JsonProperty("format")
	    private String format;
	    

}
