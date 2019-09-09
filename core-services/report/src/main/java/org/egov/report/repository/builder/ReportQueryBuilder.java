package org.egov.report.repository.builder;

import java.net.URI;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.WeakHashMap;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.swagger.model.ExternalService;
import org.egov.swagger.model.ReportDefinition;
import org.egov.swagger.model.SearchColumn;
import org.egov.swagger.model.SearchParam;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonInclude.Include;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.google.gson.Gson;
import com.jayway.jsonpath.JsonPath;

@Component
public class ReportQueryBuilder {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${mdms.search.enabled}")
	private boolean isSearchEnabled;
		 
	public static final Logger LOGGER = LoggerFactory.getLogger(ReportQueryBuilder.class);
	   
	public String buildQuery(List<SearchParam> searchParams, String tenantId, ReportDefinition reportDefinition,String authToken, Long userId) {
		
		String baseQuery = null;
		
		
		StringBuffer csinput = new StringBuffer();
		LOGGER.info("ReportDefinition: "+reportDefinition);
		if(reportDefinition.getQuery().contains("UNION")){
			baseQuery = generateUnionQuery(searchParams, tenantId, reportDefinition);
		}else if(reportDefinition.getQuery().contains("FULLJOIN")){
			baseQuery = generateJoinQuery(searchParams, tenantId, reportDefinition);
		} 
		else {
			
			baseQuery = generateQuery(searchParams, tenantId, reportDefinition,baseQuery);
			
		}
		
		try {
			if(reportDefinition.getExternalService().size() > 0) {
				baseQuery = populateExternalServiceValues(reportDefinition, baseQuery,tenantId,authToken);
			} } catch(JSONException e){
				e.printStackTrace();
			}
		
		baseQuery = baseQuery.replaceAll("\\$tenantid","'"+tenantId+"'");

		if (reportDefinition.getModuleName().equalsIgnoreCase("rainmaker-pgr")) {
			baseQuery = baseQuery.replaceAll("\\$userid", "'" + userId + "'");
		}

		for(SearchParam searchParam : searchParams){
				
			Object value = searchParam.getInput();
			
			if(value instanceof Number)
			{
			baseQuery = baseQuery.replaceAll("\\$"+searchParam.getName(),value.toString());
			}
			
			if(value instanceof String ){
				
			baseQuery = baseQuery.replaceAll("\\$"+searchParam.getName(),"'"+value.toString()+"'");
			} if (value instanceof Boolean ){
				
				baseQuery = baseQuery.replaceAll("\\$"+searchParam.getName(),value.toString());
				
			}
			if(value instanceof ArrayList<?>) {
				
				List<String> arrayInput = (ArrayList)value;
			
			    for(int i=0;i<arrayInput.size();i++) {
			    	if (i < (arrayInput.size()-1)) {
			    	csinput.append("'"+arrayInput.get(i)+"',");
			    	} else {
			    		csinput.append("'"+arrayInput.get(i)+"'");
			    	}
			    	
			    }
				baseQuery = baseQuery.replaceAll("\\$"+searchParam.getName(),csinput.toString());
			}
				
		}
		
		LOGGER.info("baseQuery :"+baseQuery);
		return baseQuery;
	}
	
