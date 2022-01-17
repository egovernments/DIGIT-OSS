package org.egov.egovnationaldashboardingest.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.egovnationaldashboardingest.web.models.Data;
import org.egov.egovnationaldashboardingest.web.models.MasterData;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import static org.egov.egovnationaldashboardingest.utils.IngestConstants.*;
import static org.egov.egovnationaldashboardingest.utils.IngestConstants.WARD;

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
        baseDocumentStructure.put(DATE, ingestData.getDate());
        baseDocumentStructure.put(MODULE, ingestData.getModule());
        baseDocumentStructure.put(REGION, ingestData.getRegion());
        baseDocumentStructure.put(STATE, ingestData.getState());
        baseDocumentStructure.put(ULB, ingestData.getUlb());
        baseDocumentStructure.put(WARD, ingestData.getWard());
    }

    public void enrichMetaDataInBaseDocumentStructureForMasterDataIngest(ObjectNode baseDocumentStructure, MasterData masterData) {
        baseDocumentStructure.put(MODULE, masterData.getModule());
        baseDocumentStructure.put(REGION, masterData.getRegion());
        baseDocumentStructure.put(STATE, masterData.getState());
        baseDocumentStructure.put(ULB, masterData.getUlb());
        baseDocumentStructure.put(FINANCIAL_YEAR, masterData.getFinancialYear());
        if(!ObjectUtils.isEmpty(masterData.getAuditDetails())) {
            baseDocumentStructure.put(CREATED_TIME, masterData.getAuditDetails().getCreatedTime());
            baseDocumentStructure.put(CREATED_BY, masterData.getAuditDetails().getCreatedBy());
            baseDocumentStructure.put(LAST_MODIFIED_TIME, masterData.getAuditDetails().getLastModifiedTime());
            baseDocumentStructure.put(LAST_MODIFIED_BY, masterData.getAuditDetails().getLastModifiedBy());
        }
    }
}
