/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.commons.service;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.commons.config.ApplicationProperties;
import org.egov.commons.model.Department;
import org.egov.commons.repository.DepartmentRepository;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.egov.commons.web.contract.DepartmentRequest;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DepartmentService {

	private DepartmentRepository departmentRepository;

	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private ApplicationProperties applicatioProperties;

	@Autowired
	public DepartmentService(DepartmentRepository departmentRepository,
							 LogAwareKafkaTemplate<String, Object> kafkaTemplate) {

		this.departmentRepository = departmentRepository;
		this.kafkaTemplate = kafkaTemplate;

	}


	public DepartmentRequest createDepartmentAsync(DepartmentRequest departmentRequest) {

		kafkaTemplate.send("egov-common-department-create", departmentRequest);
		return departmentRequest;
	}

	public void createDepartment(Department modelDetails, Long userId) {
		departmentRepository.create(modelDetails, userId);
	}

	public DepartmentRequest updateDepartmentAsync(DepartmentRequest departmentRequest) {

		kafkaTemplate.send("egov-common-department-update", departmentRequest);
		return departmentRequest;
	}

	public void updateDepartment(Department model, Long userId) {
		departmentRepository.update(model, userId);
	}
	public List<Department> getDepartments(DepartmentGetRequest departmentGetRequest) {
		return departmentRepository.findForCriteria(departmentGetRequest);
	}
	
	public List<Department> getDepartmentsFromMDMS(RequestInfo requestInfo, DepartmentGetRequest departmentGetRequest) {
		StringBuilder uri = new StringBuilder();
		List<Department> result = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		uri.append(applicatioProperties.getMdmsHost()).append(applicatioProperties.getMdmsEndpoint());
		try {
			Object apiResponse = restTemplate.postForObject(uri.toString(), 
						prepareSearchRequestForDept(requestInfo, departmentGetRequest), Map.class);
			if(null != apiResponse) {
				result = mapper.convertValue(JsonPath.read(apiResponse, "$.MdmsRes.common-masters.Department"), List.class);
			}
		}catch(Exception e) {
			result = new ArrayList<>();
		}
		return result;
	}
	
	public MdmsCriteriaReq prepareSearchRequestForDept(RequestInfo requestInfo, DepartmentGetRequest departmentGetRequest) {

		MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder().name("Department").build();
		if(!StringUtils.isEmpty(departmentGetRequest.getName()))
			masterDetail.setFilter("[?(@.name=='" + departmentGetRequest.getName() + "')]");
		
		if(!StringUtils.isEmpty(departmentGetRequest.getCode()))
			masterDetail.setFilter("[?(@.code=='" + departmentGetRequest.getCode() + "')]");
		
		if(null != departmentGetRequest.getActive())
			masterDetail.setFilter("[?(@.active=='" + departmentGetRequest.getActive() + "')]");
		
		if(null != departmentGetRequest.getNames()) {
			List<String> names = departmentGetRequest.getNames().parallelStream()
					.map(obj -> {
						return "'"+obj+"'";
					}).collect(Collectors.toList());
			masterDetail.setFilter("[?(@.name IN " + names + ")]");
		}
		
		if(null != departmentGetRequest.getCodes()) {
			List<String> codes = departmentGetRequest.getCodes().parallelStream()
					.map(obj -> {
						return "'"+obj+"'";
					}).collect(Collectors.toList());
			masterDetail.setFilter("[?(@.code IN " + codes + ")]");
		}
		
		List<MasterDetail> masterDetails = new ArrayList<>();
		masterDetails.add(masterDetail);
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName("common-masters").masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(departmentGetRequest.getTenantId()).moduleDetails(moduleDetails).build();
		requestInfo.setTs(null); //there's type mismatch in ts of RI, we cannot update the commons library version cuz that'll break existing code.
		return MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(requestInfo).build();
	}

	public boolean getDepartmentByNameAndTenantId(String name, String tenantId, Long id, Boolean isUpdate) {
		return departmentRepository.checkDepartmentByNameAndTenantIdExists(name, tenantId, id, isUpdate);
	}

	public boolean getDepartmentByCodeAndTenantId(String code, String tenantId, Long id, Boolean isUpdate) {
		return departmentRepository.checkDepartmentByCodeAndTenantIdExists(code, tenantId, id, isUpdate);
	}


}