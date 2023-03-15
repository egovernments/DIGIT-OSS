package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * A Object holds the basic data for a Birth Registration Application
 */
@ApiModel(description = "A Object holds the basic data for a Birth Registration Application")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BirthRegistrationApplication {
    @JsonProperty("id")
    private String id = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("applicationNumber")
    private String applicationNumber = null;

    @JsonProperty("babyFirstName")
    private String babyFirstName = null;

    @JsonProperty("babyLastName")
    private String babyLastName = null;

    @JsonProperty("fathertName")
    private String fathertName = null;

    @JsonProperty("motherName")
    private String motherName = null;

    @JsonProperty("doctorAttendingBirth")
    private String doctorAttendingBirth = null;

    @JsonProperty("hospitalName")
    private String hospitalName = null;

    @JsonProperty("placeOfBirth")
    private String placeOfBirth = null;

    @JsonProperty("dateOfBirth")
    private Integer dateOfBirth = null;

    @JsonProperty("address")
    private Address address = null;

    @JsonProperty("applicant")
    private Applicant applicant = null;

    @JsonProperty("auditDetails")
    private AuditDetails2 auditDetails = null;


}

