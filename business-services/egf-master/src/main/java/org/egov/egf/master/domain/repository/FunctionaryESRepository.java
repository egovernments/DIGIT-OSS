package org.egov.egf.master.domain.repository;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.Functionary;
import org.egov.egf.master.persistence.entity.FunctionaryEntity;
import org.egov.egf.master.web.contract.FunctionarySearchContract;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FunctionaryESRepository extends ESRepository {

    public FunctionaryESRepository(TransportClient esClient) {
        this.esClient = esClient;
    }

    public Pagination<Functionary> search(FunctionarySearchContract functionarySearchContract) {

        SearchRequestBuilder searchRequestBuilder;
        BoolQueryBuilder boolQueryBuilder = boolQuery();
        List<String> orderByList = new ArrayList<>();

        searchRequestBuilder = esClient.prepareSearch(Functionary.class.getSimpleName().toLowerCase())
                .setTypes(Functionary.class.getSimpleName().toLowerCase());

        if (functionarySearchContract.getSortBy() != null && !functionarySearchContract.getSortBy().isEmpty()) {
            validateSortByOrder(functionarySearchContract.getSortBy());
            validateEntityFieldName(functionarySearchContract.getSortBy(), FunctionaryEntity.class);
            orderByList = prepareOrderBys(functionarySearchContract.getSortBy());
        }

        if (!orderByList.isEmpty()) {
            for (String orderBy : orderByList) {
                searchRequestBuilder = searchRequestBuilder.addSort(orderBy.split(" ")[0],
                        orderBy.split(" ")[1].equalsIgnoreCase("asc") ? SortOrder.ASC : SortOrder.DESC);
            }
        }

        if (functionarySearchContract.getIds() != null && !functionarySearchContract.getIds().isEmpty())
            add(functionarySearchContract.getIds(), "id", boolQueryBuilder);
        add(functionarySearchContract.getId(), "id", boolQueryBuilder);

        add(functionarySearchContract.getName(), "name", boolQueryBuilder);
        add(functionarySearchContract.getCode(), "code", boolQueryBuilder);
        add(functionarySearchContract.getActive(), "active", boolQueryBuilder);

        searchRequestBuilder.setQuery(boolQueryBuilder);

        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();

        return mapToFunctionarysList(searchResponse, functionarySearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<Functionary> mapToFunctionarysList(SearchResponse searchResponse,
            FunctionarySearchContract functionarySearchContract) {
        Pagination<Functionary> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<Functionary> functionarys = new ArrayList<Functionary>();
        Functionary functionary = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            try {
                functionary = mapper.readValue(hit.getSourceAsString(), Functionary.class);
            } catch (Exception e1) {
                e1.printStackTrace();
            }

            functionarys.add(functionary);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(functionarys);

        return page;
    }

}
