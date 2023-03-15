package org.egov.demoutility.consumer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.apache.commons.lang3.RandomStringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demoutility.config.PropertyManager;
import org.egov.demoutility.model.Address;
import org.egov.demoutility.model.Assignment;
import org.egov.demoutility.model.Boundary;
import org.egov.demoutility.model.CreateUserRequest;
import org.egov.demoutility.model.DemoUtilityRequest;
import org.egov.demoutility.model.Email;
import org.egov.demoutility.model.Employee;
import org.egov.demoutility.model.EmployeeRequest;
import org.egov.demoutility.model.EmployeeResponse;
import org.egov.demoutility.model.Gender;
import org.egov.demoutility.model.GeoLocation;
import org.egov.demoutility.model.GuardianRelation;
import org.egov.demoutility.model.Jurisdiction;
import org.egov.demoutility.model.NonLoggedInUserUpdatePasswordRequest;
import org.egov.demoutility.model.Role;
import org.egov.demoutility.model.User;
import org.egov.demoutility.model.UserRequest;
import org.egov.demoutility.model.UserType;
import org.egov.demoutility.model.Vehicle;
import org.egov.demoutility.model.Vendor;
import org.egov.demoutility.model.VendorRequest;
import org.egov.demoutility.model.VendorResponse;
import org.egov.demoutility.producer.Producer;
import org.egov.demoutility.querybuilder.DemoQueryBuilder;
import org.egov.demoutility.repository.ServiceCallRepository;
import org.egov.demoutility.utils.UtilityConstants;
import org.egov.demoutility.model.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Configuration
public class DemoUtilityConsumer {

	@Autowired
	PropertyManager propertyConfiguration;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	RestTemplate restTemplate;

	@Autowired
	ServiceCallRepository serviceCallRepository;

	@Autowired
	freemarker.template.Configuration freemarkerConfiguration;

	@Autowired
	Producer producer;

	@Autowired
	DemoQueryBuilder queryBuilder;

