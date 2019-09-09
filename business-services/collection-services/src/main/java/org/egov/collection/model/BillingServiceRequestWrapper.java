package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BillingServiceRequestWrapper {
	
	@JsonProperty("RequestInfo")
	private BillingServiceRequestInfo billingServiceRequestInfo;

}
