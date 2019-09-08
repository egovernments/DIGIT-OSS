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

package org.egov.hrms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.config.PropertiesManager;
import org.egov.hrms.model.AuditDetails;
import org.egov.hrms.model.Employee;
import org.egov.hrms.model.enums.UserType;
import org.egov.hrms.producer.HRMSProducer;
import org.egov.hrms.repository.EmployeeRepository;
import org.egov.hrms.utils.ErrorConstants;
import org.egov.hrms.utils.HRMSConstants;
import org.egov.hrms.utils.HRMSUtils;
import org.egov.hrms.utils.ResponseInfoFactory;
import org.egov.hrms.web.contract.*;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Data
@Slf4j
@Service
public class EmployeeService {


	@Autowired
	private UserService userService;

	@Autowired
	private IdGenService idGenService;

	@Autowired
	private ResponseInfoFactory factory;

	@Autowired
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private PropertiesManager propertiesManager;

	@Autowired
	private HRMSProducer hrmsProducer;
	
	@Autowired
	private EmployeeRepository repository;
	
	@Autowired
	private HRMSUtils hrmsUtils;
	
	@Autowired
	private NotificationService notificationService;
	
	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * Service method for create employee. Does following:
	 * 1. Sets ids to all the objects using idgen service.
	 * 2. Enriches the employee object with required parameters
	 * 3. Creates user in the egov-user service.
	 * 4. Sends notification upon successful creation
	 * 
	 * @param employeeRequest
	 * @return
	 */
	public EmployeeResponse create(EmployeeRequest employeeRequest) {
		RequestInfo requestInfo = employeeRequest.getRequestInfo();
		Map<String, String> pwdMap = new HashMap<>();
		idGenService.setIds(employeeRequest);
		employeeRequest.getEmployees().stream().forEach(employee -> {
			enrichCreateRequest(employee, requestInfo);
			createUser(employee, requestInfo);
			pwdMap.put(employee.getUuid(), employee.getUser().getPassword());
			employee.getUser().setPassword(null);
		});
		hrmsProducer.push(propertiesManager.getSaveEmployeeTopic(), employeeRequest);
		notificationService.sendNotification(employeeRequest, pwdMap);
		return generateResponse(employeeRequest);
	}
	
