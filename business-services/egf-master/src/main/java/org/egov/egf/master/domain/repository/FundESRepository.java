package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.persistence.entity.FundEntity;
import org.egov.egf.master.web.contract.FundSearchContract;
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
public class FundESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public FundESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<Fund> search(FundSearchContract fundSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(fundSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToFundList(searchResponse, fundSearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<Fund> mapToFundList(SearchResponse searchResponse, FundSearchContract fundSearchContract) {
        Pagination<Fund> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<Fund> funds = new ArrayList<Fund>();
        Fund fund = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                fund = mapper.readValue(hit.getSourceAsString(), Fund.class);
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

            funds.add(fund);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(funds);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(FundSearchContract criteria) {

        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), FundEntity.class);
        }
        List<String> orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchFund(criteria);

        SearchRequestBuilder searchRequestBuilder = esClient.prepareSearch(Fund.class.getSimpleName().toLowerCase())
                .setTypes(Fund.class.getSimpleName().toLowerCase());

        for (String orderBy : orderByList) {
            searchRequestBuilder = searchRequestBuilder.addSort(orderBy.split(" ")[0],
                    orderBy.split(" ")[1].equalsIgnoreCase("asc") ? SortOrder.ASC : SortOrder.DESC);
        }

        searchRequestBuilder.setQuery(boolQueryBuilder);
        return searchRequestBuilder;
    }

}
