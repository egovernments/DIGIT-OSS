package org.egov.boundary.web.contract;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Geography {
    private String name;
    private String division;
    private JsonNode geoJson;
    private JsonNode geoJsonChildren;
    private String tenantId;
}