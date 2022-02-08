package org.egov.wf.util;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class CommonUtil {


    @Autowired
    private MultiStateInstanceUtil multiStateInstanceUtil;

    /**
     * Method to fetch the state name from the tenantId
     *
     * @param query
     * @param tenantId
     * @return
     */
    public String replaceSchemaPlaceholder(String query, String tenantId) {

        String modifiedQuery = null;
        try {
            modifiedQuery = multiStateInstanceUtil.replaceSchemaPlaceholder(query, tenantId);
        }
        catch (Exception e){
            throw new CustomException("INVALID_TENANTID","The tenantId: "+tenantId+" is not valid.");
        }

        return modifiedQuery;

    }

}
