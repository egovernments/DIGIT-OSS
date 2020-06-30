package org.egov.web.notification.mail.consumer.contract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@ToString
public class SMSRequest {
    private String mobileNumber;
    private String message;

    public Sms toDomain() {
        return new Sms(mobileNumber, message, Priority.HIGH);
    }
}
