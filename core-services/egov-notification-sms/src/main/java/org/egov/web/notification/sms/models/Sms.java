package org.egov.web.notification.sms.models;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class Sms {
    private String mobileNumber;
    private String message;
    private Priority priority;

    public boolean isValid() {
        return isNotEmpty(mobileNumber) && isNotEmpty(message);
    }
}
