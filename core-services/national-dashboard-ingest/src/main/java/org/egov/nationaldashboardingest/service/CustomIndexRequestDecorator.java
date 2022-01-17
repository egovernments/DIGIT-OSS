package org.egov.nationaldashboardingest.service;

import org.egov.nationaldashboardingest.web.models.Data;
import org.egov.nationaldashboardingest.web.models.MasterData;

import java.util.List;

public interface CustomIndexRequestDecorator {
    List<String> createFlattenedIndexRequest(Data ingestData);
    List<String> createFlattenedMasterDataRequest(MasterData masterData);
}
