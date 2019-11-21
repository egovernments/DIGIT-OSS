package org.egov.search.service;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.SearchApplicationRunnerImpl;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.search.model.Definition;
import org.egov.search.model.SearchDefinition;
import org.egov.search.model.SearchRequest;
import org.egov.search.repository.SearchRepository;
import org.egov.search.utils.ResponseInfoFactory;
import org.egov.search.utils.SearchReqValidator;
import org.egov.search.utils.SearchUtils;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SearchService {

	@Autowired
	private SearchRepository searchRepository;
	
	@Autowired
	private SearchReqValidator searchReqValidator;
	
	@Autowired
	private SearchApplicationRunnerImpl runner;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Autowired
	private SearchUtils searchUtils;
	
	public static final Logger log = LoggerFactory.getLogger(SearchService.class);


	public Object searchData(SearchRequest searchRequest, String moduleName, String searchName) {
		searchReqValidator.validate(searchRequest, moduleName, searchName);
		Map<String, SearchDefinition> searchDefinitionMap = runner.getSearchDefinitionMap();
		Definition searchDefinition = null;
		searchDefinition = searchUtils.getSearchDefinition(searchDefinitionMap, moduleName, searchName);
		List<String> maps = new ArrayList<>();
		try{
			maps = searchRepository.fetchData(searchRequest, searchDefinition);
		}catch(Exception e){
			log.error("Exception: ",e);
			throw new CustomException("DB_QUERY_EXECUTION_ERROR", "There was an error encountered at the Db");
		}
		Object data = null;
		try{
			data = formatResult(maps, searchDefinition, searchRequest);
		}catch(Exception e){
			log.error("Exception: ",e);
			throw new CustomException("RESULT_FORMAT_ERROR", 
					"There was an error encountered while formatting the result, Verify output config from the yaml file.");
		}
		
		return data;
	}
	
	
	private String formatResult(List<String> maps, Definition searchDefinition, SearchRequest searchRequest){
	    Type type = new TypeToken<ArrayList<Map<String, Object>>>() {}.getType();
		Gson gson = new Gson();
		List<Map<String, Object>> data = gson.fromJson(maps.toString(), type);
		
    	DocumentContext documentContext = JsonPath.parse((null != searchDefinition.getOutput().getJsonFormat()) ? searchDefinition.getOutput().getJsonFormat() : "{}");
		String[] expressionArray = (searchDefinition.getOutput().getOutJsonPath()).split("[.]");
		StringBuilder expression = new StringBuilder();
		for(int i = 0; i < (expressionArray.length - 1) ; i++ ){
			expression.append(expressionArray[i]);
			if(i != expressionArray.length - 2)
				expression.append(".");
		}
		documentContext.put(expression.toString(), expressionArray[expressionArray.length - 1], data);
		
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(searchRequest.getRequestInfo(), true);
		String[] resInfoExpArray = (searchDefinition.getOutput().getResponseInfoPath()).split("[.]");
		StringBuilder resInfoExp = new StringBuilder();
		for(int i = 0; i < (resInfoExpArray.length - 1) ; i++ ){
			resInfoExp.append(resInfoExpArray[i]);
			if(i != resInfoExpArray.length - 2)
				resInfoExp.append(".");
		}
		documentContext.put(resInfoExp.toString(), resInfoExpArray[resInfoExpArray.length - 1], responseInfo);
		
		return documentContext.jsonString().toString();
		
	}
}
