package org.egov.user.domain.model;

import lombok.*;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SMSRequest {

    @Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
    private String mobileNumber;

    @Size(max = 1000)
    private String message;
    private String category = "NOTIFICATION";
    private Long expiryTime;
}