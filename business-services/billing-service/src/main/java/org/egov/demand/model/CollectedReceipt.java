package org.egov.demand.model;

import org.egov.demand.model.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectedReceipt {

	private String businessService;

	private String consumerCode;

	private String receiptNumber;

	private Double receiptAmount;

	private Long receiptDate;

	private Status status;

	private AuditDetail auditDetail;

	private String tenantId;
}