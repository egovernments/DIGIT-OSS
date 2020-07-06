package egov.casemanagement.models.cova;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CovaData {
    @JsonProperty("mobile_no")
    private String mobileNumber = null;

    @JsonProperty("district_name")
    private String district = null;

}
