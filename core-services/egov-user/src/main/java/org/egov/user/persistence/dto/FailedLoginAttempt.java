package org.egov.user.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class FailedLoginAttempt {

    private String userUuid;
    private String ip;
    private long attemptDate;
    private boolean active;

}
