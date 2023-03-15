package org.egov.nationaldashboardingest.utils;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.nationaldashboardingest.web.models.Data;
import org.egov.nationaldashboardingest.web.models.MasterData;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

@Slf4j
@Component
public class IngestUtil {

    public String convertFieldNameToCamelCase(String fieldName){
        char c[] = fieldName.toCharArray();
        c[0] = Character.toLowerCase(c[0]);
        return new String(c);
    }

    public String capitalizeFieldName(String fieldName){
        char c[] = fieldName.toCharArray();
        c[0] = Character.toUpperCase(c[0]);
        return new String(c);
    }

    public void enrichMetaDataInBaseDocumentStructureForDataIngest(ObjectNode baseDocumentStructure, Data ingestData) {
        baseDocumentStructure.put(IngestConstants.DATE, ingestData.getDate());
        baseDocumentStructure.put(IngestConstants.MODULE, ingestData.getModule());
        baseDocumentStructure.put(IngestConstants.REGION, ingestData.getRegion());
        baseDocumentStructure.put(IngestConstants.STATE, ingestData.getState());
        baseDocumentStructure.put(IngestConstants.ULB, ingestData.getUlb());
        baseDocumentStructure.put(IngestConstants.WARD, ingestData.getWard());
        if(!ObjectUtils.isEmpty(ingestData.getAuditDetails())) {
            baseDocumentStructure.put(IngestConstants.CREATED_BY, ingestData.getAuditDetails().getCreatedBy());
            baseDocumentStructure.put(IngestConstants.CREATED_TIME, ingestData.getAuditDetails().getCreatedTime());
            baseDocumentStructure.put(IngestConstants.LAST_MODIFIED_BY, ingestData.getAuditDetails().getLastModifiedBy());
            baseDocumentStructure.put(IngestConstants.LAST_MODIFIED_TIME, ingestData.getAuditDetails().getLastModifiedTime());
        }
    }

    public void enrichMetaDataInBaseDocumentStructureForMasterDataIngest(ObjectNode baseDocumentStructure, MasterData masterData) {
        baseDocumentStructure.put(IngestConstants.MODULE, masterData.getModule());
        baseDocumentStructure.put(IngestConstants.REGION, masterData.getRegion());
        baseDocumentStructure.put(IngestConstants.STATE, masterData.getState());
        baseDocumentStructure.put(IngestConstants.ULB, masterData.getUlb());
        baseDocumentStructure.put(IngestConstants.FINANCIAL_YEAR, masterData.getFinancialYear());
        if(!ObjectUtils.isEmpty(masterData.getAuditDetails())) {
            baseDocumentStructure.put(IngestConstants.CREATED_TIME, masterData.getAuditDetails().getCreatedTime());
            baseDocumentStructure.put(IngestConstants.CREATED_BY, masterData.getAuditDetails().getCreatedBy());
            baseDocumentStructure.put(IngestConstants.LAST_MODIFIED_TIME, masterData.getAuditDetails().getLastModifiedTime());
            baseDocumentStructure.put(IngestConstants.LAST_MODIFIED_BY, masterData.getAuditDetails().getLastModifiedBy());
        }
    }
}
