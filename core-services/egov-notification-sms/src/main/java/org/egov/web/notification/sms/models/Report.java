package org.egov.web.notification.sms.models;


import lombok.*;


//Report object that will be stored
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Report {
    private String jobno;
    private int messagestatus;
    private String DoneTime;
    private String usernameHash;
}
