package org.egov.bpa.web.model;

import lombok.*;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class EmailRequest {
    private String emailId;
    private String message;

}
