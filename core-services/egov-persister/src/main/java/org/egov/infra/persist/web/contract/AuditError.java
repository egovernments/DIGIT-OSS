package org.egov.infra.persist.web.contract;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AuditError {

    private Mapping mapping;

    private String query;

    private List<RowData> rowDataList;

    private Exception exception;

}
