package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.persistence.entity.BankAccountEntity;
import org.egov.egf.master.web.contract.BankAccountSearchContract;
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
public class BankAccountESRepository extends ESRepository {

    private TransportClient esClient;
    private ElasticSearchQueryFactory elasticSearchQueryFactory;

    public BankAccountESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
        this.esClient = esClient;
        this.elasticSearchQueryFactory = elasticSearchQueryFactory;
    }

    public Pagination<BankAccount> search(BankAccountSearchContract bankAccountSearchContract) {
        final SearchRequestBuilder searchRequestBuilder = getSearchRequest(bankAccountSearchContract);
        final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
        return mapToBankAccountList(searchResponse, bankAccountSearchContract);
    }

    @SuppressWarnings("deprecation")
    private Pagination<BankAccount> mapToBankAccountList(SearchResponse searchResponse,
            BankAccountSearchContract bankAccountSearchContract) {
        Pagination<BankAccount> page = new Pagination<>();
        if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
            return page;
        }
        List<BankAccount> bankAccounts = new ArrayList<BankAccount>();
        BankAccount bankAccount = null;
        for (SearchHit hit : searchResponse.getHits()) {

            ObjectMapper mapper = new ObjectMapper();
            // JSON from file to Object
            try {
                bankAccount = mapper.readValue(hit.getSourceAsString(), BankAccount.class);
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

            bankAccounts.add(bankAccount);
        }

        page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
        page.setPagedData(bankAccounts);

        return page;
    }

    private SearchRequestBuilder getSearchRequest(BankAccountSearchContract criteria) {
        List<String> orderByList = new ArrayList<>();
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            validateSortByOrder(criteria.getSortBy());
            validateEntityFieldName(criteria.getSortBy(), BankAccountEntity.class);
            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
        }

        final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchBankAccount(criteria);
        SearchRequestBuilder searchRequestBuilder = esClient.prepareSearch(BankAccount.class.getSimpleName().toLowerCase())
                .setTypes(BankAccount.class.getSimpleName().toLowerCase());
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
