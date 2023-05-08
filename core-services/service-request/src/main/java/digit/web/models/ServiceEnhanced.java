package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import digit.models.coremodels.AuditDetails;
import io.swagger.models.auth.In;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

/**
 * Hold the Service field details as json object.
 */
@Schema(description = "Hold the Service field details as json object.")
@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceEnhanced {
    @JsonProperty("id")
    private String id = null;

    @JsonProperty("tenantId")
    @NotNull
    @Size(min = 2, max = 64)
    private String tenantId = null;

    @JsonProperty("serviceDefId")
    @NotNull
    @Size(min = 2, max = 64)
    private String serviceDefId = null;

    @JsonProperty("referenceId")
    @Size(min = 2, max = 64)
    private String referenceId = null;

    @JsonProperty("attributes")
    @NotNull
    @Valid
    private List<AttributeValue> attributes = new ArrayList<>();

    @JsonProperty("auditDetails")
    @Valid
    private AuditDetails auditDetails = null;

    @JsonProperty("additionalDetails")
    private Object additionalDetails = null;

    @JsonProperty("accountId")
    @NotNull
    @Size(max = 64)
    private String accountId = null;

    @JsonProperty("clientId")
    @Size(max = 64)
    private String clientId = null;

    @JsonProperty("code")
    @Size(max = 64)
    private String code = null;

    @JsonProperty("module")
    @Size(max = 64)
    private String module = null;

    @JsonProperty("consumerCode")
    @Size(max = 64)
    private String consumerCode = null;

    @JsonProperty("rating")
    private Integer rating;

    @JsonProperty("comments")
    private String comments = null;

    @JsonProperty("channel")
    private String channel = null;



    public ServiceEnhanced addAttributesItem(AttributeValue attributesItem) {
        this.attributes.add(attributesItem);
        return this;
    }

}
