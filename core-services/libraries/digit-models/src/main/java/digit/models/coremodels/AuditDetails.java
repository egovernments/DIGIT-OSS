package digit.models.coremodels;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


/**
 * Collection of audit related fields used by most models
 */

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-05-22T11:09:12.469+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditDetails {
    @JsonProperty("createdBy")
    private String createdBy = null;

    @JsonProperty("lastModifiedBy")
    private String lastModifiedBy = null;

    @JsonProperty("createdTime")
    private Long createdTime = null;

    @JsonProperty("lastModifiedTime")
    private Long lastModifiedTime = null;


}

