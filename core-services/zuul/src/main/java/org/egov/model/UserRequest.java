package org.egov.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("type")
    private String type;

    @JsonProperty("name")
    private String name;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("emailId")
    private String emailId;

}
