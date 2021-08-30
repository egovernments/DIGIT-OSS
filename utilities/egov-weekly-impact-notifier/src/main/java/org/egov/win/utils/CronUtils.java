package org.egov.win.utils;

import java.text.DateFormatSymbols;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.win.config.PropertyManager;
import org.egov.win.model.SearcherRequest;
import org.egov.win.service.ExternalAPIService;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import java.time.temporal.ChronoUnit;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CronUtils {


	@Autowired
	private PropertyManager propertyManager;
	
	@Autowired
	private ExternalAPIService service;
	
	private static final String MODULE_NAME = "{moduleName}";

	private static final String SEARCH_NAME = "{searchName}";

	/**
	 * Prepares request and uri for rainmaker data search
	 * 
	 * @param uri
	 * @param defName
	 * @return SearcherRequest
	 */
	public SearcherRequest preparePlainSearchReq(StringBuilder uri, String defName) {
		uri.append(propertyManager.getSearcherHost());
		String endPoint = propertyManager.getSearcherEndpoint().replace(MODULE_NAME, CronConstants.SEARCHER_CRON_MOD_NAME)
				.replace(SEARCH_NAME, defName);
		uri.append(endPoint);
		HashMap<String, Object> param = new HashMap<>();
		if(defName.equals(CronConstants.SEARCHER_MC) || defName.equals(CronConstants.SEARCHER_SW)) {
			List<String> adhocTaxHeads = service.fetchAdhocTaxheads(new RequestInfo(), "pb");
			if(!CollectionUtils.isEmpty(adhocTaxHeads)) {
				param.put("taxHeads", adhocTaxHeads);
			}else {
				String[] ignoreTaxheads = {"PT", "TL", "FIRENOC", "WS"}; //fallback if mdms fails.
				param.put("ignoreTaxHeads", Arrays.asList(ignoreTaxheads));
			}
			param.put("ignoreTenant", "pb.testing");
			param.put("ignoreStatus", "Cancelled");
		}
		param.put("intervalinsecs", propertyManager.getTimeInterval());
		SearcherRequest searcherRequest = SearcherRequest.builder().requestInfo(new RequestInfo()).searchCriteria(param)
				.build();
		return searcherRequest;
	}
	
	/**
	 * Method to build the body for MDMS request
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsCriteriaReq getReqForTaxHeads(StringBuilder uri, RequestInfo requestInfo, String tenantId) {
		uri.append(propertyManager.getMdmsHost()).append(propertyManager.getMdmsSearchEndpoint());
		List<MasterDetail> masterDetails = new ArrayList<>();
		MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder()
				.name(CronConstants.MDMS_TAXHEAD_MASTER)
				.filter(CronConstants.MDMS_TAXHEAD_FILTER).build();
		masterDetails.add(masterDetail);
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(CronConstants.MDMS_BUISNESS_SERVICE_MODULE)
				.masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		tenantId = tenantId.split("\\.")[0]; //state-level master
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}
		
	/**
	 * Prepares request and uri for WS data search
	 * 
	 * @param uri
	 * @param defName
	 * @return SearcherRequest
	 */
	public void prepareWSSearchReq(StringBuilder uri) {
		uri.append(propertyManager.getWsHost());
		String endPoint = propertyManager.getWsEndpoint()
				.replace("{ulbCode}", propertyManager.getWsULBCode())
				.replace("{date}", String.valueOf((new Date().getTime())))
				.replace("{interval}", propertyManager.getWsIntervalInMS().toString());
		uri.append(endPoint);		
	}

	/**
	 * Returns mapper with all the appropriate properties reqd in our
	 * functionalities.
	 * 
	 * @return ObjectMapper
	 */
	public ObjectMapper getObjectMapper() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

		return mapper;
	}
	
	public Map<String, Object> getWeekWiseRevenue(List<Map<String, Object>> wsData){
		Map<String, Object> map = new HashMap<>();
		int index = 0;
		for(Map<String, Object> data: wsData) {
			map.put("Week" + index, data);
			index++;
		}
		return map;
	}

	/**
	 * Fetches day and month alongwith suffix of the data being fetched.
	 * 
	 * @param epochTime
	 * @return
	 */
	public String getDayAndMonth(Long epochTime) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(epochTime);
		StringBuilder date = new StringBuilder();
		String suffix = null;
		if (calendar.get(Calendar.DAY_OF_MONTH) >= 11 && calendar.get(Calendar.DAY_OF_MONTH) <= 13) {
			suffix = "th ";
		} else {
			Integer dateEndingwith = calendar.get(Calendar.DAY_OF_MONTH) % 10;
			switch (dateEndingwith) {
			case 1:
				suffix = "st ";
				break;
			case 2:
				suffix = "nd ";
				break;
			case 3:
				suffix = "rd ";
				break;
			default:
				suffix = "th ";
				break;
			}
		}

		date.append(calendar.get(Calendar.DAY_OF_MONTH)).append(suffix)
				.append(new DateFormatSymbols().getMonths()[calendar.get(Calendar.MONTH)]);
		return date.toString();
	}
	
	public RestTemplate restTemplate() {
		HttpComponentsClientHttpRequestFactory clientRequestFactory = new HttpComponentsClientHttpRequestFactory();
		clientRequestFactory.setReadTimeout(propertyManager.getRestTemplateInMS());
		RestTemplate restTemplate = new RestTemplate(clientRequestFactory);
	    return restTemplate;
	}

}
