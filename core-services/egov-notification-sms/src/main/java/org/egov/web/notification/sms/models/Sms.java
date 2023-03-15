package org.egov.web.notification.sms.models;

import lombok.*;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Setter
public class Sms {

    private String mobileNumber;
    private String message;
    private Category category;
    private Long expiryTime;

    public boolean isValid() {

        return isNotEmpty(mobileNumber) && isNotEmpty(message);
    }
}
