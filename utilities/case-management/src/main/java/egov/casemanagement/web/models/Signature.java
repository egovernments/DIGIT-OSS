package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import org.springframework.validation.annotation.Validated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Digital signature details for the pass object
 */
@ApiModel(description = "Digital signature details for the pass object")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Signature   {
        @JsonProperty("certUrl")
        private String certUrl = null;

        @JsonProperty("signedJWT")
        private String signedJWT = null;


}

