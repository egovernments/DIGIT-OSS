package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import egov.casemanagement.models.AuditDetails;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;

/**
 * HealthDetails
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HealthDetails   {
        @JsonProperty("temperature")
        private Double temperature = null;

        @JsonProperty("symptoms")
        private List<String> symptoms = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;


        public HealthDetails addSymptomsItem(String symptomsItem) {
            if (this.symptoms == null) {
            this.symptoms = new ArrayList<>();
            }
        this.symptoms.add(symptomsItem);
        return this;
        }

}

