package org.egov.demand.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentBackUpdateAudit {

	private String paymentId;
	
	private Boolean isBackUpdateSucces;
	
	private Boolean isReceiptCancellation;
	
	private String errorMessage;
	
}
