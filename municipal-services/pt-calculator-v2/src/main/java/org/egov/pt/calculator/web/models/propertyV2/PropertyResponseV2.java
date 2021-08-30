package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

/**
 * Contains the ResponseHeader and the created/updated property
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyResponseV2 {

	@JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo;

  @JsonProperty("Properties")
  private List<PropertyV2> properties;
}
