package org.egov.search.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.search.model.Definition;
import org.egov.search.model.Pagination;
import org.egov.search.model.Params;
import org.egov.search.model.Query;
import org.egov.search.model.SearchDefinition;
import org.egov.search.model.SearchParams;
import org.egov.search.model.SearchRequest;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SearchUtils {

	@Value("${pagination.default.page.size}")
	private String defaultPageSize;

	@Value("${pagination.default.offset}")
	private String defaultOffset;
	
	@Autowired
	private ObjectMapper mapper;
	
	/**
	 * Builds the query reqd for search
	 * 
	 * @param searchRequest
	 * @param searchParam
	 * @param query
	 * @param preparedStatementValues
	 * @return
	 */
	public String buildQuery(SearchRequest searchRequest, SearchParams searchParam, Query query, Map<String, Object> preparedStatementValues) {
		StringBuilder queryString = new StringBuilder();
		StringBuilder where = new StringBuilder();
		String finalQuery = null;
		queryString.append(query.getBaseQuery());
		if(!CollectionUtils.isEmpty(searchParam.getParams())) {
			String whereClause = buildWhereClause(searchRequest, searchParam, preparedStatementValues);
			String paginationClause = getPaginationClause(searchRequest, searchParam.getPagination());
			where.append(" WHERE ").append(whereClause + " ");
			if (null != query.getGroupBy()) {
				queryString.append(" GROUP BY ").append(query.getGroupBy() + " ");
			}
			if (null != query.getOrderBy()) {
				where.append(" ORDER BY ").append(query.getOrderBy().split(",")[0]).append(" ").append(query.getOrderBy().split(",")[1]);
			}
			if (null != query.getSort()) {
				queryString.append(" " + query.getSort());
			}
			finalQuery = queryString.toString().replace("$where", where.toString());
			finalQuery = finalQuery.replace("$pagination", paginationClause);
		}else {
			finalQuery = queryString.toString();
		}
		log.info("Final Query: " + finalQuery);

		return finalQuery;
	}
	
	/**
	 * Builds the where clause based on configs and request
	 * 
	 * @param searchRequest
	 * @param searchParam
	 * @param preparedStatementValues
	 * @return
	 */
	public String buildWhereClause(SearchRequest searchRequest, SearchParams searchParam,  Map<String, Object> preparedStatementValues) {
		StringBuilder whereClause = new StringBuilder();
		String condition = searchParam.getCondition();
		try {
			String request = mapper.writeValueAsString(searchRequest);
			for(Params param : searchParam.getParams()) {
				Object paramValue = null;
				try {
					if(null != param.getIsConstant()) {
						if(param.getIsConstant()) 
							paramValue = param.getValue();
						else 
							paramValue = JsonPath.read(request, param.getJsonPath());
					}else
						paramValue = JsonPath.read(request, param.getJsonPath());
					
					if (null == paramValue)
						continue;
					else 
						preparedStatementValues.put(param.getName(), paramValue);
					
				} catch (Exception e) {
					continue;
				}
				if (paramValue instanceof net.minidev.json.JSONArray) {
					String[] validListOperators = {"NOT IN", "IN"};
					String operator = (!StringUtils.isEmpty(param.getOperator())) ? " " + param.getOperator() + " " : " IN ";
					if(!Arrays.asList(validListOperators).contains(operator))
						operator = " IN "; 
					whereClause.append(param.getName()).append(operator).append("(").append(":"+param.getName()).append(")");
				} else {
					String[] validOperators = {"=", "GE", "LE", "NE", "LIKE"};
					String operator = (!StringUtils.isEmpty(param.getOperator())) ? param.getOperator(): "=";
					if(!Arrays.asList(validOperators).contains(operator))
						operator = "="; 
					if (operator.equals("GE"))
						operator = ">=";
					else if (operator.equals("LE"))
						operator = "<=";
					else if (operator.equals("NE"))
						operator = "!=";
					else if (operator.equals("LIKE")) {
						preparedStatementValues.put(param.getName(), "%" + paramValue + "%");
					}								
					whereClause.append(param.getName()).append(" " + operator + " ").append(":"+param.getName());
				}
				whereClause.append(" " + condition + " ");
			}
		}catch(Exception e) {
			log.error("Exception while bulding query: ", e);
			throw new CustomException("QUERY_BUILD_ERROR", "Exception while bulding query");
		}
		return whereClause.toString().substring(0, whereClause.toString().lastIndexOf(searchParam.getCondition()));
	}

	
	/**
	 * Pagination clause builder
	 * 
	 * @param searchRequest
	 * @param pagination
	 * @return
	 */
	public String getPaginationClause(SearchRequest searchRequest, Pagination pagination) {
		StringBuilder paginationClause = new StringBuilder();
		Object limit = null;
		Object offset = null;
		if (null != pagination) {
			try {
				limit = JsonPath.read(mapper.writeValueAsString(searchRequest), pagination.getNoOfRecords());
				offset = JsonPath.read(mapper.writeValueAsString(searchRequest), pagination.getOffset());
			} catch (Exception e) {
				log.error("Error while fetching limit and offset, using default values.");
			}
		}
		paginationClause.append(" LIMIT ")
				.append((!StringUtils.isEmpty((null != limit) ? limit.toString() : null) ? limit.toString()
						: defaultPageSize))
				.append(" OFFSET ")
				.append((!StringUtils.isEmpty((null != offset) ? offset.toString() : null) ? offset.toString()
						: defaultOffset));

		return paginationClause.toString();
	}

	/**
	 * Fetches Search Definitions, defined in the configuration.
	 * 
	 * @param searchDefinitionMap
	 * @param moduleName
	 * @param searchName
	 * @return
	 */
	public Definition getSearchDefinition(Map<String, SearchDefinition> searchDefinitionMap, String moduleName,
			String searchName) {
		log.debug("Fetching Definitions for module: " + moduleName + " and search feature: " + searchName);
		List<Definition> definitions = null;
		try {
			definitions = searchDefinitionMap.get(moduleName).getDefinitions().stream()
					.filter(def -> (def.getName().equals(searchName))).collect(Collectors.toList());
		} catch (Exception e) {
			throw new CustomException("NO_SEARCH_DEFINITION_EXCEPTION", "There's no Search Definition provided for this search feature");
		}
		if (CollectionUtils.isEmpty(definitions)) {
			throw new CustomException("NO_SEARCH_DEFINITION_FOUND","There's no Search Definition provided for this search feature");
		}
		return definitions.get(0);

	}

	/**
	 * Formatter util for PG objects.
	 * 
	 * @param maps
	 * @return
	 */
	public List<String> convertPGOBjects(List<PGobject> maps){
		List<String> result = new ArrayList<>();
		if(null != maps || !maps.isEmpty()) {
			for(PGobject obj: maps){
				if(null == obj.getValue())
					break;
				String tuple = obj.toString();
				if(tuple.startsWith("[") && tuple.endsWith("]")){
					try {
						JSONArray jsonArray = new JSONArray(tuple);
						for(int i = 0; i < jsonArray.length();  i++){
							result.add(jsonArray.get(i).toString());
						}
					}catch(Exception e) {
						log.error("Error while building json array!", e);
					}
				}else{
					try{
						result.add(obj.getValue());
					}catch(Exception e){
						throw e;
					}
				}
			}
		}
		
		return result;
	}

}