	private String populateExternalServiceValues(ReportDefinition reportDefinition, String baseQuery,String tenantid,String authToken)
			throws JSONException{
		String url;
		String res = "";
		String replacetableQuery = baseQuery;
		String requestInfoJson = "";
		String finalJson = "";
		for (ExternalService es : reportDefinition.getExternalService()) {
			
			if(es.getPostObject() != null) {
			//JsonObject jsonObjecttest = (new JsonParser()).parse(es.getPostObject()).getAsJsonObject();
			String jsonObjecttest = es.getPostObject();
			
			HashMap map = new HashMap();
			map.put("RequestInfo", getRInfo(authToken));
			//map.put(es.getObjectKey(),jsonObjecttest);
			try {
				 Gson gson = new Gson(); 
				 requestInfoJson = gson.toJson(map); 
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			requestInfoJson = StringUtils.chop(requestInfoJson);
			 finalJson = jsonObjecttest.replaceAll("\\$RequestInfo", requestInfoJson);
			 finalJson = finalJson.concat("}");
			}
			
			if(!isSearchEnabled) {
				LOGGER.info("Entering _get block");
				url = es.getApiURL();
				LOGGER.info("URL from yaml config: "+url);
				url = url.replaceAll("\\$currentTime", Long.toString(getCurrentTime()));
				 String[] stateid = null;
				if(es.getStateData() && (!tenantid.equals("default"))) {
					LOGGER.info("State Data");
					stateid = tenantid.split("\\.");
					url = url.replaceAll("\\$tenantid",stateid[0]);
					finalJson = finalJson.replaceAll("\\$tenantid",stateid[0]);
				} else {
					LOGGER.info("Tenant Data");
					url = url.replaceAll("\\$tenantId",tenantid);
					finalJson = finalJson.replaceAll("\\$tenantid",tenantid);
				}
				LOGGER.info("Mapper Converted string with replaced values "+requestInfoJson);
				URI uri = URI.create(url);
				LOGGER.info("URI: "+uri);				
				MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
			    Map headerMap = new HashMap<String, String>();
			    headerMap.put("Content-Type", "application/json");
			    headers.setAll(headerMap);
			    HttpEntity<?> request = new HttpEntity<>(finalJson, headers);
			    try {
			    	if(es.getPostObject() != null){
						res = restTemplate.postForObject(uri,request ,String.class);
						LOGGER.info("Response - 1: "+res);				
			    	}else {
						res = restTemplate.postForObject(uri,getRInfo(authToken) ,String.class);	
						LOGGER.info("Response - 2 : "+res);				
					}
				 } catch(HttpClientErrorException e){
						LOGGER.error("Exception while fetching data from mdms: ",e);
				 }
			}else {	
				ObjectMapper mapper = new ObjectMapper();
				LOGGER.info("Entering _search block");
				url = es.getApiURL();
				LOGGER.info("URL from yaml config: "+url);
				String uri = null;
				MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
				String[] criteriaArray = null;
				Map<String, String> keyValueMap = new WeakHashMap<>();
				if(reportDefinition.getVersion().equals("1.0.0")) {
					LOGGER.info("Entering old config block");
					String[] splitUrl = url.split("[?]");
					uri = splitUrl[0].replaceAll("_get", "_search");
					String queryParam = null;
					if(splitUrl[1].contains("|")) {
						queryParam = splitUrl[1].split("|")[0];
						criteriaArray = queryParam.split("[&]");
					}else {
						queryParam = splitUrl[1];
						criteriaArray = queryParam.split("[&]");
					}
					LOGGER.info("criteria: "+criteriaArray);
					for(String pair:  criteriaArray) {
						if(pair.split("=")[0].equals("tenantId"))
							continue;
						keyValueMap.put(pair.split("=")[0], pair.split("=")[1]);
					}
				}else {
					LOGGER.info("Entering new config block");
					uri = url;
					String criteria = es.getCriteria();
					if(null != criteria) {
						criteriaArray = criteria.split(",");
						LOGGER.info("criteria: "+criteriaArray);
						for(String pair:  criteriaArray) {
							if(pair.split("=")[0].equals("tenantId"))
								continue;
							keyValueMap.put(pair.split("=")[0], pair.split("=")[1]);
						}
					
					}
				}
				LOGGER.info("keyValueMap: "+keyValueMap);
				MasterDetail masterDetail = new MasterDetail();
				masterDetail.setName(keyValueMap.get("masterName"));
				masterDetail.setFilter(keyValueMap.get("filter"));
				List<MasterDetail> masterDetails = new ArrayList<>();
				masterDetails.add(masterDetail);
				ModuleDetail moduleDetail = new ModuleDetail();
				moduleDetail.setMasterDetails(masterDetails);
				moduleDetail.setModuleName(keyValueMap.get("moduleName"));
				List<ModuleDetail> moduleDetails = new ArrayList<>();
				moduleDetails.add(moduleDetail);
				MdmsCriteria mdmsCriteria = new MdmsCriteria();
				mdmsCriteria.setTenantId(tenantid);
				mdmsCriteria.setModuleDetails(moduleDetails);
				mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
				mdmsCriteriaReq.setRequestInfo(getRInfo(authToken));
				LOGGER.info("URI: "+uri);				
				try {
					LOGGER.info("Request: "+mapper.writeValueAsString(mdmsCriteriaReq));
					res = restTemplate.postForObject(uri,mdmsCriteriaReq ,String.class);
					LOGGER.info("MDMS response: "+res);
				}catch(Exception e) {
					LOGGER.error("Exception while fetching data from mdms: ",e);
				}
			}
			

			Object jsonObject = JsonPath.read(res,es.getEntity());
			
			JSONArray mdmsArray = new JSONArray(jsonObject.toString());
			 
			 StringBuffer finalString = new StringBuffer();
			 
			 for (int i = 0; i < mdmsArray.length(); i++) {
					JSONObject obj = mdmsArray.getJSONObject(i);

					StringBuffer sb = new StringBuffer();
					sb.append("(");

					String[] jsonKeys = es.getKeyOrder().split(",");

					for (int k=0; k<jsonKeys.length; k++) {

						String value = "";
						if(obj.has(jsonKeys[k])){
					    value = String.valueOf(obj.get(jsonKeys[k]));
						} 
						if(value.contains("'")){
							String formatted = value.replace("'", "''");
							sb.append("'" + formatted + "'");
							
						} else {
							sb.append("'" + value + "'");
						}
						
						if ((k != jsonKeys.length-1)) {
							sb.append(",");
						}
					}
					sb.append(")");
					if (i != (mdmsArray.length() - 1)) {
						sb.append(",");
					}

					finalString.append(sb);
				
				}
			 
			 if(mdmsArray.length() == 0) {
				 StringBuffer sb = new StringBuffer();
				 sb.append("(");
				 int i = 0;
				 for(String key: es.getKeyOrder().split(",")){
					 if(i != es.getKeyOrder().split(",").length-1) {
					 sb.append("'',");
					 } else {
						 sb.append("''");
					 }
					 i++;
				 }
				 sb.append(")");
				 finalString.append(sb);
			 }
		       
			 replacetableQuery = replacetableQuery.replace(es.getTableName(), finalString.toString());
			
		}
		return replacetableQuery;
	}
public String generateQuery(List<SearchParam> searchParams, String tenantId, ReportDefinition reportDefinition,String inlineQuery){
		
		
		
		StringBuffer query = new StringBuffer();
		
		if(inlineQuery != null){
		
			query = new StringBuffer(inlineQuery);
		} else {
			query = new StringBuffer(reportDefinition.getQuery());
		}
		String orderByQuery = reportDefinition.getOrderByQuery();
		String groupByQuery = reportDefinition.getGroupByQuery();
		
		query = addSearchClause(searchParams, reportDefinition, query);
	
	if(groupByQuery != null){
		query.append(" "+ groupByQuery);
	}

	if(orderByQuery != null) {
		
		query.append(" "+ orderByQuery);
		
	}
    LOGGER.info("generate baseQuery :"+query);
    return query.toString();
}

public String generateUnionQuery(List<SearchParam> searchParams, String tenantId, ReportDefinition reportDefinition){
	
	
	
	String baseQuery = reportDefinition.getQuery();
	
	String[] unionQueries = baseQuery.split("UNION");
	
	StringBuffer query = new StringBuffer();
	StringBuffer finalQuery = new StringBuffer();
	StringBuffer finalUnionQuery = new StringBuffer();
	
	for(int i=0; i<unionQueries.length; i++) {
		
		query = new StringBuffer(unionQueries[i]);
	   
		query = addSearchClause(searchParams, reportDefinition, query);
	
		String groupByQuery = reportDefinition.getGroupByQuery(); 
		if(groupByQuery != null){
			query.append(" "+ groupByQuery);
	    }
		if(i > 0) {
		finalQuery.append(" UNION "+query.toString()+ " ");
		} else {
			finalQuery.append(query.toString());
		}
	}
	
	
	

     String orderByQuery = reportDefinition.getOrderByQuery(); 
     
     String alteredOrderByQuery = "";
      if(finalQuery.toString().trim().contains("  UNION  ALL ")){
      String[] unionall = finalQuery.toString().split("  UNION  ALL ");
      for(int j=0; j<unionall.length; j++) {
    	  
    	  
    	  if(j < unionall.length-1) {
    		  finalUnionQuery.append(unionall[j] );
    		  if(orderByQuery != null){
        	  		
    			  finalUnionQuery.append(" "+ orderByQuery);
        	      } 
    		  finalUnionQuery.append(" UNION ALL ");
    		  
    	  } else{
    		  finalUnionQuery.append(unionall[j] );
    		  if(orderByQuery != null){
      	  		
    			  finalUnionQuery.append(" "+ orderByQuery);
        	      } 
    		  
    		  
    	      }
      }
      }else {
      
    	  finalUnionQuery.append(" "+ finalQuery);
  	if(orderByQuery != null){
  		
  		finalUnionQuery.append(" "+ orderByQuery);
      }
      }
      
      
      return finalUnionQuery.toString();
    }
	public String generateJoinQuery(List<SearchParam> searchParams, String tenantId, ReportDefinition reportDefinition){
		
		
		
		String baseQuery = reportDefinition.getQuery();
		
		String[] joinQueries = baseQuery.split("FULLJOIN");
		
		StringBuffer query = new StringBuffer();
		StringBuffer finalQuery = new StringBuffer();
		
		for(int i=0; i<joinQueries.length; i++) {
			
			query = new StringBuffer(joinQueries[i]);
			
			query = addSearchClause(searchParams, reportDefinition, query);
			String groupByQuery = reportDefinition.getGroupByQuery(); 
			if(groupByQuery != null){
				if (i==0){
					String[] group = groupByQuery.split("using");
					groupByQuery = group[i];
					 
				}
				groupByQuery = groupByQuery.replaceAll("\\$result", ("result"+i));
				query.append(" "+ groupByQuery);
		    }
			if(i > 0) {
			finalQuery.append(" JOIN "+query.toString()+ " ");
			} else {
				finalQuery.append(query.toString());
			}
		}
		String orderByQuery = reportDefinition.getOrderByQuery(); 
		if(orderByQuery != null){
			finalQuery.append(" "+ orderByQuery);
	    }
		
		finalQuery.toString();
	
	return finalQuery.toString();
	}

	private StringBuffer addSearchClause(List<SearchParam> searchParams, ReportDefinition reportDefinition,
			StringBuffer query) {
		for(SearchParam searchParam : searchParams){
			
			Object name = searchParam.getName();
			
		    for (SearchColumn sc : reportDefinition.getSearchParams()) 
		    {
		            if(name.equals(sc.getName())){
		            	if(sc.getSearchClause() != null) {
		            		if(searchParam.getInput() instanceof ArrayList<?>){
		            			LOGGER.info("Coming in to the instance of ArrayList ");
			            		ArrayList<?> list = new ArrayList<>();
			            		list = (ArrayList)(searchParam.getInput());
			            		LOGGER.info("Check the list is empty "+list.size());
			            		if(list.size() > 0) {
			            			
			            			query.append(" " +sc.getSearchClause());
			            			
			            		}
			            		
			            	} else {
		            	query.append(" " +sc.getSearchClause());
			            	}
		            	
		            	}
		            }
		    }
			
		
}
		return query;
	}
	
	
	public String buildInlineQuery(Object json) throws Exception{
		ObjectMapper mapper = new ObjectMapper();
		json = mapper.writeValueAsString(json);
		StringBuilder inlineQuery = new StringBuilder();
		if(json.toString().startsWith("[") && json.toString().endsWith("]")){
			LOGGER.info("Building inline query for JSONArray.....");
			JSONArray array = new JSONArray(json.toString());
			try{
				Map<String, Object> map = new HashMap<>();
				map = mapper.readValue(array.getString(0).toString(), new TypeReference<Map<String, String>>(){});
				StringBuilder table = new StringBuilder();
				StringBuilder values = new StringBuilder();
				table.append("table (");
				values.append("(VALUES (");
				for(Map.Entry<String, Object> row: map.entrySet()){
					table.append(row.getKey()+",");
				}
				for(int i = 0; i < array.length(); i++){
					Map<String, Object> jsonMap = new HashMap<>();
					jsonMap = mapper.readValue(array.getString(i).toString(), new TypeReference<Map<String, String>>(){});
					values.append("(");
					for(Map.Entry<String, Object> row: jsonMap.entrySet()){
						String value = row.getValue().toString();
						System.out.println("Values with single quotes without formatting"+value);
						if(value.contains("'")){
							String formatted = value.replace("'", "''");
							System.out.println("Values with single quotes "+formatted);
							values.append("'"+formatted+"'"+",");	
						} else {
						values.append("'"+row.getValue()+"'"+",");	
						}
					}
					values.replace(values.length() - 1, values.length(), "),");
				}
				table.replace(table.length() - 1, table.length(), ")");
				LOGGER.info("tables: "+table.toString());
				
				values.replace(values.length() - 1, values.length(), ")");
				
				
				inlineQuery.append(values.toString())
				.append(" AS ")
				.append(table.toString());
			}catch(Exception e){
				LOGGER.error("Exception while building inline query, Valid Data format: [{},{}]. Please verify: ",e);
			}
			
			
			
		}else{
			LOGGER.info("Building inline query for a JSON Object.....");
			try{
				Map<String, Object> map = new HashMap<>();
				map = mapper.readValue(json.toString(), new TypeReference<Map<String, Object>>(){});
				StringBuilder table = new StringBuilder();
				StringBuilder values = new StringBuilder();
				table.append("table (");
				values.append("(VALUES (");
				for(Map.Entry<String, Object> row: map.entrySet()){
					table.append(row.getKey()+",");
					values.append("'"+row.getValue()+"'"+",");	
				}
				table.replace(table.length() - 1, table.length(), ")");
				LOGGER.info("tables: "+table.toString());
				
				values.replace(values.length() - 1, values.length(), "))");
				LOGGER.info("values: "+values.toString());
				
				inlineQuery.append(values.toString())
				.append(" AS ")
				.append(table.toString());
			}catch(Exception e){
				LOGGER.error("Exception while building inline query: ",e);
			}
			
			
		}
		
		return inlineQuery.toString();
	}
	
	public RequestInfo getRInfo(String authToken)
	{
		// TODO Auto-generated method stub
				RequestInfo ri = new RequestInfo();
				ri.setAction("action");
				ri.setAuthToken(authToken);
				/*ri.setTs(new Date());*/
				ri.setApiId("apiId");
				ri.setVer("version");
				ri.setDid("did");
				ri.setKey("key");
				ri.setMsgId("msgId");
				ri.setRequesterId("requestId");
		return ri;
	}
   
	public long getCurrentTime(){
		  Calendar calendar = Calendar.getInstance();
		  calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
		  return calendar.getTimeInMillis();
		}
	private static ObjectMapper getMapperConfig() {
		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.setSerializationInclusion(Include.NON_NULL);
		return mapper;
	}

}


