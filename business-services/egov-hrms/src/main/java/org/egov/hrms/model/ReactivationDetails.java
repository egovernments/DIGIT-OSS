package org.egov.hrms.model;

import lombok.*;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Validated
@EqualsAndHashCode(exclude = {"auditDetails"})
@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class ReactivationDetails {

	@SafeHtml
	private String id;

	@SafeHtml
	@NotNull
	private String reasonForReactivation;

	@SafeHtml
	private String orderNo;

	@SafeHtml
	private String remarks;

	@NotNull
	private Long effectiveFrom;

	@SafeHtml
	private String tenantId;

	private AuditDetails auditDetails;




}


