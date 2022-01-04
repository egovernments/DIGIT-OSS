package org.egov.batchtelemetry.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionDetails {

    private Integer pageCount;

    private Long duration;

    private String exitPage;

    private String userType;

}
