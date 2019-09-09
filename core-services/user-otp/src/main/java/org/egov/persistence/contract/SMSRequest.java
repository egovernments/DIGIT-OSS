package org.egov.persistence.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SMSRequest {
    private String mobileNumber;
    private String message;
}