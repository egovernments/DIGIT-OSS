package org.egov.collection.model;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InstrumentTypeProperty{
	
	@NotNull
	private TransactionType transactionType;
	@NotNull
	private Boolean reconciledOncreate;
	@NotNull
	private InstrumentStatus statusOnCreate;
	@NotNull
	private InstrumentStatus statusOnUpdate;
	@NotNull
	private InstrumentStatus statusOnReconcile;
}
