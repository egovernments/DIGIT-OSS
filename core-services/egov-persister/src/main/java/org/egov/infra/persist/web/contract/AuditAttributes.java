package org.egov.infra.persist.web.contract;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuditAttributes {

    private String module;

    private String tenantId;

    private String transactionCode;

    private String objectId ;

    private String userUUID;
}
