package digit.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import digit.web.models.Address;
import digit.web.models.AuditDetails;
import digit.web.models.FatherApplicant;
import digit.web.models.MotherApplicant;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * A Object holds the basic data for a Birth Registration Application
 */
@ApiModel(description = "A Object holds the basic data for a Birth Registration Application")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-16T15:34:24.436+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BirthRegistrationApplication   {

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

    @JsonProperty("fatherMobileNumber")
    private String fatherMobileNumber = null;

    @JsonProperty("motherMobileNumber")
    private String motherMobileNumber = null;

    @JsonProperty("doctorName")
    private String doctorName = null;

    @JsonProperty("hospitalName")
    private String hospitalName = null;

    @JsonProperty("placeOfBirth")
    private String placeOfBirth = null;

    @JsonProperty("timeOfBirth")
    private Integer timeOfBirth = null;

    @JsonProperty("address")
    private Address address = null;

    @JsonProperty("fatherOfApplicant")
    private FatherApplicant father = null;

    @JsonProperty("motherOfApplicant")
    private MotherApplicant mother = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails = null;

//        @JsonProperty("father")
//        private User father = null;
//
//        @JsonProperty("mother")
//        private User mother = null;

    @Valid
    @JsonProperty("workflow")
    private Workflow workflow = null;

}

