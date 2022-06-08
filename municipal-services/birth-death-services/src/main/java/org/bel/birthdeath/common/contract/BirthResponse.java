package org.bel.birthdeath.common.contract;

import java.util.List;

import javax.validation.Valid;

import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;

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
public class BirthResponse   {
	
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
        @JsonProperty("ResponseInfo")
        private ResponseInfo responseInfo = null;

        @JsonProperty("birthCerts")
        @Valid
        private List<EgBirthDtl> birthCerts = null;
        
}

