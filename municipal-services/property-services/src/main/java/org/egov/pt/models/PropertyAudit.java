package org.egov.pt.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.pt.models.Property;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Size;
import java.util.List;

/**
 * Address
 */
@Validated
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PropertyAudit {

    @JsonProperty("audituuid")
    private String audituuid;

    @JsonProperty("auditcreatedTime")
    private Long auditcreatedTime;

    @JsonProperty("propertyid")
    private String propertyId;

    @JsonProperty("Property")
    private Property property;

}