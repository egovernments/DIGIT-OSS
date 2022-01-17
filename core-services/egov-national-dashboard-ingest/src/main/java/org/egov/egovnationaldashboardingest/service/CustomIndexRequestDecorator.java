package org.egov.egovnationaldashboardingest.service;

import org.egov.egovnationaldashboardingest.web.models.Data;
import org.egov.egovnationaldashboardingest.web.models.MasterData;

import java.util.List;

public interface CustomIndexRequestDecorator {
    List<String> createFlattenedIndexRequest(Data ingestData);
    List<String> createFlattenedMasterDataRequest(MasterData masterData);
}
