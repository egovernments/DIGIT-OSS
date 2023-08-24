package org.egov.model.eservicesso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfo {

    @JsonProperty("_id")
    private String id;

    @JsonProperty("type")
    private String type;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("email")
    private String email;
}

