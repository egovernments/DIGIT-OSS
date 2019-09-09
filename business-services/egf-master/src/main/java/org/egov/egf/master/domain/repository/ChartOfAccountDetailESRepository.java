package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.persistence.entity.ChartOfAccountDetailEntity;
import org.egov.egf.master.web.contract.ChartOfAccountDetailSearchContract;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChartOfAccountDetailESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public ChartOfAccountDetailESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<ChartOfAccountDetail> search(ChartOfAccountDetailSearchContract chartOfAccountDetailSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(chartOfAccountDetailSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToChartOfAccountDetailList(searchResponse, chartOfAccountDetailSearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<ChartOfAccountDetail> mapToChartOfAccountDetailList(SearchResponse searchResponse,
            ChartOfAccountDetailSearchContract chartOfAccountDetailSearchContract) {
        Pagination<ChartOfAccountDetail> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<ChartOfAccountDetail> chartOfAccountDetails = new ArrayList<ChartOfAccountDetail>();
        ChartOfAccountDetail chartOfAccountDetail = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                chartOfAccountDetail = mapper.readValue(hit.getSourceAsString(), ChartOfAccountDetail.class);
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

            chartOfAccountDetails.add(chartOfAccountDetail);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(chartOfAccountDetails);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(ChartOfAccountDetailSearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), ChartOfAccountDetailEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchChartOfAccountDetail(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient
                .prepareSearch(ChartOfAccountDetail.class.getSimpleName().toLowerCase())
                .setTypes(ChartOfAccountDetail.class.getSimpleName().toLowerCase());
        if (!orderByList.isEmpty()) {
            for (String orderBy : orderByList) {
                searchRequestBuilder = searchRequestBuilder.addSort(orderBy.split(" ")[0],
                        orderBy.split(" ")[1].equalsIgnoreCase("asc") ? SortOrder.ASC : SortOrder.DESC);
            }
        }

        searchRequestBuilder.setQuery(boolQueryBuilder);
        return searchRequestBuilder;
    }

}
