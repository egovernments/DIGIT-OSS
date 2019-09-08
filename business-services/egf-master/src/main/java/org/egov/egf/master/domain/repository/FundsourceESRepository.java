package org.egov.egf.master.domain.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.ESRepository;
import org.egov.egf.master.domain.model.Fundsource;
import org.egov.egf.master.persistence.entity.FundsourceEntity;
import org.egov.egf.master.web.contract.FundsourceSearchContract;
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
public class FundsourceESRepository extends ESRepository {

	private TransportClient esClient;
	private ElasticSearchQueryFactory elasticSearchQueryFactory;

	public FundsourceESRepository(TransportClient esClient, ElasticSearchQueryFactory elasticSearchQueryFactory) {
		this.esClient = esClient;
		this.elasticSearchQueryFactory = elasticSearchQueryFactory;
	}

	public Pagination<Fundsource> search(FundsourceSearchContract fundsourceSearchContract) {
		final SearchRequestBuilder searchRequestBuilder = getSearchRequest(fundsourceSearchContract);
		final SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
		return mapToFundsourceList(searchResponse,fundsourceSearchContract);
	}


    @SuppressWarnings("deprecation")
	private Pagination<Fundsource> mapToFundsourceList(SearchResponse searchResponse,FundsourceSearchContract fundsourceSearchContract) {
		Pagination<Fundsource> page = new Pagination<>();
		if (searchResponse.getHits() == null || searchResponse.getHits().getTotalHits() == 0L) {
			return page;
		}
		List<Fundsource> Fundsources = new ArrayList<Fundsource>();
		Fundsource fundsource=null;
		for (SearchHit hit : searchResponse.getHits()) {
			
			ObjectMapper mapper = new ObjectMapper();
			//JSON from file to Object
			try {
			    fundsource = mapper.readValue(hit.getSourceAsString(), Fundsource.class);
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
		
			Fundsources.add(fundsource);
		}
		
		page.setTotalResults(Long.valueOf(searchResponse.getHits().getTotalHits()).intValue());
		page.setPagedData(Fundsources);

		return page;
	}

	private SearchRequestBuilder getSearchRequest(FundsourceSearchContract criteria) {
	    List<String> orderByList = new ArrayList<>();
	        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
	            validateSortByOrder(criteria.getSortBy());
	            validateEntityFieldName(criteria.getSortBy(), FundsourceEntity.class);
	            orderByList = elasticSearchQueryFactory.prepareOrderBys(criteria.getSortBy());
	        }

		final BoolQueryBuilder boolQueryBuilder = elasticSearchQueryFactory.searchFundsource(criteria);
		SearchRequestBuilder searchRequestBuilder = esClient.prepareSearch(Fundsource.class.getSimpleName().toLowerCase()).setTypes(Fundsource.class.getSimpleName().toLowerCase())
				;
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
