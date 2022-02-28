package org.egov.web.notification.sms.models;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Report {
    private String jobno;
    private String mobilenumber;
    private int messagestatus;
    private String doneTime;
    private String message;
    private String receivestamp;
}
