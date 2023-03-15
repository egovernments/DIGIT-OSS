package org.egov.web.notification.mail.consumer.contract;

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
}
