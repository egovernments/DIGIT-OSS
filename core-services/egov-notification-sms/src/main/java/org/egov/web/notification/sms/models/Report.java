package org.egov.web.notification.sms.models;


import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Report {
    private String jobno;
    private String mobilenumber;
    private int messagestatus;
    private Date doneTime;
    private String message;
}
