package org.egov.hrms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.config.PropertiesManager;
import org.egov.hrms.model.Employee;
import org.egov.hrms.repository.RestCallRepository;
import org.egov.hrms.utils.ErrorConstants;
import org.egov.hrms.web.contract.EmployeeRequest;
import org.egov.hrms.web.contract.IdGenerationRequest;
import org.egov.hrms.web.contract.IdGenerationResponse;
import org.egov.hrms.web.contract.IdRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class IdGenService {
	
	@Autowired
	private RestCallRepository repository;
	
	@Autowired
	private PropertiesManager properties;

	/**
	 * Sets ids to all the employee objects
	 * 
	 * @param employeeRequest
	 */
	public void setIds(EmployeeRequest employeeRequest) {
		String tenantId = employeeRequest.getEmployees().get(0).getTenantId();
		Integer employeesWithCode = employeeRequest.getEmployees().stream()
				.filter(employee -> !StringUtils.isEmpty(employee.getCode())).collect(Collectors.toList()).size();
		if(employeesWithCode == employeeRequest.getEmployees().size())
			return;
		IdGenerationResponse response = getId(employeeRequest.getRequestInfo(), tenantId, employeeRequest.getEmployees().size() - employeesWithCode,
				properties.getHrmsIdGenKey(), properties.getHrmsIdGenFormat());
		if(null != response) {
			int i = 0;
			for(Employee employee: employeeRequest.getEmployees()) {
				if(StringUtils.isEmpty(employee.getCode())) {
					employee.setCode(response.getIdResponses().get(i).getId());
					i++;
				}
			}
		}
	}
	
	/**
	 * Makes call to the idgen service to fetch ids for the employee object. Format of the id configurable.
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @param count
	 * @param name
	 * @param format
	 * @return
	 */
	public IdGenerationResponse getId(RequestInfo requestInfo, String tenantId, Integer count, String name, String format) {
		StringBuilder uri = new StringBuilder();
		ObjectMapper mapper = new ObjectMapper();
		uri.append(properties.getIdGenHost()).append(properties.getIdGenEndpoint());
		List<IdRequest> reqList = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			reqList.add(IdRequest.builder().idName(name).format(format).tenantId(tenantId).build());
		}
		IdGenerationRequest request = IdGenerationRequest.builder().idRequests(reqList).requestInfo(requestInfo).build();
		IdGenerationResponse response = null;
		try {
			response = mapper.convertValue(repository.fetchResult(uri, request), IdGenerationResponse.class);
		}catch(Exception e) {
			log.error("Exception while generating ids: ",e);
			log.error("Request: "+request);
			throw new CustomException(ErrorConstants.HRMS_GENERATE_ID_ERROR_CODE,ErrorConstants.HRMS_GENERATE_ID_ERROR_MSG);

		}
		return response;
	}
}
