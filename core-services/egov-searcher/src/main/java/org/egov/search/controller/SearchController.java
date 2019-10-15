package org.egov.search.controller;

import java.lang.reflect.Type;
import java.util.Map;

import javax.validation.Valid;

import org.egov.search.model.SearchRequest;
import org.egov.search.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
			@RequestBody @Valid final SearchRequest searchRequest) {		
		Object searchResult = searchService.searchData(searchRequest,moduleName,searchName);
	    Type type = new TypeToken<Map<String, Object>>() {}.getType();
		Gson gson = new Gson();
		Map<String, Object> data = gson.fromJson(searchResult.toString(), type);
		return new ResponseEntity<>(data, HttpStatus.OK);
	}

		
}