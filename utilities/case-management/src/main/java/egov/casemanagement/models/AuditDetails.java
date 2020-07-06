package egov.casemanagement.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Size;

/**
 * Collection of audit related fields used by most models
 */
@Validated

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditDetails   {

        @Size(max=64)
        @JsonProperty("createdBy")
        private String createdBy = null;

        @Size(max=64)
        @JsonProperty("lastModifiedBy")
        private String lastModifiedBy = null;

        @JsonProperty("createdTime")
        private Long createdTime = null;

        @JsonProperty("lastModifiedTime")
        private Long lastModifiedTime = null;


}

