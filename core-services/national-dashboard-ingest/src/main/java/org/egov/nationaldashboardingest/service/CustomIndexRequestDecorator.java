package org.egov.nationaldashboardingest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.egov.nationaldashboardingest.web.models.Data;
import org.egov.nationaldashboardingest.web.models.MasterData;

import java.util.List;

public interface CustomIndexRequestDecorator {
    List<JsonNode> createFlattenedIndexRequest(Data ingestData);
    List<String> createFlattenedMasterDataRequest(MasterData masterData);
}
