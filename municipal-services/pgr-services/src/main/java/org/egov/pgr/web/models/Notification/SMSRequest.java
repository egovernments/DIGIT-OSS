package org.egov.pgr.web.models.Notification;

import lombok.*;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SMSRequest {
    private String mobileNumber;
    private String message;
}
