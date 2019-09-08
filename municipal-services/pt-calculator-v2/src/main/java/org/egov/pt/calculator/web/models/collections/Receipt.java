package org.egov.pt.calculator.web.models.collections;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.pt.calculator.web.models.demand.Bill;
import org.egov.pt.calculator.web.models.property.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@ToString
@EqualsAndHashCode
public class Receipt {

    @NotNull
    private String tenantId;
	
	private String id;

    private String transactionId;

	@NotNull
	@Default
    @Size(min = 1, max = 1)
	@JsonProperty("Bill")
	private List<Bill> bill = new ArrayList<>();

	private AuditDetails auditDetails;

	private Long stateId;
	
}
