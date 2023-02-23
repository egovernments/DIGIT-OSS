package org.egov.fsm.billing.models;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.fsm.web.model.collection.Bill;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BillResponse {
	@JsonProperty("ResposneInfo")
	private ResponseInfo resposneInfo = null;

	@JsonProperty("Bill")
	private List<Bill> bill = new ArrayList<>();
	

}
