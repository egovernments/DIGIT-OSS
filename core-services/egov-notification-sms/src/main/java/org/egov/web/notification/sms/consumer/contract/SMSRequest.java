package org.egov.web.notification.sms.consumer.contract;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.egov.web.notification.sms.models.Category;
import org.egov.web.notification.sms.models.Sms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SMSRequest {

    @Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
    private String mobileNumber;

    @Size(max = 1000)
    private String message;
    private Category category;
    private Long expiryTime;

    //Unused for future upgrades
    private String locale;
    private String tenantId;
    private String email;
    private String[] users;

    public Sms toDomain() {
        if (category == null) {
            return new Sms(mobileNumber, message, Category.OTHERS, expiryTime);
        } else {
            return new Sms(mobileNumber, message, category, expiryTime);
        }
    }
}
