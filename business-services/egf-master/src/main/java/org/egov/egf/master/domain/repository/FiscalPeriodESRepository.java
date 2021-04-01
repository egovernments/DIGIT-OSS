package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.FiscalPeriod;
import org.egov.egf.master.persistence.entity.FiscalPeriodEntity;
import org.egov.egf.master.web.contract.FiscalPeriodSearchContract;
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
public class FiscalPeriodESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public FiscalPeriodESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<FiscalPeriod> search(FiscalPeriodSearchContract fiscalPeriodSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(fiscalPeriodSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToFiscalPeriodList(searchResponse, fiscalPeriodSearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<FiscalPeriod> mapToFiscalPeriodList(SearchResponse searchResponse,
            FiscalPeriodSearchContract fiscalPeriodSearchContract) {
        Pagination<FiscalPeriod> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<FiscalPeriod> fiscalPeriods = new ArrayList<FiscalPeriod>();
        FiscalPeriod fiscalPeriod = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                fiscalPeriod = mapper.readValue(hit.getSourceAsString(), FiscalPeriod.class);
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

            fiscalPeriods.add(fiscalPeriod);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(fiscalPeriods);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(FiscalPeriodSearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), FiscalPeriodEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchFiscalPeriod(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient.prepareSearch(FiscalPeriod.class.getSimpleName().toLowerCase())
                .setTypes(FiscalPeriod.class.getSimpleName().toLowerCase());
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
