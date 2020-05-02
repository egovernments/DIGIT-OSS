package org.egov.pt.web.contracts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Property;

import javax.validation.Valid;
import java.util.List;

/**
 * Contract class to receive request. Array of Property items  are used in case of create . Where as single Property item is used for update
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyRequestList {
	
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo;

  @JsonProperty("Property")
  @Valid
  private List<Property> property;
}
