package org.egov.pg.models;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionsResponseInfo {
    private String apiId;
    private String ver;
    private String ts;
    private String resMsgId;
    private String msgId;
    private String status;
}
