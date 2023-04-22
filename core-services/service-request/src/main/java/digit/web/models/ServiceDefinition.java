package digit.web.models;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import digit.models.coremodels.AuditDetails;
import digit.web.models.AttributeDefinition;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;

/**
 * Holds the Service Definition details json object.
 */
@Schema(description = "Holds the Service Definition details json object.")
@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceDefinition {
    @JsonProperty("id")
    @Size(min = 2, max = 64)
    private String id = null;

    @JsonProperty("tenantId")
    @Size(min = 2, max = 64)
    private String tenantId = null;

    @JsonProperty("code")
    @NotNull
    @Size(min = 2, max = 64)
    private String code = null;

    @JsonProperty("module")
    @NotNull
    @Size(min = 2, max = 64)
    private String module = null;

    @JsonProperty("isActive")
    private Boolean isActive = true;

    @JsonProperty("attributes")
    @NotNull
    @Valid
    private List<AttributeDefinition> attributes = new ArrayList<>();

    @JsonProperty("auditDetails")
    @Valid
    private AuditDetails auditDetails = null;

    @JsonProperty("additionalDetails")
    private Object additionalDetails = null;

    @JsonProperty("clientId")
    @Size(max = 64)
    private String clientId = null;

    public ServiceDefinition addAttributesItem(AttributeDefinition attributesItem) {
        this.attributes.add(attributesItem);
        return this;
    }

}