	/**
	 * Searches employees on a given criteria.
	 * 
	 * @param criteria
	 * @param requestInfo
	 * @return
	 */
	public EmployeeResponse search(EmployeeSearchCriteria criteria, RequestInfo requestInfo) {
		if(null == criteria.getIsActive() || criteria.getIsActive())
			criteria.setIsActive(true);
		else
			criteria.setIsActive(false);
        Map<String, User> mapOfUsers = new HashMap<String, User>();
		if(!StringUtils.isEmpty(criteria.getPhone()) || !CollectionUtils.isEmpty(criteria.getRoles())) {
            Map<String, Object> userSearchCriteria = new HashMap<>();
            userSearchCriteria.put(HRMSConstants.HRMS_USER_SEARCH_CRITERA_TENANTID,criteria.getTenantId());
            if(!StringUtils.isEmpty(criteria.getPhone()))
                userSearchCriteria.put(HRMSConstants.HRMS_USER_SEARCH_CRITERA_MOBILENO,criteria.getPhone());
            if( !CollectionUtils.isEmpty(criteria.getRoles()) )
                userSearchCriteria.put(HRMSConstants.HRMS_USER_SEARCH_CRITERA_ROLECODES,criteria.getRoles());
            UserResponse userResponse = userService.getUser(requestInfo, userSearchCriteria);
            if(!CollectionUtils.isEmpty(userResponse.getUser())) {
                 mapOfUsers.putAll(userResponse.getUser().stream()
                        .collect(Collectors.toMap(User::getUuid, Function.identity())));
            }
			List<String> userUUIDs = userResponse.getUser().stream().map(User :: getUuid).collect(Collectors.toList());
            if(!CollectionUtils.isEmpty(criteria.getUuids()))
                criteria.setUuids(criteria.getUuids().stream().filter(userUUIDs::contains).collect(Collectors.toList()));
            else
                criteria.setUuids(userUUIDs);
		}
		if(!((!CollectionUtils.isEmpty(criteria.getRoles()) || !StringUtils.isEmpty(criteria.getPhone())) && CollectionUtils.isEmpty(criteria.getUuids()))){
			if(!CollectionUtils.isEmpty(criteria.getNames())) {
				List<String> userUUIDs = new ArrayList<>();
				for(String name: criteria.getNames()) {
					Map<String, Object> userSearchCriteria = new HashMap<>();
					userSearchCriteria.put(HRMSConstants.HRMS_USER_SEARCH_CRITERA_TENANTID,criteria.getTenantId());
					userSearchCriteria.put(HRMSConstants.HRMS_USER_SEARCH_CRITERA_NAME,name);
					UserResponse userResponse = userService.getUser(requestInfo, userSearchCriteria);
					if(!CollectionUtils.isEmpty(userResponse.getUser())) {
						mapOfUsers.putAll(userResponse.getUser().stream()
								.collect(Collectors.toMap(User::getUuid, Function.identity())));
					}
					List<String> uuids = userResponse.getUser().stream().map(User :: getUuid).collect(Collectors.toList());
					userUUIDs.addAll(uuids);
				}
				if(!CollectionUtils.isEmpty(criteria.getUuids()))
					criteria.setUuids(criteria.getUuids().stream().filter(userUUIDs::contains).collect(Collectors.toList()));
				else
					criteria.setUuids(userUUIDs);
			}
		}
        List <Employee> employees = new ArrayList<>();
        if(!((!CollectionUtils.isEmpty(criteria.getRoles()) || !CollectionUtils.isEmpty(criteria.getNames()) || !StringUtils.isEmpty(criteria.getPhone())) && CollectionUtils.isEmpty(criteria.getUuids())))
            employees = repository.fetchEmployees(criteria, requestInfo);
        List<String> uuids = employees.stream().map(Employee :: getUuid).collect(Collectors.toList());
		if(!CollectionUtils.isEmpty(uuids)){
            Map<String, Object> UserSearchCriteria = new HashMap<>();
            UserSearchCriteria.put(HRMSConstants.HRMS_USER_SEARCH_CRITERA_UUID,uuids);
            if(mapOfUsers.isEmpty()){
            UserResponse userResponse = userService.getUser(requestInfo, UserSearchCriteria);
			if(!CollectionUtils.isEmpty(userResponse.getUser())) {
				mapOfUsers = userResponse.getUser().stream()
						.collect(Collectors.toMap(User :: getUuid, Function.identity()));
            }
            }
            for(Employee employee: employees){
                employee.setUser(mapOfUsers.get(employee.getUuid()));
            }
		}
		return EmployeeResponse.builder().responseInfo(factory.createResponseInfoFromRequestInfo(requestInfo, true))
				.employees(employees).build();
	}
	
	
	/**
	 * Creates user by making call to egov-user.
	 * 
	 * @param employee
	 * @param requestInfo
	 */
	private void createUser(Employee employee, RequestInfo requestInfo) {
		enrichUser(employee);
		UserRequest request = UserRequest.builder().requestInfo(requestInfo).user(employee.getUser()).build();
		try {
			UserResponse response = userService.createUser(request);
			User user = response.getUser().get(0);
			employee.setId(user.getId());
			employee.setUuid(user.getUuid());
			employee.getUser().setId(user.getId());
			employee.getUser().setUuid(user.getUuid());
		}catch(Exception e) {
			log.error("Exception while creating user: ",e);
			log.error("request: "+request);
			throw new CustomException(ErrorConstants.HRMS_USER_CREATION_FAILED_CODE, ErrorConstants.HRMS_USER_CREATION_FAILED_MSG);
		}

	}

	/**
	 * Enriches the user object.
	 * 
	 * @param employee
	 */
	private void enrichUser(Employee employee) {
		List<String> pwdParams = new ArrayList<>();
		pwdParams.add(employee.getCode());
		pwdParams.add(employee.getUser().getMobileNumber());
		pwdParams.add(employee.getTenantId());
		pwdParams.add(employee.getUser().getName());
		employee.getUser().setPassword(hrmsUtils.generatePassword(pwdParams));
		employee.getUser().setUserName(employee.getCode());
		employee.getUser().setActive(true);
		employee.getUser().setType(UserType.EMPLOYEE.toString());
	}

