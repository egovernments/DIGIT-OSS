package egov.dataupload.models.sign;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignResponse {

    @JsonProperty("value")
    private String value;

    @JsonProperty("signature")
    private String signature;

}
