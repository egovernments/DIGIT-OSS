package org.egov.auditservice.persisterauditclient.models.contract;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuditError {

    private Mapping mapping;

    private String query;

    private List<RowData> rowDataList;

    private Exception exception;

}
