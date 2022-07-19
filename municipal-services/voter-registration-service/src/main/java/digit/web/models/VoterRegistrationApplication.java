package digit.web.models;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import digit.web.models.Address;
import digit.web.models.Applicant;
import digit.web.models.AuditDetails;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * A Object holds the basic data for a Voter Registration Application
 */
@ApiModel(description = "A Object holds the basic data for a Voter Registration Application")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-05-22T11:09:12.469+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class VoterRegistrationApplication   {
        @JsonProperty("id")
        private String id = null;

        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("applicationNumber")
        private String applicationNumber = null;

        @JsonProperty("assemblyConstituency")
        private String assemblyConstituency = null;

        @JsonProperty("dateSinceResidence")
        private Integer dateSinceResidence = null;

        @JsonProperty("address")
        private Address address = null;

        @JsonProperty("applicant")
        private Applicant applicant = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;

        @Valid
        @JsonProperty("workflow")
        private Workflow workflow = null;

        @JsonProperty("transactionCode")
        private String transactionCode = null;


}

