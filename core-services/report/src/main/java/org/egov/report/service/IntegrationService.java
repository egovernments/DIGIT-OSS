package org.egov.report.service;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLDecoder;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.domain.model.RequestInfoWrapper;
import org.egov.swagger.model.ColumnDetail;
import org.egov.swagger.model.ColumnDetail.TypeEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.egov.swagger.model.MetadataResponse;
import org.egov.swagger.model.ReportDefinition;
import org.egov.swagger.model.SearchColumn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriTemplate;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;


@Service
public class IntegrationService {
	
	@Autowired
	private RestTemplate restTemplate;
	
	public static final Logger LOGGER = LoggerFactory.getLogger(IntegrationService.class);
	
	public MetadataResponse getData(ReportDefinition reportDefinition, MetadataResponse metadataResponse, RequestInfo requestInfo,String moduleName){
		
		
		List<SearchColumn>  searchColumns = reportDefinition.getSearchParams();
		List<ColumnDetail> columnDetails = metadataResponse.getReportDetails().getSearchParams();
		Map<String, ColumnDetail> colNameMap = columnDetails.stream().collect(Collectors.toMap(ColumnDetail::getName, Function.identity()));
		
		
		for(SearchColumn searchColumn : searchColumns){
			
			if(searchColumn.getType().equals(TypeEnum.SINGLEVALUELIST) || searchColumn.getType().equals(TypeEnum.SINGLEVALUELISTAC) || searchColumn.getType().equals(TypeEnum.MULTIVALUELIST) || searchColumn.getType().equals(TypeEnum.MULTIVALUELISTAC)){
				LOGGER.info("if searchColumn:"+searchColumn);
				LOGGER.info("Pattern is:"+searchColumn.getColName());
				
				String[] patterns= searchColumn.getPattern().split("\\|");
				LOGGER.info("patterns:"+patterns.toString());
				String url = patterns[0];
				//url = url.replaceAll("\\$tenantid",metadataResponse.getTenantId());
				LOGGER.info("url:"+url);
				ColumnDetail columnDetail = colNameMap.get(searchColumn.getName());
				
				if(url != null && url.startsWith("list://")){
					//consider this as fixed value and send this after removing list://
					url = url.substring(7);
					Map<Object, Object> map = new LinkedHashMap<>();
					String[] pairs = url.split(",");
					for(String str: pairs){
						String[] keyValue = str.split(":");
						map.put(keyValue[0].replace('_', ','), keyValue[1]);
						
					}
					columnDetail.setDefaultValue(map);
				}else{

					String res = "";
					 String[] stateid = null;
					 
					    url = url.replaceAll("\\$currentTime", Long.toString(getCurrentTime()));
					    
					    LOGGER.info("url:"+url);
					 
						if(searchColumn.getStateData() && (!metadataResponse.getTenantId().equals("default"))) {
							stateid = metadataResponse.getTenantId().split("\\.");
							url = url.replaceAll("\\$tenantid",stateid[0]);
						} else {
						
						url = url.replaceAll("\\$tenantid",metadataResponse.getTenantId());
						}
					
					try{
					if(searchColumn.getWrapper()){
						RequestInfoWrapper riw = generateRequestInfoWrapper(requestInfo);
						URI uri = URI.create(url);
					    res = restTemplate.postForObject(uri,riw, String.class);
						
					} else {
						
						res = restTemplate.postForObject(url,requestInfo, String.class);
					}
					
					
					Object document = Configuration.defaultConfiguration().jsonProvider().parse(res);
					
					List<Object> keys = JsonPath.read(document, patterns[1]);
					List<Object> values = JsonPath.read(document, patterns[2]);
					if(searchColumn.getLocalisationRequired()){
						List<Object> keysAfterLoc = new ArrayList<>();
						List<Object> valuesAfterLoc = new ArrayList<>();
						for(int i=0;i<keys.size();i++)
						{
							String servicecode=((String)keys.get(i)).replaceAll("\\..*","").toUpperCase();
							String localisationLabel=searchColumn.getLocalisationPrefix()+servicecode;
							if(!valuesAfterLoc.contains(localisationLabel))
							{
								keysAfterLoc.add(servicecode);
								valuesAfterLoc.add(localisationLabel);
							}
						}
						keys= keysAfterLoc;
						values=valuesAfterLoc;
					}
					Map<Object, Object> map = new LinkedHashMap<>();
					for(int i=0;i<keys.size();i++){
						map.put(keys.get(i), values.get(i));
					}
					
					columnDetail.setDefaultValue(map);
					} catch(Exception e) {
						e.printStackTrace();
					} 
					
				}
		}
	}
		return metadataResponse;
	}
	private RequestInfoWrapper generateRequestInfoWrapper(RequestInfo requestInfo) {
		RequestInfoWrapper riw = new RequestInfoWrapper();
		org.egov.swagger.model.RequestInfo ri = new org.egov.swagger.model.RequestInfo();
		ri.setAction(requestInfo.getAction());
		ri.setAuthToken(requestInfo.getAuthToken());
		ri.apiId(requestInfo.getApiId());
		ri.setVer(requestInfo.getVer());
		ri.setTs(1L);
		ri.setDid(requestInfo.getDid());
		ri.setKey(requestInfo.getKey());
		ri.setMsgId(requestInfo.getMsgId());
		ri.setRequesterId(requestInfo.getRequesterId());
		riw.setRequestInfo(ri);
		return riw;
	}
	
	public long getCurrentTime(){
	  Calendar calendar = Calendar.getInstance();
	  calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
	  return calendar.getTimeInMillis();
	}
}
