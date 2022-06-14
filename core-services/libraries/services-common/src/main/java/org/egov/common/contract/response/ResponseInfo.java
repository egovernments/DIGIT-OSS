package org.egov.common.contract.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class ResponseInfo {

    private String apiId;

    private String ver;

    private Long ts;

    private String resMsgId;

    private String msgId;

    private String status;
}