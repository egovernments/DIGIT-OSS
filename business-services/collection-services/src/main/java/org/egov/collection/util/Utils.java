package org.egov.collection.util;

import static java.util.Objects.isNull;

import java.math.BigDecimal;
import java.util.Iterator;

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
    
	public static boolean isPositiveInteger(BigDecimal bd) {
		return bd.compareTo(BigDecimal.ZERO) >= 0
				&& (bd.signum() == 0 || bd.scale() <= 0 || bd.stripTrailingZeros().scale() <= 0);
	}
}
