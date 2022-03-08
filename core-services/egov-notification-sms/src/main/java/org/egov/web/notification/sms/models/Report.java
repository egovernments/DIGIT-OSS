package org.egov.web.notification.sms.models;


import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Report {
    private String userId;
    private String jobno;
    private String mobilenumber;
    private int messagestatus;
    private String DoneTime;
    private String messagepart;
    private String sender_name;
}