	/**
	 * Enriches employee object by setting parent ids to all the child objects
	 * 
	 * @param employee
	 * @param requestInfo
	 */
	private void enrichCreateRequest(Employee employee, RequestInfo requestInfo) {

		AuditDetails auditDetails = AuditDetails.builder()
				.createdBy(requestInfo.getUserInfo().getUuid())
				.createdDate(new Date().getTime())
				.build();
		
		employee.getJurisdictions().stream().forEach(jurisdiction -> {
			jurisdiction.setId(UUID.randomUUID().toString());
			jurisdiction.setAuditDetails(auditDetails);
			if(null == jurisdiction.getIsActive())
				jurisdiction.setIsActive(true);
		});
		employee.getAssignments().stream().forEach(assignment -> {
			assignment.setId(UUID.randomUUID().toString());
			assignment.setAuditDetails(auditDetails);
			assignment.setPosition(getPosition());
		});
		if(!CollectionUtils.isEmpty(employee.getServiceHistory())) {
			employee.getServiceHistory().stream().forEach(serviceHistory -> {
				serviceHistory.setId(UUID.randomUUID().toString());
				serviceHistory.setAuditDetails(auditDetails);
				if(null == serviceHistory.getIsCurrentPosition())
					serviceHistory.setIsCurrentPosition(false);
			});
		}
		if(!CollectionUtils.isEmpty(employee.getEducation())) {
			employee.getEducation().stream().forEach(educationalQualification -> {
				educationalQualification.setId(UUID.randomUUID().toString());
				educationalQualification.setAuditDetails(auditDetails);
				if(null == educationalQualification.getIsActive())
					educationalQualification.setIsActive(true);
			});
		}
		if(!CollectionUtils.isEmpty(employee.getTests())) {
			employee.getTests().stream().forEach(departmentalTest -> {
				departmentalTest.setId(UUID.randomUUID().toString());
				departmentalTest.setAuditDetails(auditDetails);
				if(null == departmentalTest.getIsActive())
					departmentalTest.setIsActive(true);
			});
		}
		if(!CollectionUtils.isEmpty(employee.getDocuments())) {
			employee.getDocuments().stream().forEach(document -> {
				document.setId(UUID.randomUUID().toString());
				document.setAuditDetails(auditDetails);
			});
		}
		employee.setAuditDetails(auditDetails);
		employee.setIsActive(true);
	}
	
	/**
	 * Fetches next value from the position sequence table
	 * @return
	 */
	public Long getPosition() {
		return repository.fetchPosition();
	}

	/**
	 * Service method to update user. Performs the following:
	 * 1. Enriches the employee object with required parameters.
	 * 2. Updates user by making call to the user service.
	 * 
	 * @param employeeRequest
	 * @return
	 */
	public EmployeeResponse update(EmployeeRequest employeeRequest) {
		RequestInfo requestInfo = employeeRequest.getRequestInfo();
		List <String> uuidList= new ArrayList<>();
		for(Employee employee: employeeRequest.getEmployees()) {
			uuidList.add(employee.getUuid());
		}
		EmployeeResponse existingEmployeeResponse = search(EmployeeSearchCriteria.builder().uuids(uuidList).build(),requestInfo);
		List <Employee> existingEmployees = existingEmployeeResponse.getEmployees();
		employeeRequest.getEmployees().stream().forEach(employee -> {
			enrichUpdateRequest(employee, requestInfo, existingEmployees);
			updateUser(employee, requestInfo);
		});
		hrmsProducer.push(propertiesManager.getUpdateEmployeeTopic(), employeeRequest);

		return generateResponse(employeeRequest);
	}
	
	/**
	 * Updates the user by making call to the user service.
	 * 
	 * @param employee
	 * @param requestInfo
	 */
	private void updateUser(Employee employee, RequestInfo requestInfo) {
		UserRequest request = UserRequest.builder().requestInfo(requestInfo).user(employee.getUser()).build();
		try {
			userService.updateUser(request);
		}catch(Exception e) {
			log.error("Exception while updating user: ",e);
			log.error("request: "+request);
			throw new CustomException(ErrorConstants.HRMS_USER_UPDATION_FAILED_CODE, ErrorConstants.HRMS_USER_UPDATION_FAILED_MSG);
		}

	}

