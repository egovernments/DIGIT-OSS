package org.egov.egf.master.domain.repository;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.persistence.entity.RecoveryEntity;
import org.egov.egf.master.web.contract.RecoverySearchContract;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecoveryESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public RecoveryESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<Recovery> search(RecoverySearchContract recoverySearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(recoverySearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToRecoveryList(searchResponse, recoverySearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<Recovery> mapToRecoveryList(SearchResponse searchResponse, RecoverySearchContract recoverySearchContract) {
        Pagination<Recovery> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<Recovery> recoverys = new ArrayList<Recovery>();
        Recovery recovery = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                recovery = mapper.readValue(hit.getSourceAsString(), Recovery.class);
            } catch (JsonParseException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            } catch (JsonMappingException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            } catch (IOException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            }

            recoverys.add(recovery);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(recoverys);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(RecoverySearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), RecoveryEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchRecovery(criteria);

        SearchRequestBuilder searchRequestBuilder = esClient.prepareSearch(Recovery.class.getSimpleName().toLowerCase())
                .setTypes(Recovery.class.getSimpleName().toLowerCase());

        for (String orderBy : orderByList) {
            searchRequestBuilder = searchRequestBuilder.addSort(orderBy.split(" ")[0],
                    orderBy.split(" ")[1].equalsIgnoreCase("asc") ? SortOrder.ASC : SortOrder.DESC);
        }

        searchRequestBuilder.setQuery(boolQueryBuilder);
        return searchRequestBuilder;
    }

}
