package digit.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import digit.web.models.RequestInfo;
import digit.web.models.VoterRegistrationApplication;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Contract class to receive request. Array of  items are used in case of create, whereas single  item is used for update
 */
@ApiModel(description = "Contract class to receive request. Array of  items are used in case of create, whereas single  item is used for update")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-05-20T16:50:30.829+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoterRegistrationRequest   {
        @JsonProperty("RequestInfo")
        private RequestInfo requestInfo = null;

        @JsonProperty("VoterRegistrationApplications")
        @Valid
        private List<VoterRegistrationApplication> voterRegistrationApplications = null;


        public VoterRegistrationRequest addVoterRegistrationApplicationsItem(VoterRegistrationApplication voterRegistrationApplicationsItem) {
            if (this.voterRegistrationApplications == null) {
            this.voterRegistrationApplications = new ArrayList<>();
            }
        this.voterRegistrationApplications.add(voterRegistrationApplicationsItem);
        return this;
        }

}

