package org.egov.land.abm.newservices.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class NewServiceInfoData {

	@JsonProperty("step1")
	private Step1 step1;
	
	@JsonProperty("step2")
	private Step2 step2;
	
	@JsonProperty("step3")
	private Step3 step3;
	
	@JsonProperty("step4")
	private Step4 step4;
	
	@JsonProperty("step5")
	private Step5 step5;
	
	
}
