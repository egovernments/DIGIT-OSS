package org.egov.demand.helper;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.web.contract.Receipt;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionReceiptRequest {

	@JsonProperty("RequestInfo")
	private RequestInfo RequestInfo;
	
	private String tenantId;

	@JsonProperty("Receipt")
	private List<Receipt> receipt;
}
