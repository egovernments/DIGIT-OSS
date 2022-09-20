package org.egov.auditservice.persisterauditclient.models.contract;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Builder
@Data
public class RowData {


    private Map<String, Object> keyValueMap;
    private AuditAttributes auditAttributes;

}
