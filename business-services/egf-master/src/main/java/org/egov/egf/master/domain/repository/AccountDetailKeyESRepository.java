package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.persistence.entity.AccountDetailKeyEntity;
import org.egov.egf.master.web.contract.AccountDetailKeySearchContract;
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
public class AccountDetailKeyESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public AccountDetailKeyESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<AccountDetailKey> search(AccountDetailKeySearchContract accountCodeKeySearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(accountCodeKeySearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToAccountDetailKeyList(searchResponse, accountCodeKeySearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<AccountDetailKey> mapToAccountDetailKeyList(SearchResponse searchResponse,
            AccountDetailKeySearchContract accountCodePurposeSearchContract) {
        Pagination<AccountDetailKey> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<AccountDetailKey> accountDetailkeys = new ArrayList<AccountDetailKey>();
        AccountDetailKey accountDetailKey = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                accountDetailKey = mapper.readValue(hit.getSourceAsString(), AccountDetailKey.class);
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

            accountDetailkeys.add(accountDetailKey);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(accountDetailkeys);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(AccountDetailKeySearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), AccountDetailKeyEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchAccountDetailKey(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient
                .prepareSearch(AccountDetailKey.class.getSimpleName().toLowerCase())
                .setTypes(AccountDetailKey.class.getSimpleName().toLowerCase());
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