	@KafkaListener(topics = { "${kafka.demoutility.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic)
			throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		DemoUtilityRequest demoRequest = null;
		try {
			log.debug("Consuming record: " + record);
			demoRequest = mapper.convertValue(record, DemoUtilityRequest.class);
			createEmployee(demoRequest);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
		}

		// TODO enable after implementation
	}

	public void createEmployee(DemoUtilityRequest demoUtilityRequest) throws JsonProcessingException {

		try {
			String authToken = getAccessToken(propertyConfiguration.getSuperUser(), propertyConfiguration.getPassword(),
					UtilityConstants.TENANTID_TOKEN);

			RequestInfo requestInfo = new RequestInfo();
			requestInfo.setAuthToken(authToken);

			List<Employee> employeeList = new ArrayList<Employee>();

			StringBuffer emailContent = new StringBuffer();
			emailContent.append(UtilityConstants.EMAIL_STRATING_CONTENT);

			for (int i = 0; i < demoUtilityRequest.getSetOfUsers(); i++) {

				Map<String, List<String>> roleWiseList = getRoleWiseList();
				Map<String, Object> employess = new LinkedHashMap<String, Object>();

				for (int j = 1; j < 7; j++) {

					long sequenceNo = queryBuilder.getSequence();

					log.info(" sequence No is", sequenceNo);

					String username = demoUtilityRequest.getShortCode().toUpperCase() + "-"
							+ UtilityConstants.TENANT_CODE + "-" + sequenceNo;

					String mobileNumber = generateMobileNo();

					Employee employee = createEmployee(demoUtilityRequest, username, mobileNumber, authToken,
							roleWiseList.get("employee" + j), UtilityConstants.NUMBERS.get(j - 1));

					employeeList.add(employee);
					employess.put("employee" + j, username);
					employess.put("applicantName", demoUtilityRequest.getApplicantName());
				}

				StringBuffer content = getContent(employess);
				emailContent.append(content);
			}

			EmployeeRequest employeeRequest = new EmployeeRequest();
			employeeRequest.setEmployees(employeeList);
			employeeRequest.setRequestInfo(requestInfo);
			ObjectNode employeeResponse = (ObjectNode) serviceCallRepository.fetchResult(
					propertyConfiguration.getHrmsHost() + propertyConfiguration.getHrmsCreateEndPoint(),
					employeeRequest);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			EmployeeResponse employeeObj = mapper.treeToValue(employeeResponse, EmployeeResponse.class);

			VendorRequest vendorRequest = createDso(demoUtilityRequest, authToken);

			ObjectNode vendorResponse = (ObjectNode) serviceCallRepository.fetchResult(
					propertyConfiguration.getVendorHost() + propertyConfiguration.getVendorcreateEndpoint(),
					vendorRequest);

			VendorResponse vendorObj = mapper.treeToValue(vendorResponse, VendorResponse.class);

			updateEmployeePassword(employeeObj.getEmployees(), requestInfo);
			emailContent.append(UtilityConstants.EMAIL_REGARDS);
			emailContent.append(UtilityConstants.EMAIL_ENDING_CONTENT);

			processEmail(emailContent.toString(), demoUtilityRequest, requestInfo);

		} catch (Exception e) {

			log.error("error while creating employees", e.getMessage());

		}

	}

	private StringBuffer getContent(Map<String, Object> employess) {
		// TODO Auto-generated method stub
		StringBuffer content = new StringBuffer();

		try {
			content.append(FreeMarkerTemplateUtils
					.processTemplateIntoString(freemarkerConfiguration.getTemplate("email-template.ftl"), employess));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return content;
	}

	private void processEmail(String employeeObj, DemoUtilityRequest demoUtilityRequest, RequestInfo requestInfo) {

		Email email = new Email();
		Set<String> emailTo = new HashSet<String>();
		emailTo.add(demoUtilityRequest.getEmail());
		email.setEmailTo(emailTo);
		email.setSubject(UtilityConstants.SUBJECT);
		email.setHTML(true);
		email.setBody(employeeObj);
		EmailRequest request = new EmailRequest();
		request.setEmail(email);
		request.setRequestInfo(requestInfo);

		log.info("Sending email.......");
		producer.push(propertyConfiguration.getEmailNotificationTopic(), request);

	}

	private void updateEmployeePassword(List<Employee> employeeList, RequestInfo requestInfo) {

		for (Employee employee : employeeList) {

			updatePassword(employee, requestInfo);

		}

	}

	private ObjectNode updatePassword(Employee employee, RequestInfo requestInfo) {
		User user = employee.getUser();
		user.setPassword(UtilityConstants.DEFAULT_PASSWORD);
		CreateUserRequest userRequest = new CreateUserRequest();
		ObjectMapper objectMapper = new ObjectMapper();
		UserRequest request = objectMapper.convertValue(user, UserRequest.class);

		userRequest.setRequestInfo(requestInfo);
		userRequest.setUser(request);

		ObjectNode response = (ObjectNode) serviceCallRepository.fetchResult(
				propertyConfiguration.getUserHost() + propertyConfiguration.getPasswordUpdate(), userRequest);

		return response;

	}

	private String getRandomNumber() {

		// It will generate 6 digit random Number.
		// from 0 to 999999
		Random rnd = new Random();
		int number = rnd.nextInt(999999);

		// this will convert any number sequence into 6 character.
		return String.format("%06d", number);

	}

	private VendorRequest createDso(DemoUtilityRequest demoUtilityRequest, String authToken) {

		RequestInfo requestInfo = new RequestInfo();
		requestInfo.setAuthToken(authToken);

		VendorRequest vendorRequest = new VendorRequest();
		Vendor vendor = new Vendor();
		vendor.setTenantId(UtilityConstants.BOUNDARY);
		vendor.setName(demoUtilityRequest.getOragnizationName());
		Address address = new Address();
		address.setCity(UtilityConstants.BOUNDARY);
		address.setTenantId(UtilityConstants.BOUNDARY);
		Boundary boundary = new Boundary();
		boundary.setCode(UtilityConstants.LOCALITY);
		GeoLocation geoLocation = new GeoLocation();
		address.setGeoLocation(geoLocation);
		address.setLocality(boundary);

		vendor.setAddress(address);
		User owner = getUser(demoUtilityRequest);
		owner.setName(demoUtilityRequest.getApplicantName());
		vendor.setOwner(owner);
		vendor.setSource(UtilityConstants.SOURCE);
		Vehicle vehicle = new Vehicle();
		vehicle.setTenantId(UtilityConstants.BOUNDARY);
		vehicle.setRegistrationNumber(RandomStringUtils.randomAlphabetic(6));
		vehicle.setModel(UtilityConstants.MODEL);
		vehicle.setTankCapicity(1000d);
		vehicle.setGpsEnabled(true);
		vehicle.setFitnessValidTill(1691583525000l);
		vehicle.setInsuranceCertValidTill(1691583525000l);
		vehicle.setRoadTaxPaidTill(1691583525000l);
		vehicle.setSource(UtilityConstants.MUNICIPALRECORDS);
		vehicle.setType(UtilityConstants.TYPE);
		vehicle.setSuctionType(UtilityConstants.SUCTION_TYPE);
		vendor.setDrivers(new ArrayList<>());
		User vehicleOwner = getUser(demoUtilityRequest);
		vehicle.setOwner(vehicleOwner);
		List<Vehicle> vehicleList = new ArrayList<Vehicle>();
		vehicleList.add(vehicle);
		vendor.setVehicles(vehicleList);
		vendorRequest.setRequestInfo(requestInfo);
		vendorRequest.setVendor(vendor);
		return vendorRequest;

	}

	private User getUser(DemoUtilityRequest demoUtilityRequest) {
		User user = new User();
		user.setName(RandomStringUtils.randomAlphabetic(6));
		user.setMobileNumber(demoUtilityRequest.getMobileNo());
		user.setTenantId(UtilityConstants.BOUNDARY);
		user.setType(UserType.CITIZEN.toString());
		user.setGender(Gender.MALE.toString());
		user.setDob(Long.valueOf(UtilityConstants.DOB));
		user.setRelationship(GuardianRelation.FATHER);
		user.setFatherOrHusbandName(RandomStringUtils.randomAlphabetic(6));
		user.setEmailId(demoUtilityRequest.getEmail());
		return user;
	}

	private Employee createEmployee(DemoUtilityRequest demoUtilityRequest, String username, String mobileNumber,
			String authToken, List<String> roles, String name) {

		Employee employee = new Employee();
		employee.setEmployeeStatus(UtilityConstants.EMPLOYEED);
		employee.setTenantId(UtilityConstants.TENANTID);
		employee.setEmployeeType(UtilityConstants.PERMANENT);
		employee.setCode(username);
		User user = new User();
		user.setName(demoUtilityRequest.getShortCode() + "-" + name);
		user.setMobileNumber(mobileNumber);
		user.setUserName(username);
		user.setPassword(UtilityConstants.DEFAULT_PASSWORD);
		user.setGender(Gender.MALE.toString());
		user.setDob(Long.valueOf(UtilityConstants.DOB));
		user.setFatherOrHusbandName(UtilityConstants.FATHERORHUSBAND);
		user.setRelationship(GuardianRelation.FATHER);
		user.setType(UtilityConstants.EMPLOYEE);
		user.setPermanentAddress(UtilityConstants.TEST);
		user.setCorrespondenceAddress(UtilityConstants.TEST);
		user.setOtpReference(UtilityConstants.TEST);
		user.setActive(true);
		user.setTenantId(UtilityConstants.TENANTID);
		List<Role> roleList = new ArrayList<Role>();
		for (String role : roles) {

			Role roleObj = new Role();
			roleObj.setCode(role);
			roleObj.setName(UtilityConstants.TEST);
			roleObj.setTenantId(UtilityConstants.TENANTID);
			roleList.add(roleObj);
		}
		user.setRoles(roleList);
		employee.setUser(user);
		Jurisdiction jurisdiction = new Jurisdiction();
		jurisdiction.setBoundaryType(UtilityConstants.BOUNDARY_TYPE);
		jurisdiction.setBoundary(UtilityConstants.BOUNDARY);
		jurisdiction.setHierarchy(UtilityConstants.HIERARCHY);
		List<Jurisdiction> jurisdictionList = new ArrayList<Jurisdiction>();
		jurisdictionList.add(jurisdiction);
		employee.setJurisdictions(jurisdictionList);
		Assignment assignment = new Assignment();
		assignment.setDesignation(UtilityConstants.Designantion);
		assignment.setDepartment(UtilityConstants.Department);
		assignment.setIsCurrentAssignment(true);
		assignment.setFromDate(new Date().getTime());
		List<Assignment> assignmentList = new ArrayList<Assignment>();
		assignmentList.add(assignment);
		employee.setAssignments(assignmentList);

		return employee;
	}

	private Map<String, List<String>> getRoleWiseList() {
		// TODO Auto-generated method stub
		Map<String, List<String>> roleList = new HashMap<String, List<String>>();
		List<String> employeeList1 = UtilityConstants.ROLE_1;
		List<String> employeeList2 = UtilityConstants.ROLE_2;
		List<String> employeeList3 = UtilityConstants.ROLE_3;
		List<String> employeeList4 = UtilityConstants.ROLE_4;
		List<String> employeeList5 = UtilityConstants.ROLE_5;
		List<String> employeeList6 = UtilityConstants.ROLE_6;
		roleList.put("employee1", employeeList1);
		roleList.put("employee2", employeeList2);
		roleList.put("employee3", employeeList3);
		roleList.put("employee4", employeeList4);
		roleList.put("employee5", employeeList5);
		roleList.put("employee6", employeeList6);

		return roleList;

	}

	private static String generateMobileNo() {

		long number = (long) Math.floor(Math.random() * 9_000_000_000L) + 1_000_000_000L;
		String mobileNumber = String.format("4%4s", number);

		mobileNumber = mobileNumber.substring(0, mobileNumber.length() - 1);

		return mobileNumber;

	}

	public String getAccessToken(String superUsername, String superUserPassword, String tenantId) {

		String access_token = null;
		Object record = getAccess(superUsername, superUserPassword, tenantId);
		Map tokenObject = objectMapper.convertValue(record, Map.class);

		if (tokenObject.containsKey("access_token")) {
			access_token = (String) tokenObject.get("access_token");
			log.info("Access token: {}", access_token);
		}

		return access_token;

	}

	public Object getAccess(String userName, String password, String tenantId) {
		log.info("Fetch access token for register with login flow");
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
			headers.set("Authorization", "Basic ZWdvdi11c2VyLWNsaWVudDo=");
			MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
			map.add("username", userName);
			map.add("password", password);
			map.add("grant_type", "password");
			map.add("scope", "read");
			map.add("tenantId", tenantId);
			map.add("userType", UserType.EMPLOYEE.name());

			HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map,
					headers);
			return restTemplate
					.postForEntity(propertyConfiguration.getUserHost() + propertyConfiguration.getUserAuthUrl(),
							request, Map.class)
					.getBody();

		} catch (Exception e) {
			log.error("Error occurred while logging-in via register flow" + e);
			throw e;
		}
	}

}