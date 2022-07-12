package org.egov.infra.persist.web.contract;

import lombok.Builder;
import lombok.Data;

import java.util.*;

@Builder
@Data
public class RowData {


    private Map<String, Object> keyValueMap;
    private AuditAttributes auditAttributes;

}
