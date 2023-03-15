package org.egov.userevent.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.userevent.config.PropertiesManager;
import org.egov.userevent.repository.RestCallRepository;
import org.egov.userevent.utils.ErrorConstants;
import org.egov.userevent.utils.UserEventsConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MDMSService {
	
	@Autowired
	private RestCallRepository repository;
	
	@Autowired
	private PropertiesManager props;
	
	
	/**
	 * Method to fetch event types from MDMS
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public Map<String, List<String>> fetchEventMasters(RequestInfo requestInfo, String tenantId) {
		StringBuilder uri = new StringBuilder();
		Map<String, List<String>> eventMasters = new HashMap<>();
		uri.append(props.getMdmsHost()).append(props.getMdmsSearchEndpoint());
		Optional<Object> response = repository.fetchResult(uri, getRequestForEvents(requestInfo, tenantId));
		List<String> codes = new ArrayList<>();
		try {
			if(response.isPresent()) {
				codes = JsonPath.read(response.get(), UserEventsConstants.MEN_MDMS_EVENTMASTER_CODES_JSONPATH);
				eventMasters.put(UserEventsConstants.MEN_MDMS_EVENTMASTER_CODE, codes);
				codes = JsonPath.read(response.get(), UserEventsConstants.MEN_MDMS_EVENTCATEGORY_MASTER_CODES_JSONPATH);
				eventMasters.put(UserEventsConstants.MEN_MDMS_EVENTCATEGORY_MASTER_CODE, codes);
			}
			else
				throw new Exception();
		}catch(Exception e) {
			throw new CustomException(ErrorConstants.MEN_ERROR_FROM_MDMS_CODE, ErrorConstants.MEN_ERROR_FROM_MDMS_MSG);
		}
		return eventMasters;
	}
	
	/**
	 * Method to build the body for MDMS request
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	private MdmsCriteriaReq getRequestForEvents(RequestInfo requestInfo, String tenantId) {
		List<MasterDetail> masterDetails = new ArrayList<>();
		MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder()
				.name(UserEventsConstants.MEN_MDMS_EVENTMASTER_CODE)
				.filter(UserEventsConstants.MEN_MDMS_EVENTMASTER_FILTER).build();
		masterDetails.add(masterDetail);
		masterDetail = org.egov.mdms.model.MasterDetail.builder()
				.name(UserEventsConstants.MEN_MDMS_EVENTCATEGORY_MASTER_CODE)
				.filter(UserEventsConstants.MEN_MDMS_EVENTCATEGORY_MASTER_FILTER).build();
		masterDetails.add(masterDetail);
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(UserEventsConstants.MEN_MDMS_MODULE_CODE)
				.masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		tenantId = tenantId.split("\\.")[0]; //state-level master
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

}
