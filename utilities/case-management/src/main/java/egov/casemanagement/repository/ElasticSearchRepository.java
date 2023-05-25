package egov.casemanagement.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import egov.casemanagement.config.Configuration;
import egov.casemanagement.web.models.CaseSearchRequest;
import egov.casemanagement.web.models.ModelCase;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.*;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Repository
public class ElasticSearchRepository implements SearchRepository{

    @Autowired
    private Configuration configuration;

    @Autowired
    private RestHighLevelClient restHighLevelClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public List<ModelCase> searchCases(CaseSearchRequest request){
        SearchSourceBuilder sourceBuilder = getSearchBody(request);
        return getCasesFromES(sourceBuilder);
    }

    @Override
    public List<ModelCase> searchDefaulterCases(String tenantId, Long timestamp) {
        SearchSourceBuilder searchSourceBuilder = getSearchBodyForDefaulterCases(tenantId, timestamp);
        return getCasesFromES(searchSourceBuilder);
    }

    private List<ModelCase> getCasesFromES(SearchSourceBuilder sourceBuilder) {
        SearchRequest searchRequest = new SearchRequest(configuration.getEsIndexName());
        searchRequest.source(sourceBuilder);

        List<ModelCase> cases = new ArrayList<>();

        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);

            for (SearchHit hit : searchResponse.getHits()) {
                Map<String, Object> sourceAsMap = hit.getSourceAsMap();
                ModelCase modelCase = objectMapper.convertValue(sourceAsMap.get("case"), ModelCase.class);
                cases.add(modelCase);
            }
        }catch (IOException e){
            log.error("Failed to fetch results for ES", e);
            throw new CustomException("SEARCH_FAILED", "Search unsuccessful!");
        }

        return cases;
    }

    private SearchSourceBuilder getSearchBody(CaseSearchRequest request) {
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder().size(5).timeout(new TimeValue(60, TimeUnit.SECONDS));

        List<QueryBuilder> queries = new ArrayList<>();

        if(request.getCaseId() != null)
            queries.add(QueryBuilders.termsQuery("case.caseId", request.getCaseId()));

        if(request.getUserUuids() != null)
            queries.add(QueryBuilders.termsQuery("case.userUuid", request.getUserUuids()));

        if(request.getStatus() != null)
            queries.add(QueryBuilders.termsQuery("case.status", request.getStatus()));

        if(request.getUuid() != null)
            queries.add(QueryBuilders.termsQuery("case.uuid", request.getUuid()));

        if(request.getTenantId() != null)
            queries.add(QueryBuilders.termsQuery("case.tenantId", request.getTenantId()));

        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder curr : queries) {
            boolQueryBuilder.filter(curr);
        }

        sourceBuilder.query(boolQueryBuilder);
        return sourceBuilder;
    }

    private SearchSourceBuilder getSearchBodyForDefaulterCases(String tenantId, Long timestamp) {


        RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery("case.healthDetails.auditDetails.lastModifiedTime");
        rangeQueryBuilder.gte(timestamp);

        MatchQueryBuilder statusQuery = QueryBuilders.matchQuery("case.status", "active");

        MatchQueryBuilder tenantIdQuery = QueryBuilders.matchQuery("case.tenantId", tenantId);

        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        boolQueryBuilder.should(statusQuery);
        boolQueryBuilder.should(tenantIdQuery);
        boolQueryBuilder.mustNot(rangeQueryBuilder);

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder().timeout(new TimeValue(60, TimeUnit.SECONDS));

        sourceBuilder.query(boolQueryBuilder);

        return sourceBuilder;
    }

}
