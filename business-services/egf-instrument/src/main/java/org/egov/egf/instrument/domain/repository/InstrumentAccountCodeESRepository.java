package org.egov.egf.instrument.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.persistence.entity.InstrumentAccountCodeEntity;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeSearchContract;
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
public class InstrumentAccountCodeESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public InstrumentAccountCodeESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<InstrumentAccountCode> search(InstrumentAccountCodeSearchContract instrumentAccountCodeSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(instrumentAccountCodeSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToInstrumentAccountCodeList(searchResponse);
    }

    @SuppressWarnings("deprecation")
    private Pagination<InstrumentAccountCode> mapToInstrumentAccountCodeList(SearchResponse searchResponse) {
        Pagination<InstrumentAccountCode> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L)
            return page;
        List<InstrumentAccountCode> instrumentAccountCodes = new ArrayList<InstrumentAccountCode>();
        InstrumentAccountCode instrumentAccountCode = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                instrumentAccountCode = mapper.readValue(hit.getSourceAsString(), InstrumentAccountCode.class);
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

            instrumentAccountCodes.add(instrumentAccountCode);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(instrumentAccountCodes);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(InstrumentAccountCodeSearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), InstrumentAccountCodeEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchInstrumentAccountCode(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient
                .prepareSearch(InstrumentAccountCode.class.getSimpleName().toLowerCase())
                .setTypes(InstrumentAccountCode.class.getSimpleName().toLowerCase());
        if (!orderByList.isEmpty())
            for (String orderBy : orderByList)
                searchRequestBuilder = searchRequestBuilder.addSort(orderBy.split(" ")[0],
                        orderBy.split(" ")[1].equalsIgnoreCase("asc") ? SortOrder.ASC : SortOrder.DESC);

        searchRequestBuilder.setQuery(boolQueryBuilder);
        return searchRequestBuilder;
    }

}