	/**
	 * Enriches update request with required parameters.
	 * 
	 * @param employee
	 * @param requestInfo
	 * @param existingEmployeesData
	 */
	private void enrichUpdateRequest(Employee employee, RequestInfo requestInfo, List<Employee> existingEmployeesData) {
		AuditDetails auditDetails = AuditDetails.builder()
				.createdBy(requestInfo.getUserInfo().getUserName())
				.createdDate(new Date().getTime())
				.build();
		Employee existingEmpData = existingEmployeesData.stream().filter(existingEmployee -> existingEmployee.getUuid().equals(employee.getUuid())).findFirst().get();

		employee.getUser().setUserName(employee.getCode());
		if(!employee.getIsActive())
			employee.getUser().setActive(false);
		else
			employee.getUser().setActive(true);

		employee.getJurisdictions().stream().forEach(jurisdiction -> {

			if(null == jurisdiction.getIsActive())
				jurisdiction.setIsActive(true);
			if(jurisdiction.getId()==null) {
				jurisdiction.setId(UUID.randomUUID().toString());
				jurisdiction.setAuditDetails(auditDetails);
			}else{
				if(!existingEmpData.getJurisdictions().stream()
						.filter(jurisdictionData ->jurisdictionData.getId().equals(jurisdiction.getId() ))
						.findFirst().orElse(null)
						.equals(jurisdiction)){
					jurisdiction.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
					jurisdiction.getAuditDetails().setLastModifiedDate(new Date().getTime());
				}
			}
		});
		employee.getAssignments().stream().forEach(assignment -> {
			if(assignment.getId()==null) {
				assignment.setId(UUID.randomUUID().toString());
				assignment.setAuditDetails(auditDetails);
			}else {
				if(!existingEmpData.getAssignments().stream()
						.filter(assignmentData -> assignmentData.getId().equals(assignment.getId()))
						.findFirst().orElse(null)
						.equals(assignment)){
					assignment.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
					assignment.getAuditDetails().setLastModifiedDate(new Date().getTime());
				}
			}
		});

		if(employee.getServiceHistory()!=null){
			employee.getServiceHistory().stream().forEach(serviceHistory -> {
				if(null == serviceHistory.getIsCurrentPosition())
					serviceHistory.setIsCurrentPosition(false);
				if(serviceHistory.getId()==null) {
					serviceHistory.setId(UUID.randomUUID().toString());
					serviceHistory.setAuditDetails(auditDetails);
				}else {
					if(!existingEmpData.getServiceHistory().stream()
							.filter(serviceHistoryData -> serviceHistoryData.getId().equals(serviceHistory.getId()))
							.findFirst().orElse(null)
							.equals(serviceHistory)){
						serviceHistory.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
						serviceHistory.getAuditDetails().setLastModifiedDate(new Date().getTime());
					}
				}
			});

		}

		if(employee.getEducation() != null){
			employee.getEducation().stream().forEach(educationalQualification -> {
				if(null == educationalQualification.getIsActive())
					educationalQualification.setIsActive(true);
				if(educationalQualification.getId()==null) {
					educationalQualification.setId(UUID.randomUUID().toString());
					educationalQualification.setAuditDetails(auditDetails);
				}else {

					if(!existingEmpData.getEducation().stream()
							.filter(educationalQualificationData -> educationalQualificationData.getId().equals(educationalQualification.getId()))
							.findFirst().orElse(null)
							.equals(educationalQualification)){
						educationalQualification.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
						educationalQualification.getAuditDetails().setLastModifiedDate(new Date().getTime());
					}
				}
			});

		}

		if(employee.getTests() != null){
			employee.getTests().stream().forEach(departmentalTest -> {

				if(null == departmentalTest.getIsActive())
					departmentalTest.setIsActive(true);
				if(departmentalTest.getId()==null) {
					departmentalTest.setId(UUID.randomUUID().toString());
					departmentalTest.setAuditDetails(auditDetails);
				}else {
					if(!existingEmpData.getTests().stream()
							.filter(departmentalTestData -> departmentalTestData.getId().equals(departmentalTest.getId()))
							.findFirst().orElse(null)
							.equals(departmentalTest)){
						departmentalTest.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
						departmentalTest.getAuditDetails().setLastModifiedDate(new Date().getTime());
					}
				}
			});

		}

		if(employee.getDocuments() != null){
			employee.getDocuments().stream().forEach(document -> {
				if(document.getId()==null) {
					document.setId(UUID.randomUUID().toString());
					document.setAuditDetails(auditDetails);
				}else {
					if(!existingEmpData.getDocuments().stream()
							.filter(documentData -> documentData.getId().equals(document.getId()))
							.findFirst().orElse(null)
							.equals(document)){
						document.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
						document.getAuditDetails().setLastModifiedDate(new Date().getTime());
					}
				}
			});

		}

		if(employee.getDeactivationDetails() != null){
			employee.getDeactivationDetails().stream().forEach(deactivationDetails -> {
				if(deactivationDetails.getId()==null) {
					deactivationDetails.setId(UUID.randomUUID().toString());
					deactivationDetails.setAuditDetails(auditDetails);
					employee.getDocuments().forEach(employeeDocument -> {
						employeeDocument.setReferenceId( deactivationDetails.getId());
					});
				}else {
					if(!existingEmpData.getDeactivationDetails().stream()
							.filter(deactivationDetailsData -> deactivationDetailsData.getId().equals(deactivationDetails.getId()))
							.findFirst().orElse(null)
							.equals(deactivationDetails)){
						deactivationDetails.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUserName());
						deactivationDetails.getAuditDetails().setLastModifiedDate(new Date().getTime());
					}
				}
			});

		}
	}

	private EmployeeResponse generateResponse(EmployeeRequest employeeRequest) {
		return EmployeeResponse.builder()
				.responseInfo(factory.createResponseInfoFromRequestInfo(employeeRequest.getRequestInfo(), true))
				.employees(employeeRequest.getEmployees()).build();
	}

}