package org.egov.wf.util;

import org.springframework.stereotype.Component;

import static org.egov.wf.util.WorkflowConstants.SCHEMA_REPLACE_STRING;

@Component
public class CommonUtil {

    /**
     * Method to fetch the state name from the tenantId
     *
     * @param query
     * @param tenantId
     * @return
     */
    public String replaceSchemaPlaceholder(String query, String tenantId) {

        String finalQuery = null;
        if (tenantId.contains(".")) {
            String schemaName = tenantId.split("\\.")[1];
            finalQuery = query.replace(SCHEMA_REPLACE_STRING, schemaName);
        } else {
            finalQuery = query.replace(SCHEMA_REPLACE_STRING.concat("."), "");
        }
        return finalQuery;
    }

}
