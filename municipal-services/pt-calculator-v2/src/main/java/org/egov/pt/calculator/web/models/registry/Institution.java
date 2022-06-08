package org.egov.pt.calculator.web.models.registry;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Institution {
	
        @JsonProperty("id")
        private String id ;

        @JsonProperty("tenantId")
        private String tenantId ;

        @JsonProperty("type")
        private String type;
        
        @JsonProperty("name")
        private String name;

        @JsonProperty("designation")
        private String designation ;
}

