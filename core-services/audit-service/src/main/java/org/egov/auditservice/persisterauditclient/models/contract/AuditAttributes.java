package org.egov.auditservice.persisterauditclient.models.contract;

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

    private String auditCorrelationId;
}
