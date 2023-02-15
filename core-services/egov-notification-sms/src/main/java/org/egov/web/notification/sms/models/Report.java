package org.egov.web.notification.sms.models;


import lombok.*;
import org.hibernate.validator.constraints.SafeHtml;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Report {
    @SafeHtml
    private String jobno;

    @SafeHtml
    private int messagestatus;

    @SafeHtml
    private String DoneTime;

    @SafeHtml
    private String usernameHash;
}
