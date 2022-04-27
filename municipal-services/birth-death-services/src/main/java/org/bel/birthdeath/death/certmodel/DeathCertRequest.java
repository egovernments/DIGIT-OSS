
package org.bel.birthdeath.death.certmodel;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DeathCertRequest {
	
	
	 @JsonProperty("RequestInfo")
     private RequestInfo requestInfo = null;
	 
	 @JsonProperty("deathCertificate")
     private DeathCertificate deathCertificate = null;


  
}
