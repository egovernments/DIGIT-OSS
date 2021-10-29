package org.egov.tl.web.models;

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
