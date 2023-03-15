package org.egov.search.controller;

import java.lang.reflect.Type;
import java.util.Map;

import org.egov.search.model.SearchRequest;
import org.egov.search.service.SearchService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@RestController
public class SearchController {
		
	@Autowired
	private SearchService searchService;
		
	@PostMapping("/{moduleName}/{searchName}/_get")
	@ResponseBody
	public ResponseEntity<?> getData(@PathVariable("moduleName") String moduleName,
			@PathVariable("searchName") String searchName,
			@RequestBody SearchRequest searchRequest, @RequestParam Map<String, Object> queryParams) {	
		if(null == searchRequest.getSearchCriteria()) {
			searchRequest.setSearchCriteria(queryParams);
		}
		Object searchResult = searchService.searchData(searchRequest,moduleName,searchName);
		try {
		    Type type = new TypeToken<Map<String, Object>>() {}.getType();
			Gson gson = new Gson();
			Map<String, Object> data = gson.fromJson(searchResult.toString(), type);
			return new ResponseEntity<>(data, HttpStatus.OK);
		}catch(Exception e) {
			if(null != searchResult)
				return new ResponseEntity<>(searchResult, HttpStatus.OK);
			else
				throw new CustomException("SEARCH_ERROR", "Error occurred while searching : " + e.getMessage());
		}
		
		//return new ResponseEntity<>(searchResult, HttpStatus.OK);

	}

		
}