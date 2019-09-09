package org.egov.collection.web.contract;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReceiptUpdateRequest {
	
    @NotNull
	public Long id;
    
    @NotNull
    private String tenantId;

}
