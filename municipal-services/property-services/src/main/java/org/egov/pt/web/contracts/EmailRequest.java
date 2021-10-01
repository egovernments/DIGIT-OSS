package org.egov.pt.web.contracts;

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
