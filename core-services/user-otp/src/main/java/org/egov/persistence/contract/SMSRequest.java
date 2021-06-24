package org.egov.persistence.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.domain.model.Category;

@Getter
@AllArgsConstructor
public class SMSRequest {
    private String mobileNumber;
    private String message;
    private Category category;
    private long expiryTime;
}