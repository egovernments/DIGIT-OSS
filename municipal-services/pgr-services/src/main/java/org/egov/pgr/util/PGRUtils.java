package org.egov.pgr.util;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.pgr.web.models.AuditDetails;
import org.egov.pgr.web.models.Service;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static org.egov.pgr.util.PGRConstants.SCHEMA_REPLACE_STRING;

@Component
public class PGRUtils {


    private MultiStateInstanceUtil multiStateInstanceUtil;

    @Autowired
    public PGRUtils(MultiStateInstanceUtil multiStateInstanceUtil) {
        this.multiStateInstanceUtil = multiStateInstanceUtil;
    }

    /**
     * Method to return auditDetails for create/update flows
     *
     * @param by
     * @param isCreate
     * @return AuditDetails
     */
    public AuditDetails getAuditDetails(String by, Service service, Boolean isCreate) {
        Long time = System.currentTimeMillis();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().createdBy(service.getAuditDetails().getCreatedBy()).lastModifiedBy(by)
                    .createdTime(service.getAuditDetails().getCreatedTime()).lastModifiedTime(time).build();
    }

    /**
     * Method to fetch the state name from the tenantId
     *
     * @param query
     * @param tenantId
     * @return
     */
    public String replaceSchemaPlaceholder(String query, String tenantId) {

        String finalQuery = null;

        try {
            finalQuery = multiStateInstanceUtil.replaceSchemaPlaceholder(query, tenantId);
        }
        catch (Exception e){
            throw new CustomException("INVALID_TENANTID","Invalid tenantId: "+tenantId);
        }
        return finalQuery;
    }

}
