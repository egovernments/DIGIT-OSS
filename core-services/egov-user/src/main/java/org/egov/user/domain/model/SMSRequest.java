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

    private String mobileNumber;

    private String message;

}