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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SearchReqValidator {
		
	@Autowired
	private SearchApplicationRunnerImpl runner;
	
	@Autowired
	private SearchUtils searchUtils;
	
	@Autowired
	private ObjectMapper mapper;
	
	
	public void validate(SearchRequest searchRequest, String moduleName, String searchName) {
		log.info("Validating search request....");
		Map<String, SearchDefinition> searchDefinitionMap = runner.getSearchDefinitionMap();
		Definition searchDefinition = searchUtils.getSearchDefinition(searchDefinitionMap, moduleName, searchName);
		validateSearchDefAgainstReq(searchDefinition, searchRequest);
	}
	
	public void validateSearchDefAgainstReq(Definition searchDefinition, SearchRequest searchRequest) {
		SearchParams searchParams = searchDefinition.getSearchParams();
		Map<String, String> errorMap = new HashMap<>();
		if(null == searchParams) {
			errorMap.put("MISSING_PARAM_CONFIGS", "Missing Parameter Configurations for: "+searchDefinition.getName());
			throw new CustomException(errorMap);
		}
		if(!CollectionUtils.isEmpty(searchParams.getParams())) {
			List<Params> params = searchParams.getParams().stream().filter(param -> param.getIsMandatory()).collect(Collectors.toList());
			try {
				String request = mapper.writeValueAsString(searchRequest);
				params.forEach(entry -> {
					Object paramValue = null;
					try {
						paramValue = JsonPath.read(request, entry.getJsonPath());
					}catch(Exception e) {
						log.error("KEY_PATH_NOT_FOUND {}" , "Missing Mandatory Property: "+entry.getJsonPath());
					}
					if(null == paramValue) {
						errorMap.put("MISSING_MANDATORY_VALUE" + "_" + entry.getName(), "Missing Mandatory Property: "+entry.getJsonPath());
					}
				});
			}catch(Exception e) {
				log.error("An exception has occured while validating: ",e);
				errorMap.put("VALIDATION_EXCEPTION", "An exception has occured while validating");
			}
		}		
		if(!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
		
	}
}
