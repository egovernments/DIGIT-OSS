package org.egov.infra.persist.web.contract;

import lombok.Builder;
import lombok.Data;

import java.util.*;

@Builder
@Data
public class RowData {


    private List<Object[]> rows;
    private List<Map<String, Object>> keyValuePairsList;

}
