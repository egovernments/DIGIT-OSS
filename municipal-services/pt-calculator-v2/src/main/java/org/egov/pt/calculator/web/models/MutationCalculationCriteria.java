package org.egov.pt.calculator.web.models;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Validated

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class MutationCalculationCriteria {
		
    @NotNull
    @JsonProperty("tenantId")
    private String tenantId;
    
    @NotNull
    @JsonProperty("mutationApplicationNo")
    private String mutationApplicationNo;
    
    @JsonProperty("usageType")
    private String usageType;
	
    @JsonProperty("ownershipType")
    private String ownershipType;
    
    @JsonProperty("areaType")
    private String areaType;
    
    @JsonProperty("marketValue")
    private BigDecimal marketValue;
}
