package org.egov.commons.web.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class BusinessDetailsGetRequest {
	private Boolean active;

	@NotNull
	private String tenantId;

	private List<Long> id;

    @JsonProperty("businessDetailsCodes")
	private List<String> businessDetailsCodes;

	private String businessCategoryCode;
	
	private String businessType;

	private String sortBy;

	private String sortOrder;

}
