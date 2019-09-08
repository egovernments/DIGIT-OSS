package org.egov.boundary.web.contract;


import java.util.ArrayList;
import java.util.List;
import org.egov.common.contract.response.ResponseInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoundaryMdmsResponse {

	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo = null;
	@JsonProperty("TenantBoundary")
	private List<MdmsTenantBoundary> boundarys = new ArrayList<MdmsTenantBoundary>();

}