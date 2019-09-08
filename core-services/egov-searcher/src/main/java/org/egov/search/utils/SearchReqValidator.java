package org.egov.search.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.SearchApplicationRunnerImpl;
import org.egov.search.model.Definition;
import org.egov.search.model.Params;
import org.egov.search.model.SearchDefinition;
import org.egov.search.model.SearchParams;
import org.egov.search.model.SearchRequest;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

@Service
public class SearchReqValidator {
	
	public static final Logger logger = LoggerFactory.getLogger(SearchReqValidator.class);
	
	@Autowired
	private SearchApplicationRunnerImpl runner;
	
	@Autowired
	private SearchUtils searchUtils;
	
	public void validate(SearchRequest searchRequest, String moduleName, String searchName) {

		logger.info("Validating search request....");
		checkIfEmptySearch(searchRequest);
		Map<String, SearchDefinition> searchDefinitionMap = runner.getSearchDefinitionMap();
		Definition searchDefinition = null;
		try{
			searchDefinition = searchUtils.getSearchDefinition(searchDefinitionMap, moduleName, searchName);
		}catch(CustomException e){
			throw e;
		}
		validateSearchDefAgainstReq(searchDefinition, searchRequest);
		logger.info("All validations passed!");
	}
	
	public void validateSearchDefAgainstReq(Definition searchDefinition, SearchRequest searchRequest) {
		SearchParams searchParams = searchDefinition.getSearchParams();
		Map<String, String> errorMap = new HashMap<>();
		if(null == searchParams) {
			errorMap.put("400", "Missiing Configurations for: "+searchDefinition.getName());
		}
		ObjectMapper mapper = new ObjectMapper();
		List<Params> params = searchParams.getParams().parallelStream()
				.filter(param -> param.getIsMandatory())
				.collect(Collectors.toList());
		
		params.forEach(entry -> {
			Object paramValue = null;
			try {
				paramValue = JsonPath.read(mapper.writeValueAsString(searchRequest), entry.getJsonPath());
			}catch(Exception e) {
				errorMap.put("400", "Missiing Mandatory Property: "+entry.getJsonPath());
			}
			if(null == paramValue) {
				errorMap.put("400", "Missiing Mandatory Property: "+entry.getJsonPath());
			}
		});
		
		if(!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
		
	}

	public void checkIfEmptySearch(SearchRequest searchRequest)
	{
		Map<String, String> errorMap = new HashMap<>();
		if(searchRequest.getRequestInfo()==null)
		{
			errorMap.put("400", "Requestinfo is missing: ");
			throw new CustomException(errorMap);
		}
		if(searchRequest.getSearchCriteria()==null)
		{
			errorMap.put("400", "Searchcriteria is missing: ");
			throw new CustomException(errorMap);
		}
	}
}
