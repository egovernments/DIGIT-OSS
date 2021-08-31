package org.egov.collection.util;

import static java.util.Objects.isNull;

import java.math.BigDecimal;
import java.util.Iterator;

import org.egov.collection.config.CollectionServiceConstants;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Utils {

    private Utils(){}

    public static JsonNode jsonMerge(JsonNode mainNode, JsonNode updateNode) {

        if(isNull(mainNode) || mainNode.isNull())
            return updateNode;
        if (isNull(updateNode) || updateNode.isNull())
            return mainNode;

        Iterator<String> fieldNames = updateNode.fieldNames();
        while (fieldNames.hasNext()) {

            String fieldName = fieldNames.next();
            JsonNode jsonNode = mainNode.get(fieldName);
            // if field exists and is an embedded object
            if (jsonNode != null && jsonNode.isObject()) {
                jsonMerge(jsonNode, updateNode.get(fieldName));
            }
            else {
                if (mainNode instanceof ObjectNode) {
                    // Overwrite field
                    JsonNode value = updateNode.get(fieldName);
                    ((ObjectNode) mainNode).put(fieldName, value);
                }
            }

        }

        return mainNode;
    }
    
    /**
	 * Method to fetch the state name from the tenantId
	 * 
	 * @param query
	 * @param tenantId
	 * @return
	 */
	public static String replaceSchemaPlaceholder(String query, String tenantId){
		
		String finalQuery = null;
		String stateLevelTenant = tenantId;
		if (stateLevelTenant.contains("\\.")) {
			stateLevelTenant = stateLevelTenant.split("\\.")[1];
			finalQuery = query.replace(CollectionServiceConstants.SCHEMA_PLACEHOLDER, stateLevelTenant);
		} else {
			stateLevelTenant = "";
			finalQuery = query.replace(CollectionServiceConstants.SCHEMA_PLACEHOLDER.concat("."), stateLevelTenant);
		}
		return finalQuery;
	}
    
	public static boolean isPositiveInteger(BigDecimal bd) {
		return bd.compareTo(BigDecimal.ZERO) >= 0
				&& (bd.signum() == 0 || bd.scale() <= 0 || bd.stripTrailingZeros().scale() <= 0);
	}
}
