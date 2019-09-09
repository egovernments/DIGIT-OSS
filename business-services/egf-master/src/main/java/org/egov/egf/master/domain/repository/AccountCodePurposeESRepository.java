package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.persistence.entity.AccountCodePurposeEntity;
import org.egov.egf.master.web.contract.AccountCodePurposeSearchContract;
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
public class AccountCodePurposeESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public AccountCodePurposeESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<AccountCodePurpose> search(AccountCodePurposeSearchContract accountCodePurposeSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(accountCodePurposeSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToAccountCodePurposeList(searchResponse, accountCodePurposeSearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<AccountCodePurpose> mapToAccountCodePurposeList(SearchResponse searchResponse,
            AccountCodePurposeSearchContract accountCodePurposeSearchContract) {
        Pagination<AccountCodePurpose> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<AccountCodePurpose> accountCodePurposes = new ArrayList<AccountCodePurpose>();
        AccountCodePurpose accountCodePurpose = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                accountCodePurpose = mapper.readValue(hit.getSourceAsString(), AccountCodePurpose.class);
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

            accountCodePurposes.add(accountCodePurpose);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(accountCodePurposes);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(AccountCodePurposeSearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), AccountCodePurposeEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchAccountCodePurpose(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient
                .prepareSearch(AccountCodePurpose.class.getSimpleName().toLowerCase())
                .setTypes(AccountCodePurpose.class.getSimpleName().toLowerCase());
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
