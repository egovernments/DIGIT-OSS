package org.egov.pg.models;

import lombok.*;

@AllArgsConstructor
@Getter
@Builder
@NoArgsConstructor
@EqualsAndHashCode
public class BusinessAccountDetails {
	private Long id;

	private Long businessDetails;

	private Long chartOfAccounts;

	private Double amount;
}