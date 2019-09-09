package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.FinancialYear;
import org.egov.egf.master.persistence.entity.FinancialYearEntity;
import org.egov.egf.master.web.contract.FinancialYearSearchContract;
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
public class FinancialYearESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public FinancialYearESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<FinancialYear> search(FinancialYearSearchContract financialYearSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(financialYearSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToFinancialYearList(searchResponse, financialYearSearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<FinancialYear> mapToFinancialYearList(SearchResponse searchResponse,
            FinancialYearSearchContract financialYearSearchContract) {
        Pagination<FinancialYear> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<FinancialYear> financialYears = new ArrayList<FinancialYear>();
        FinancialYear financialYear = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                financialYear = mapper.readValue(hit.getSourceAsString(), FinancialYear.class);
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

            financialYears.add(financialYear);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(financialYears);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(FinancialYearSearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), FinancialYearEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchFinancialYear(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient.prepareSearch(FinancialYear.class.getSimpleName().toLowerCase())
                .setTypes(FinancialYear.class.getSimpleName().toLowerCase())
                .setQuery(boolQueryBuilder);
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
