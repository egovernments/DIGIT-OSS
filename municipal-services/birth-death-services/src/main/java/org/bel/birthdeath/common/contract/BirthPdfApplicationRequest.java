package org.bel.birthdeath.common.contract;

import java.util.List;

import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BirthPdfApplicationRequest {
	
	@JsonProperty("RequestInfo")
    private RequestInfo requestInfo = null;

	@JsonProperty("BirthCertificate")
	private List<EgBirthDtl> birthCertificate;
}
