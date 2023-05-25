/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.infra.microservice.utils;

import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.egov.infra.utils.ApplicationConstant.CITIZEN_ROLE_NAME;
import static org.egov.infra.utils.DateUtils.toDefaultDateTimeFormat;

import java.io.IOException;
import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.admin.master.service.RoleService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.contract.AccountCodeTemplate;
import org.egov.infra.microservice.contract.ActionRequest;
import org.egov.infra.microservice.contract.ActionResponse;
import org.egov.infra.microservice.contract.CreateUserRequest;
import org.egov.infra.microservice.contract.Position;
import org.egov.infra.microservice.contract.PositionRequest;
import org.egov.infra.microservice.contract.PositionResponse;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.contract.Task;
import org.egov.infra.microservice.contract.TaskResponse;
import org.egov.infra.microservice.contract.UserDetailResponse;
import org.egov.infra.microservice.contract.UserRequest;
import org.egov.infra.microservice.contract.UserSearchRequest;
import org.egov.infra.microservice.contract.UserSearchResponse;
import org.egov.infra.microservice.models.Assignment;
import org.egov.infra.microservice.models.BankAccount;
import org.egov.infra.microservice.models.BankAccountServiceMapping;
import org.egov.infra.microservice.models.BankAccountServiceMappingReq;
import org.egov.infra.microservice.models.BankAccountServiceMappingResponse;
import org.egov.infra.microservice.models.BusinessService;
import org.egov.infra.microservice.models.BusinessServiceCriteria;
import org.egov.infra.microservice.models.BusinessServiceMapping;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.Designation;
import org.egov.infra.microservice.models.EmployeeInfo;
import org.egov.infra.microservice.models.EmployeeInfoResponse;
import org.egov.infra.microservice.models.EmployeeSearchCriteria;
import org.egov.infra.microservice.models.FinancialStatus;
import org.egov.infra.microservice.models.FinancialStatusResponse;
import org.egov.infra.microservice.models.GlCodeMaster;
import org.egov.infra.microservice.models.GlCodeMasterResponse;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.InstrumentAccountCode;
import org.egov.infra.microservice.models.InstrumentRequest;
import org.egov.infra.microservice.models.InstrumentResponse;
import org.egov.infra.microservice.models.InstrumentSearchContract;
import org.egov.infra.microservice.models.MasterDetail;
import org.egov.infra.microservice.models.MdmsCriteria;
import org.egov.infra.microservice.models.MdmsCriteriaReq;
import org.egov.infra.microservice.models.MdmsResponse;
import org.egov.infra.microservice.models.ModuleDetail;
import org.egov.infra.microservice.models.Payment;
import org.egov.infra.microservice.models.PaymentRequest;
import org.egov.infra.microservice.models.PaymentResponse;
import org.egov.infra.microservice.models.PaymentWorkflow;
import org.egov.infra.microservice.models.PaymentWorkflow.PaymentAction;
import org.egov.infra.microservice.models.PaymentWorkflowRequest;
import org.egov.infra.microservice.models.Receipt;
import org.egov.infra.microservice.models.ReceiptRequest;
import org.egov.infra.microservice.models.ReceiptResponse;
import org.egov.infra.microservice.models.ReceiptSearchCriteria;
import org.egov.infra.microservice.models.Remittance;
import org.egov.infra.microservice.models.RemittanceRequest;
import org.egov.infra.microservice.models.RemittanceResponse;
import org.egov.infra.microservice.models.RemittanceSearcCriteria;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.models.ResponseInfo;
import org.egov.infra.microservice.models.StorageResponse;
import org.egov.infra.microservice.models.TaxHeadMaster;
import org.egov.infra.microservice.models.TaxHeadMasterResponse;
import org.egov.infra.microservice.models.TaxPeriod;
import org.egov.infra.microservice.models.TaxPeriodResponse;
import org.egov.infra.microservice.models.TransactionType;
import org.egov.infra.microservice.models.UserInfo;
import org.egov.infra.persistence.entity.enums.UserType;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.infra.utils.DateUtils;
import org.egov.infra.web.support.ui.Inbox;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.jfree.util.Log;
import org.json.simple.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

@SuppressWarnings("deprecation")
@Service
public class MicroserviceUtils {

    private static final Logger LOGGER = Logger.getLogger(MicroserviceUtils.class);
    private static final String CLIENT_ID = "client.id";
    private static final int DEFAULT_PAGE_SIZE = 100;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    protected EgovMasterDataCaching masterDataCache;

    @Autowired
    private Environment environment;

    @Autowired
    public RedisTemplate<Object, Object> redisTemplate;

    @Value("${egov.services.user.create.url:}")
    private String userServiceUrl;

    @Autowired
    private RoleService roleService;

    @Value("${egov.services.workflow.url:}")
    private String workflowServiceUrl;

    @Value("${egov.services.user.approvers.url}")
    private String approverSrvcUrl;

    @Value("${egov.services.user.authsrvc.url}")
    private String authSrvcUrl;

    @Value("${egov.services.master.poistion.url}")
    private String positionSrvcUrl;

    @Value("${egov.services.master.actions.url}")
    private String actionSrvcUrl;

    @Value("${egov.services.user.search.url}")
    private String userSrcUrl;

    @Value("${egov.services.user.token.url}")
    private String tokenGenUrl;

    @Value("${egov.services.billing.service.taxheads.url}")
    private String taxheadsSearchUrl;

    @Value("${egov.services.billing.service.glcode.master.url}")
    private String glcodeMasterSearchUrl;

    @Value("${egov.services.egf.instrument.accountcode.search.url}")
    private String accountCodesSearchUrl;

    /*---- SI user details-----*/
    @Value("${token.authorization.key}")
    private String tokenAuthorizationKey;
    
    @Value("${si.microservice.user}")
    private String siUser;

    @Value("${si.microservice.password}")
    private String siPassword;

    @Value("${si.microservice.usertype}")
    private String siUserType;

    @Value("${si.microservice.scope}")
    private String siScope;

    @Value("${si.microservice.granttype}")
    private String siGrantType;

    @Value("${egov.services.billing.service.taxperiods.search}")
    private String taxperiodsSearchUrl;

    @Value("${egov.services.collection.service.receipts.search}")
    private String receiptSearchUrl;

    @Value("${egov.services.collection.service.basm.create}")
    private String bankAccountServiceMappingCreateUrl;

    @Value("${egov.services.collection.service.basm.search}")
    private String bankAccountServiceMappingSearchUrl;

    @Value("${egov.services.egf.master.financialstatuses.search}")
    private String financialStatusesSearchUrl;

    @Value("${egov.services.egf.instrument.search.url}")
    private String instrumentSearchUrl;

    @Value("${egov.services.egf.instrument.update.url}")
    private String instrumentUpdateUrl;

    @Value("${egov.services.collection.service.remittance.create}")
    private String remittanceCreateUrl;

    @Value("${egov.services.collection.service.receipt.update}")
    private String receiptUpdateUrl;

    @Value("${egov.services.master.mdms.search.url}")
    private String mdmsSearchUrl;

    @Value("${egov.services.egov-indexer.url}")
    private String egovIndexerUrl;
    
    @Value("${collection.payment.searchurl.enabled}")
    private Boolean paymentSearchEndPointEnabled;
    
    private ObjectMapper mapper;
    SimpleDateFormat ddMMMyyyyFormat = new SimpleDateFormat("dd-MMM-yyyy");

    @Autowired
    private PaymentUtils paymentUtils;

    @Autowired
    ApplicationConfigManager appConfigManager;

    public MicroserviceUtils() {
        mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    public RequestInfo createRequestInfo() {
        final RequestInfo requestInfo = new RequestInfo();
        requestInfo.setApiId("apiId");
        requestInfo.setVer("ver");
        requestInfo.setTs(getEpochDate(new Date()));
        return requestInfo;
    }

    public RestTemplate createRestTemplate() {

        return restTemplate;
    }

    public UserInfo getUserInfo() {
        final User user = securityUtils.getCurrentUser();
        final List<org.egov.infra.microservice.models.RoleInfo> roles = new ArrayList<org.egov.infra.microservice.models.RoleInfo>();
        user.getRoles()
                .forEach(authority -> roles.add(new org.egov.infra.microservice.models.RoleInfo(authority.getName())));

        return new UserInfo(roles, user.getId(), user.getUuid(), user.getUsername(), user.getName(), user.getEmailId(),
                user.getMobileNumber(), user.getType().toString(), getTenentId());
    }

    public String getTenentId() {
        environment.getProperty(CLIENT_ID);
        String tenantId = ApplicationThreadLocals.getUserTenantId();
        // if (isNotBlank(clientId)) {
        // final StringBuilder stringBuilder = new StringBuilder();
        // stringBuilder.append(clientId).append('.').append(tenantId);
        // tenantId = stringBuilder.toString();
        // }
        return tenantId;
    }

    public String getUserToken() {
        String userToken = ApplicationThreadLocals.getUserToken();
        // if (adminToken == null)
        // adminToken = this.generateAdminToken(ApplicationThreadLocals.getUserTenantId());
        return userToken;
    }

    public void createUserMicroservice(final User user) {
        if (isNotBlank(userServiceUrl)) {

            if (user.getRoles().isEmpty() && user.getType().equals(UserType.CITIZEN))
                user.addRole(roleService.getRoleByName(CITIZEN_ROLE_NAME));

            final CreateUserRequest createUserRequest = new CreateUserRequest();
            final UserRequest userRequest = new UserRequest(user, getTenentId());
            createUserRequest.setUserRequest(userRequest);
            createUserRequest.setRequestInfo(createRequestInfo());

            final RestTemplate restTemplate = new RestTemplate();
            try {
                restTemplate.postForObject(userServiceUrl, createUserRequest, UserDetailResponse.class);
            } catch (final RestClientException e) {
            	LOGGER.warn("Exception while creating User in microservice ", e);
            }
        }
    }

    private Object getFinanceDeptCodes() {

        HashMap mdmsObj = this.getFinanceMdmsObj();
        if (mdmsObj != null)
            return mdmsObj.get("departments");
        return null;
    }

    private Object getFinanceDesginCodes() {

        HashMap mdmsObj = this.getFinanceMdmsObj();
        if (mdmsObj != null)
            return mdmsObj.get("designation");
        return null;
    }

    private HashMap getFinanceMdmsObj() {
        HashMap mdmObj = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        this.prepareModuleDetails(moduleDetailsList, "common-masters", "mapping", null, null, String.class);
        Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
        if (postForObject != null) {
            mdmObj = mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.common-masters.mapping[0]"),HashMap.class);
        }
        return mdmObj;
    }

    public List<Department> getDepartments() {
        return getDepartments(null);
    }

    public List<Department> getDepartments(String codes) {
        // List<Department> deptList = new ArrayList<>();
        // FilterRequest filterReq = new FilterRequest();
        // List<BusinessService> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        try {
            this.prepareModuleDetails(moduleDetailsList, "common-masters", "Department", "code", codes, String.class);
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
            if (postForObject != null) {
                return mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.common-masters.Department"),new TypeReference<List<Department>>(){});
            }
        } catch (ApplicationRuntimeException e) {
            LOGGER.error("ERROR occurred while fetching business service details in getBusinessServiceByCodes method: ",e);
        }
        // try {
        // if(!StringUtils.isEmpty(codes) && codes != null &&
        // StringUtils.contains(codes, ",")){
        // filterReq.setCodes(Arrays.asList(codes.split(",")));
        // }else if(!StringUtils.isEmpty(codes) && codes != null){
        // filterReq.setCode(codes);
        // }else{
        // final String deptCodes = (String) this.getFinanceDeptCodes();
        // filterReq.setCodes(Arrays.asList(deptCodes.split(",")));
        // }
        // JSONArray mdmObj =
        // getFinanceMdmsByModuleNameAndMasterDetails("common-masters",
        // "Department", filterReq);
        // mdmObj.stream().forEach(obj ->{
        // LinkedHashMap<String, Object> lhm = (LinkedHashMap)obj;
        // Department dept = new Department();
        // dept.setCode(lhm.get("code").toString());
        // dept.setName(lhm.get("name").toString());
        // dept.setActive((Boolean)lhm.get("active"));
        // deptList.add(dept);
        // });
        // return deptList;
        // } catch (Exception e) {
        // e.printStackTrace();
        // }
        return null;
    }

    public Department getDepartmentByCode(String departmentCode) {

        List<Department> deptlist = this.masterDataCache.get("egi-department");

        Department sDepartment = null;
        if (null != deptlist && !deptlist.isEmpty()) {

            List<org.egov.infra.microservice.models.Department> dept = deptlist.stream()
                    .filter(department -> departmentCode.equalsIgnoreCase(department.getCode()))
                    .collect(Collectors.toList());
            if (null != dept && dept.size() > 0)
                sDepartment = dept.get(0);
        }

        if (null == sDepartment) {
            sDepartment = this.fetchByDepartmentCode(departmentCode);

        }

        return sDepartment;

    }

    private Department fetchByDepartmentCode(String departmentCode) {
        List<Department> departments = getDepartments(departmentCode);
        return !departments.isEmpty() ? departments.get(0) : null;
    }

    public List<Designation> getDesignation(String code) {
        // List<Designation> desgList = new ArrayList<>();
        // FilterRequest filterReq =new FilterRequest();
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        try {
            this.prepareModuleDetails(moduleDetailsList, "common-masters", "Designation", "code", code, String.class);
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
            if (postForObject != null) {
                return mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.common-masters.Designation"),
                        new TypeReference<List<Designation>>() {
                        });
            }
        } catch (ApplicationRuntimeException e) {
            LOGGER.error("ERROR occurred while fetching business service details in getBusinessServiceByCodes method: ",
                    e);
        }
        // try {
        // if(!StringUtils.isEmpty(code) && code != null){
        // filterReq.setCode(code);
        // }else{
        // String desginCodes = (String) getFinanceDesginCodes();
        // filterReq.setCodes(Arrays.asList(desginCodes.split(",")));
        // }
        // JSONArray mdmObj =
        // getFinanceMdmsByModuleNameAndMasterDetails("common-masters",
        // "Designation", filterReq);
        // mdmObj.stream().forEach(obj ->{
        // LinkedHashMap<String, Object> lhm = (LinkedHashMap)obj;
        // Designation designation = new Designation();
        // designation.setCode(lhm.get("code").toString());
        // designation.setName(lhm.get("name").toString());
        // designation.setDescription(lhm.get("description").toString());
        // designation.setActive((Boolean)lhm.get("active"));
        // desgList.add(designation);
        // });
        // return desgList;
        // } catch (Exception e) {
        // e.printStackTrace();
        // }
        return null;
    }

    public JSONArray getFinanceMdmsByModuleNameAndMasterDetails(String moduleName, String name, FilterRequest filter) {
        String mdmsUrl = appConfigManager.getEgovMdmsSerHost() + this.mdmsSearchUrl;
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setAuthToken(getUserToken());
        MasterDetail masterDetail = new MasterDetail();
        masterDetail.setName(name);
        // Apply filter in the request
        if (null != filter) {
            if (!StringUtils.isEmpty(filter.getCode()))
                masterDetail.setFilter("[?(@.code=='" + filter.getCode() + "')]");

            if (!StringUtils.isEmpty(filter.getName()))
                masterDetail.setFilter("[?(@.name=='" + filter.getName() + "')]");

            if (null != filter.getActive())
                masterDetail.setFilter("[?(@.active=='" + filter.getActive() + "')]");

            if (null != filter.getNames()) {
                List<String> names = filter.getNames().parallelStream().map(obj -> {
                    return "'" + obj + "'";
                }).collect(Collectors.toList());
                masterDetail.setFilter("[?(@.name IN " + names + ")]");
            }

            if (null != filter.getCodes()) {
                List<String> codes = filter.getCodes().parallelStream().map(obj -> {
                    return "'" + obj + "'";
                }).collect(Collectors.toList());
                masterDetail.setFilter("[?(@.code IN " + codes + ")]");
            }
        }
        ModuleDetail moduleDetail = new ModuleDetail();
        moduleDetail.setMasterDetails(Arrays.asList(masterDetail));
        moduleDetail.setModuleName(moduleName);
        MdmsCriteria mdmscriteria = new MdmsCriteria();
        mdmscriteria.setTenantId(getTenentId().split(Pattern.quote("."))[0]);
        mdmscriteria.setModuleDetails(Arrays.asList(moduleDetail));
        MdmsCriteriaReq mdmsrequest = new MdmsCriteriaReq();
        mdmsrequest.setRequestInfo(requestInfo);
        mdmsrequest.setMdmsCriteria(mdmscriteria);
        try {
            MdmsResponse response = restTemplate.postForObject(mdmsUrl, mdmsrequest, MdmsResponse.class);
            Map<String, JSONArray> mdmsmap = response.getMdmsRes().get(moduleName);
            if (null != mdmsmap && mdmsmap.size() > 0) {
                return mdmsmap.get(name);
            }
        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching finance mdms method: ",
                    e);
        }
        return null;
    }

    public List<Designation> getDesignations() {
        return getDesignation(null);
    }

    public List<EmployeeInfo> getApprovers(String departmentId, String designationId) {
        return this.getEmployeeBySearchCriteria(
                new EmployeeSearchCriteria().builder().departments(Collections.singletonList(departmentId))
                        .designations(Collections.singletonList(designationId)).build());
    }

    public List<EmployeeInfo> getEmployeeBySearchCriteria(EmployeeSearchCriteria criteria) {
        final RestTemplate restTemplate = createRestTemplate();
        StringBuilder url = new StringBuilder(appConfigManager.getEgovHrmsSerHost()).append(approverSrvcUrl)
                .append("?tenantId=").append(getTenentId());
        this.prepareEmplyeeSearchQueryString(criteria, url);
        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();
        requestInfo.setAuthToken(getUserToken());
        requestInfo.setTs(getEpochDate(new Date()));
        reqWrapper.setRequestInfo(requestInfo);
        EmployeeInfoResponse empResponse = restTemplate.postForObject(url.toString(), reqWrapper,
                EmployeeInfoResponse.class);
        return empResponse.getEmployees();
    }

    private void prepareEmplyeeSearchQueryString(EmployeeSearchCriteria criteria, StringBuilder url) {
        if (criteria.getAsOnDate() != null && criteria.getAsOnDate() != 0) {
            url.append("&asOnDate=").append(criteria.getAsOnDate());
        }
        if (CollectionUtils.isNotEmpty(criteria.getCodes())) {
            url.append("&codes=").append(StringUtils.join(criteria.getCodes(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getNames())) {
            url.append("&names=").append(StringUtils.join(criteria.getNames(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getDepartments())) {
            url.append("&departments=").append(StringUtils.join(criteria.getDepartments(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getDesignations())) {
            url.append("&designations=").append(StringUtils.join(criteria.getDesignations(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getRoles())) {
            url.append("&roles=").append(StringUtils.join(criteria.getRoles(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getIds())) {
            url.append("&ids=").append(StringUtils.join(criteria.getIds(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getEmployeestatuses())) {
            url.append("&employeestatuses=").append(StringUtils.join(criteria.getEmployeestatuses(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getEmployeetypes())) {
            url.append("&employeetypes=").append(StringUtils.join(criteria.getEmployeetypes(), ","));
        }
        if (CollectionUtils.isNotEmpty(criteria.getPositions())) {
            url.append("&positions=").append(StringUtils.join(criteria.getPositions(), ","));
        }
        if (StringUtils.isNotBlank(criteria.getPhone())) {
            url.append("&phone=").append(criteria.getPhone());
        }
        if (criteria.getLimit() != null && criteria.getLimit() != 0) {
            url.append("&limit=").append(criteria.getLimit());
        }
    }

    public EmployeeInfo getEmployeeByPositionId(Long positionId) {
        List<EmployeeInfo> list = this.getEmployeeBySearchCriteria(
                new EmployeeSearchCriteria().builder().positions(Collections.singletonList(positionId)).build());
        return list.isEmpty() ? null : list.get(0);
    }

    public CustomUserDetails getUserDetails(String user_token, String admin_token) {
        final RestTemplate restT = createRestTemplate();
        final String authurl = appConfigManager.getEgovUserSerHost() + authSrvcUrl + "?access_token=" + user_token;
        RequestInfo reqInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();
        reqInfo.setAuthToken(admin_token);
        reqWrapper.setRequestInfo(reqInfo);
        LOGGER.info("call:" + authurl);
        CustomUserDetails user = restT.postForObject(authurl, reqWrapper, CustomUserDetails.class);
        if (user_token.equals(admin_token)) {
            user.setUserName(this.siUser);
        }
        return user;
    }

    public String generateAdminToken(String tenantId) {
        final RestTemplate restTemplate = createRestTemplate();
        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        header.add("Authorization", this.tokenAuthorizationKey);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("username", this.siUser);
        map.add("scope", this.siScope);
        map.add("password", this.siPassword);
        map.add("grant_type", this.siGrantType);
        map.add("tenantId", tenantId);
        map.add("userType", this.siUserType);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, header);
        try {
            StringBuilder url = new StringBuilder(appConfigManager.getEgovUserSerHost()).append(tokenGenUrl);
            LOGGER.info("call:" + url);
            Object response = restTemplate.postForObject(url.toString(), request, Object.class);
            if (response != null)
                return String.valueOf(((HashMap) response).get("access_token"));
        } catch (RestClientException e) {
            LOGGER.info("Eror while getting admin authtoken", e);
            return null;
        }
        return null;
    }

    public UserSearchResponse getUserInfo(String auth_token, String tenantId, String uuid) {
        final RestTemplate restT = createRestTemplate();

        RequestInfo req_header = new RequestInfo();
        UserSearchRequest request = new UserSearchRequest();

        req_header.setAuthToken(auth_token);
        request.setRequestInfo(req_header);
        request.setUuid(Arrays.asList(uuid));
        request.setTenantId(tenantId);
        String url = appConfigManager.getEgovUserSerHost() + userSrcUrl;
        LOGGER.info("call:" + url);
        UserSearchResponse response = restT.postForObject(url, request, UserSearchResponse.class);
        return response;
    }

    public PositionResponse createPosition(String access_token, List<Position> positions) {

        final RestTemplate restT = createRestTemplate();

        PositionRequest posrequest = new PositionRequest();
        RequestInfo req_header = new RequestInfo();

        req_header.setAuthToken(access_token);
        posrequest.setRequestInfo(req_header);
        posrequest.setPosition(positions);
        LOGGER.info("call:" + positionSrvcUrl);
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovHrMasterSerHost()).append(positionSrvcUrl);
        PositionResponse response = restT.postForObject(uri.toString(), posrequest, PositionResponse.class);

        return response;

    }

    public ActionResponse getActions(String authtoken, List<String> roles) {

        final RestTemplate restT = createRestTemplate();
        ActionRequest request = new ActionRequest();
        RequestInfo req_header = new RequestInfo();

        req_header.setAuthToken(authtoken);
        request.setRequestInfo(req_header);
        request.setTenantId(getTenentId());
        request.setRoleCodes(roles);
        request.setActionMaster("actions-test");
        request.setEnabled(true);
        LOGGER.info("call:" + actionSrvcUrl);
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovAccessControllSerHost()).append(actionSrvcUrl);
        ActionResponse response = restT.postForObject(uri.toString(), request, ActionResponse.class);

        // response.getActions()
        return response;
    }

    public List<EmployeeInfo> getEmployee(Long empId, Date toDay, String departmentId, String designationId) {
       EmployeeSearchCriteria creiteria = this.prepareEmployeeSearchQueryBuilder(empId, toDay, departmentId,
               designationId);
        return this.getEmployeeBySearchCriteria(creiteria);
    }

    private EmployeeSearchCriteria prepareEmployeeSearchQueryBuilder(Long empId, Date toDay, String departmentId,
            String designationId) {
        EmployeeSearchCriteria criteria = new EmployeeSearchCriteria().builder().build();
        if (empId != null && empId != 0) {
            criteria.setIds(Collections.singletonList(empId));
        }
        if (toDay != null) {
            criteria.setAsOnDate(getEpochDate(toDay));
        }
        if (departmentId != null && !departmentId.isEmpty()) {
            criteria.setDepartments(Collections.singletonList(departmentId));
        }
        if (designationId != null && !designationId.isEmpty()) {
            criteria.setDesignations(Collections.singletonList(designationId));
        }
        return criteria;

    }

    public EmployeeInfo getEmployeeById(Long empId) {
        List<EmployeeInfo> list = this.getEmployeeBySearchCriteria(
                new EmployeeSearchCriteria().builder().ids(Collections.singletonList(empId)).build());
        return list.isEmpty() ? null : list.get(0);
    }

    public List<EmployeeInfo> getEmployeeByIds(Set<Long> ids) {
        return this.getEmployeeBySearchCriteria(
                new EmployeeSearchCriteria().builder().ids(ids.stream().collect(Collectors.toList())).build());
    }

    public List<Assignment> getAssignments(String department, String designation) {
        List<Assignment> assignmentList = new ArrayList<>();
        List<EmployeeInfo> employeeInfos = getApprovers(department, designation);
        for (EmployeeInfo ei : employeeInfos) {
            for (Assignment a : ei.getAssignments()) {
                a.setEmployeeName(ei.getUser().getName());
            }
            assignmentList.addAll(ei.getAssignments());
        }
        return assignmentList;
    }
    
    public List<TaxHeadMaster> getTaxheadsByService(String service) {

        final RestTemplate restTemplate = createRestTemplate();

        final String url = appConfigManager.getEgovBillingSerHost() + taxheadsSearchUrl + "?tenantId=" + getTenentId()
                + "&service=" + service;

        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();
        requestInfo.setAuthToken(getUserToken());
        reqWrapper.setRequestInfo(requestInfo);
        TaxHeadMasterResponse response = restTemplate.postForObject(url, reqWrapper, TaxHeadMasterResponse.class);
        return response.getTaxHeadMasters();
    }

    public List<TaxHeadMaster> getTaxheads() {

        final RestTemplate restTemplate = createRestTemplate();

        final String url = appConfigManager.getEgovBillingSerHost() + taxheadsSearchUrl + "?tenantId=" + getTenentId();

        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();

        requestInfo.setAuthToken(getUserToken());
        reqWrapper.setRequestInfo(requestInfo);

        TaxHeadMasterResponse response = restTemplate.postForObject(url, reqWrapper, TaxHeadMasterResponse.class);
        return response.getTaxHeadMasters();
    }

    public List<GlCodeMaster> getGlcodeMastersByService(String service) {

        final RestTemplate restTemplate = createRestTemplate();

        final String url = appConfigManager.getEgovBillingSerHost() + glcodeMasterSearchUrl + "?tenantId="
                + getTenentId() + "&service=" + service;

        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();

        requestInfo.setAuthToken(getUserToken());
        reqWrapper.setRequestInfo(requestInfo);

        GlCodeMasterResponse response = restTemplate.postForObject(url, reqWrapper, GlCodeMasterResponse.class);
        return response.getGlCodeMasters();
    }

    public TaxPeriod getTaxPeriodsByService(String type) {

        final RestTemplate restTemplate = createRestTemplate();

        final String url = appConfigManager.getEgovBillingSerHost() + taxperiodsSearchUrl + "?tenantId=" + getTenentId()
                + "&service=" + type;
        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();

        requestInfo.setAuthToken(getUserToken());
        reqWrapper.setRequestInfo(requestInfo);

        TaxPeriodResponse response = restTemplate.postForObject(url, reqWrapper, TaxPeriodResponse.class);
        if (response != null && response.getTaxPeriods() != null && !response.getTaxPeriods().isEmpty())
            return response.getTaxPeriods().get(0);
        else
            return null;
    }

    public List<BankAccountServiceMapping> getBankAcntServiceMappings() {
        return this.getBankAcntServiceMappings(null, null);
    }

    public List<BankAccountServiceMapping> getBankAcntServiceMappings(String bankAccount, String businessDetails) {
        List<BankAccountServiceMapping> basm = Collections.EMPTY_LIST;
        List<ModuleDetail> moduleDetailList = new ArrayList<>();
        try {
            this.prepareModuleDetails(moduleDetailList, "FinanceModule", "BankAccountServiceMapping",
                    bankAccount != null ? "bankAccount" : null, bankAccount != null ? bankAccount : null, String.class);
            this.prepareModuleDetails(moduleDetailList, "FinanceModule", "BankAccountServiceMapping",
                    businessDetails != null ? "businessDetails" : null,
                    businessDetails != null ? businessDetails : null, String.class);
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailList, false, null, null), Map.class);
            if (postForObject != null) {
                basm = mapper.convertValue(
                        JsonPath.read(postForObject, "$.MdmsRes.FinanceModule.BankAccountServiceMapping"),
                        new TypeReference<List<BankAccountServiceMapping>>() {
                        });
            }
        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching header name of tenant in getHeaderNameForTenant : ", e);
        }
        return basm;
    }

    private static <T> Predicate<T> distinctByAccountNumber(Function<? super T, ?> keyExtractor) {
        Map<Object, Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    public List<BankAccountServiceMapping> getBankAcntServiceMappingsByBankAcc(String bankAccount,
            String businessDetails) {
        return this.getBankAcntServiceMappings(bankAccount, businessDetails);
    }

    public List<BankAccountServiceMapping> createBankAcntServiceMappings(BankAccountServiceMapping basm) {

        final RestTemplate restTemplate = createRestTemplate();
        final String url = appConfigManager.getEgovCollSerHost() + bankAccountServiceMappingCreateUrl;

        RequestInfo requestInfo = new RequestInfo();

        requestInfo.setAuthToken(getUserToken());
        requestInfo.setUserInfo(getUserInfo());

        BankAccountServiceMappingReq request = new BankAccountServiceMappingReq();
        request.setRequestInfo(requestInfo);
        request.setBankAccountServiceMapping(Collections.singletonList(basm));

        BankAccountServiceMappingResponse response = restTemplate.postForObject(url, request,
                BankAccountServiceMappingResponse.class);
        if (response != null && response.getBankAccountServiceMapping() != null)
            return response.getBankAccountServiceMapping();
        else
            return null;
    }

    public FinancialStatus getInstrumentStatusByCode(String code) {

        final String url = appConfigManager.getEgovEgfMasterSerHost() + financialStatusesSearchUrl + "?tenantId="
                + getTenentId() + "&moduleType=Instrument&code=" + code;

        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();

        requestInfo.setAuthToken(getUserToken());
        reqWrapper.setRequestInfo(requestInfo);
        LOGGER.info("call:" + url);
        FinancialStatusResponse response = restTemplate.postForObject(url, reqWrapper, FinancialStatusResponse.class);
        if (response.getFinancialStatuses() != null && !response.getFinancialStatuses().isEmpty())
            return response.getFinancialStatuses().get(0);
        else
            return null;
    }

    public List<Instrument> getInstruments(String instrumentType, TransactionType transactionType,
            String instrumentStatus,final Date startDate, final Date endDate) {
        InstrumentSearchContract contract = new InstrumentSearchContract();
        contract.setInstrumentTypes(instrumentType);
        contract.setTransactionType(transactionType);
        contract.setFinancialStatuses(instrumentStatus);
        contract.setTransactionFromDate(startDate);
        contract.setTransactionToDate(endDate);
        contract.setPageSize(DEFAULT_PAGE_SIZE);
        return this.getInstrumentsBySearchCriteria(contract);
    }

    public List<Instrument> getInstrumentsBySearchCriteria(InstrumentSearchContract insSearchContra) {
        StringBuilder url = new StringBuilder().append(appConfigManager.getEgovEgfInstSerHost())
                .append(instrumentSearchUrl).append("?tenantId=").append(getTenentId());
        if (StringUtils.isNotBlank(insSearchContra.getIds())) {
            url.append("&ids=").append(insSearchContra.getIds());
        }
        if (StringUtils.isNotBlank(insSearchContra.getBankAccountNumber())) {
            url.append("&bankAccount.accountNumber=").append(insSearchContra.getBankAccountNumber());
        }
        if (StringUtils.isNotBlank(insSearchContra.getBankId())) {
            url.append("&bank.id=").append(insSearchContra.getBankId());
        }
        if (StringUtils.isNotBlank(insSearchContra.getInstrumentTypes())) {
            url.append("&instrumentTypes=").append(insSearchContra.getInstrumentTypes());
        }
        if (insSearchContra.getTransactionType() != null) {
            url.append("&transactionType=").append(insSearchContra.getTransactionType().name());
        }
        if (StringUtils.isNotBlank(insSearchContra.getFinancialStatuses())) {
            url.append("&financialStatuses=").append(insSearchContra.getFinancialStatuses());
        }
        if (StringUtils.isNotBlank(insSearchContra.getTransactionNumber())) {
            url.append("&transactionNumber=").append(insSearchContra.getTransactionNumber());
        }
        if (insSearchContra.getPageSize() != null) {
            url.append("&pageSize=").append(insSearchContra.getPageSize());
        }
        if (StringUtils.isNotBlank(insSearchContra.getReceiptIds())) {
            url.append("&receiptIds=").append(insSearchContra.getReceiptIds());
        }
        if (insSearchContra.getTransactionFromDate() != null) {
            Date fromDate = insSearchContra.getTransactionFromDate();
            url.append("&transactionFromDate=").append(ddMMMyyyyFormat.format(fromDate));
        }
        if (insSearchContra.getTransactionToDate() != null) {
            Date toDate = insSearchContra.getTransactionToDate();
            url.append("&transactionToDate=").append(ddMMMyyyyFormat.format(toDate));
        }
        if (insSearchContra.getTransactionDate() != null) {
            Date transactionDate = insSearchContra.getTransactionDate();
            url.append("&transactionDate=").append(ddMMMyyyyFormat.format(transactionDate));
        }
        RequestInfo requestInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();
        requestInfo.setAuthToken(getUserToken());
        reqWrapper.setRequestInfo(requestInfo);
        LOGGER.info("call:" + url);
        InstrumentResponse response = restTemplate.postForObject(url.toString(), reqWrapper, InstrumentResponse.class);
        return response.getInstruments();
    }

    public List<Instrument> getInstruments(String ids) {
        InstrumentSearchContract contract = new InstrumentSearchContract();
        contract.setIds(ids);
        return this.getInstrumentsBySearchCriteria(contract);
    }

    public List<Instrument> getInstrumentsByReceiptIds(String instrumentType, String instrumentStatus,
            String receiptIds) {
        InstrumentSearchContract contract = new InstrumentSearchContract();
        contract.setInstrumentTypes(instrumentType);
        contract.setReceiptIds(receiptIds);
        contract.setFinancialStatuses(instrumentStatus);
        return this.getInstrumentsBySearchCriteria(contract);
    }

    public List<Receipt> getReceipts(String ids, String status, String serviceCodes, Date fromDate, Date toDate) {
        ReceiptSearchCriteria criteria = new ReceiptSearchCriteria().builder()
                .status(Arrays.stream(status.split(",")).collect(Collectors.toSet())).fromDate(fromDate).toDate(toDate)
                .receiptNumbers(Arrays.stream(ids.split(",")).collect(Collectors.toSet()))
                .businessCodes(Arrays.stream(serviceCodes.split(",")).collect(Collectors.toSet())).tenantId(getTenentId()).build();
        return this.getReceipt(criteria);
    }

    public List<Receipt> getReceipt(ReceiptSearchCriteria rSearchcriteria) {
        // Checking for the collection version either older version or new
        // version are getting used
        List<Receipt> receipts = new ArrayList<>();
        switch (ApplicationThreadLocals.getCollectionVersion().toUpperCase()) {
        case "V2":
        case "VERSION2":
            PaymentSearchCriteria paySearchCriteria = new PaymentSearchCriteria();
            rSearchcriteria.toPayemntSerachCriteriaContract(paySearchCriteria);
            List<Payment> payments = this.getPayments(paySearchCriteria);
            paymentUtils.getReceiptsFromPayments(payments, receipts);
            break;

        default:
            RequestInfo requestInfo = new RequestInfo();
            RequestInfoWrapper reqWrapper = new RequestInfoWrapper();
            requestInfo.setAuthToken(getUserToken());
            requestInfo.setUserInfo(getUserInfo());
            reqWrapper.setRequestInfo(requestInfo);
            StringBuilder url = new StringBuilder();
            url.append(appConfigManager.getEgovCollSerHost()).append(receiptSearchUrl).append("?tenantId=")
                    .append(getTenentId());
            prepareReceiptSearchUrl(rSearchcriteria, url);
            LOGGER.info("call:" + url.toString());
            ReceiptResponse response = restTemplate.postForObject(url.toString(), reqWrapper, ReceiptResponse.class);
            receipts = response.getReceipts();
        }
        return receipts;
    }

    private void prepareReceiptSearchUrl(ReceiptSearchCriteria criteria, StringBuilder url) {
        if (CollectionUtils.isNotEmpty(criteria.getReceiptNumbers())) {
            url.append("&receiptNumbers=").append(StringUtils.join(criteria.getReceiptNumbers(), ","));
        }
        if (StringUtils.isNotBlank(criteria.getDepartment())) {
            url.append("&department=").append(criteria.getDepartment());
        }
        if (StringUtils.isNotBlank(criteria.getFund())) {
            url.append("&fund=").append(criteria.getFund());
        }
        if (CollectionUtils.isNotEmpty(criteria.getBusinessCodes())) {
            url.append("&businessCodes=").append(StringUtils.join(criteria.getBusinessCodes(), ","));
        }
        if (criteria.getFromDate() != null) {
            url.append("&fromDate=").append(criteria.getFromDate().getTime());
        }
        if (criteria.getToDate() != null) {
            url.append("&toDate=").append(criteria.getToDate().getTime());
        }
        if (StringUtils.isNotBlank(criteria.getClassification())) {
            url.append("&classification=").append(criteria.getClassification());
        }
    }

    public List<Receipt> getReceipts(String receiptNumbers) {
        ReceiptSearchCriteria criteria = new ReceiptSearchCriteria().builder()
                .receiptNumbers(Arrays.stream(receiptNumbers.split(",")).collect(Collectors.toSet())).build();
        return this.getReceipt(criteria);
    }
    
    public List<Receipt> getReceiptsList(String receiptNumbers,String serviceCode) {
        ReceiptSearchCriteria criteria = new ReceiptSearchCriteria().builder()
                .receiptNumbers(Arrays.stream(receiptNumbers.split(",")).collect(Collectors.toSet())).businessCodes(Arrays.stream(serviceCode.split(",")).collect(Collectors.toSet())).build();
        return this.getReceipt(criteria);
    }

    public List<Receipt> getReceipts(String status, String serviceCode, String fund, String department,
            String receiptDate) {
        ReceiptSearchCriteria criteria = new ReceiptSearchCriteria().builder()
                .status(Arrays.stream(status.split(",")).collect(Collectors.toSet()))
                .businessCodes(Arrays.stream(serviceCode.split(",")).collect(Collectors.toSet())).fund(fund)
                .department(department).fromDate(DateUtils.toDateUsingDefaultPattern(receiptDate))
                .toDate(DateUtils.toDateUsingDefaultPattern(receiptDate)).build();
        return this.getReceipt(criteria);
    }

    public List<Receipt> searchReciepts(String classification, Date fromDate, Date toDate, String businessCode,
            String receiptNo) {

        return this.searchReciepts(classification, fromDate, toDate, businessCode, Arrays.asList(receiptNo));

    }

    public List<Receipt> searchReciepts(String classification, Date fromDate, Date toDate, String businessCode,
            List<String> receiptNos) {
        ReceiptSearchCriteria criteria = new ReceiptSearchCriteria().builder().fromDate(fromDate).toDate(toDate)
                .businessCodes(businessCode != null ? Arrays.stream(businessCode.split(",")).collect(Collectors.toSet())
                        : Collections.EMPTY_SET)
                .receiptNumbers(
                        receiptNos != null ? receiptNos.stream().collect(Collectors.toSet()) : Collections.EMPTY_SET)
                .classification(classification).build();
        return this.getReceipt(criteria);
    }

    public InstrumentResponse reconcileInstruments(List<Instrument> instruments, String depositedBankAccountNum) {
        FinancialStatus instrumentStatusReconciled = new FinancialStatus();
        instrumentStatusReconciled.setCode("Reconciled");
        instrumentStatusReconciled.setName("Reconciled");
        return this.updateInstruments(instruments, depositedBankAccountNum, instrumentStatusReconciled);
    }

    public InstrumentResponse reconcileInstruments(List<Instrument> instruments, String depositedBankAccountNum,
            String bankId) {
        FinancialStatus instrumentStatusReconciled = new FinancialStatus();
        instrumentStatusReconciled.setCode("Reconciled");
        instrumentStatusReconciled.setName("Reconciled");
        for (Instrument i : instruments) {
            i.setFinancialStatus(instrumentStatusReconciled);
            if (depositedBankAccountNum != null) {
                i.setBankAccount(new BankAccount());
                i.getBankAccount().setAccountNumber(depositedBankAccountNum);
            }
            i.getBank().setTenantId(getTenentId());
            if (StringUtils.isNotBlank(bankId))
                i.getBank().setId(Long.parseLong(bankId));
        }
        return this.updateInstruments(instruments);
    }

    public InstrumentResponse depositeInstruments(List<Instrument> instruments, String depositedBankAccountNum) {
        FinancialStatus finStatus = new FinancialStatus();
        finStatus.setCode("Deposited");
        finStatus.setName("Deposited");
        return this.updateInstruments(instruments, depositedBankAccountNum, finStatus);
    }

    public InstrumentResponse depositeInstruments(List<Instrument> instruments, String depositedBankAccountNum,
            String bankId) {
        FinancialStatus finStatus = new FinancialStatus();
        finStatus.setCode("Deposited");
        finStatus.setName("Deposited");
        for (Instrument i : instruments) {
            i.setFinancialStatus(finStatus);
            if (depositedBankAccountNum != null) {
                i.setBankAccount(new BankAccount());
                i.getBankAccount().setAccountNumber(depositedBankAccountNum);
            }
            i.getBank().setTenantId(getTenentId());
            if (StringUtils.isNotBlank(bankId))
                i.getBank().setId(Long.parseLong(bankId));
        }
        return this.updateInstruments(instruments);
    }

    public InstrumentResponse reconcileInstrumentsWithPayinSlipId(List<Instrument> instruments,
            String depositedBankAccountNum, Long payInSlipId, String bankId) {
        FinancialStatus instrumentStatusReconciled = new FinancialStatus();
        instrumentStatusReconciled.setCode("Reconciled");
        for (Instrument i : instruments) {
            i.setFinancialStatus(instrumentStatusReconciled);
            if (depositedBankAccountNum != null) {
                i.setBankAccount(new BankAccount());
                i.getBankAccount().setAccountNumber(depositedBankAccountNum);
            }
            i.getBank().setTenantId(getTenentId());
            if (StringUtils.isNotBlank(bankId))
                i.getBank().setId(Long.parseLong(bankId));
        }
        return this.updateInstruments(instruments);
    }

    public RemittanceResponse createRemittance(List<Remittance> remittanceList) {
        final StringBuilder url = new StringBuilder(appConfigManager.getEgovCollSerHost() + remittanceCreateUrl);
        RemittanceRequest request = new RemittanceRequest();
        request.setRemittances(remittanceList);
        final RequestInfo requestInfo = new RequestInfo();

        requestInfo.setAuthToken(generateAdminToken(getTenentId()));
        requestInfo.setUserInfo(new UserInfo());
        requestInfo.getUserInfo().setId(ApplicationThreadLocals.getUserId());
        request.setRequestInfo(requestInfo);

        return restTemplate.postForObject(url.toString(), request, RemittanceResponse.class);
    }

    public ReceiptResponse updateReceipts(List<Receipt> receiptList) {
        final StringBuilder url = new StringBuilder(appConfigManager.getEgovCollSerHost() + receiptUpdateUrl);
        ReceiptRequest request = new ReceiptRequest();
        receiptList.stream().forEach(rec -> {
            if (rec.getInstrument().getBank() != null) {
                rec.getInstrument().getBank().setTenantId(getTenentId());
            }
        });
        request.setReceipt(receiptList);
        final RequestInfo requestinfo = getRequestInfo();
        request.setRequestInfo(requestinfo);

        return restTemplate.postForObject(url.toString(), request, ReceiptResponse.class);
    }

    public List<Task> getTasks() {

        List<Task> tasks = new ArrayList<>();
        if (isNotBlank(workflowServiceUrl)) {
            final RestTemplate restTemplate = new RestTemplate();
            TaskResponse tresp;
            try {
                RequestInfo createRequestInfo = createRequestInfo();
                RequestInfoWrapper requestInfo = new RequestInfoWrapper();
                requestInfo.setRequestInfo(createRequestInfo);
                LOGGER.info("call:" + workflowServiceUrl);
                tresp = restTemplate.postForObject(workflowServiceUrl, requestInfo, TaskResponse.class);
                tasks = tresp.getTasks();
            } catch (final  RestClientException e) {
            	LOGGER.warn("Exception while getting inbox items from microservice ",e);
            }
        }
        return tasks;
    }

    public List<Inbox> getInboxItems() {
        List<Inbox> inboxItems = new LinkedList<>();
        if (hasWorkflowService())
            for (Task t : getTasks()) {
                Inbox inboxItem = new Inbox();
                inboxItem.setId(t.getId());
                inboxItem.setCreatedDate(t.getCreatedDate());
                inboxItem.setDate(toDefaultDateTimeFormat(t.getCreatedDate()));
                inboxItem.setSender(t.getSenderName());
                inboxItem.setTask(t.getNatureOfTask());
                inboxItem.setStatus(t.getStatus());
                inboxItem.setDetails(t.getDetails());
                inboxItem.setLink(t.getUrl());
                inboxItem.setSender(t.getSenderName());
                inboxItems.add(inboxItem);
            }
        return inboxItems;
    }

    public boolean hasWorkflowService() {
        return isNotBlank(workflowServiceUrl);
    }

    public void saveAuthToken(String auth_token, String sessionId) {
        redisTemplate.opsForHash().putIfAbsent(auth_token, sessionId, sessionId);
    }

    public String readSesionIdByAuthToken(String auth_token) {

        if (redisTemplate.hasKey(auth_token)) {
            return (String) redisTemplate.opsForValue().get(auth_token);
        }
        return null;
    }

    public void SaveSessionToRedis(String access_token, String sessionId, Map<String, String> values) {

        if (null != access_token && null != values && values.size() > 0) {
            values.keySet().forEach(key -> {
                redisTemplate.opsForHash().putIfAbsent(sessionId, key, values.get(key));
            });
            redisTemplate.opsForList().leftPush(access_token, sessionId);
        }

    }

    public void savetoRedis(String sessionId, String key, Object obj) {
        redisTemplate.opsForHash().putIfAbsent(sessionId, key, obj);
    }

    public void setExpire(String key) {
        redisTemplate.expire(key, 30, TimeUnit.MINUTES);
    }

    public Object readFromRedis(String sessionId, String key) {
        if (redisTemplate.hasKey(sessionId))
            return redisTemplate.opsForHash().get(sessionId, key);
        else
            return null;
    }

    public void removeSessionFromRedis(String access_token, String sessionId) {
        LOGGER.info("Logout for authtoken : " + access_token + " and session : " + sessionId);
        if (null != access_token && redisTemplate.hasKey(access_token)) {
            sessionId = (String) redisTemplate.opsForHash().get(sessionId, sessionId);
            if (sessionId != null) {
                System.out.println("***********sessionId**** " + sessionId);
                redisTemplate.delete(sessionId);
                System.out.println("spring:session:sessions:" + sessionId);
                System.out.println("spring:session:sessions:expires:" + sessionId);
                redisTemplate.delete("spring:session:sessions:" + sessionId);
                redisTemplate.delete("spring:session:sessions:expires:" + sessionId);
                redisTemplate.opsForHash().delete(access_token, sessionId);
            } else
                LOGGER.info("session not found in redis for : " + access_token);
        } else {
            LOGGER.info("authtoken not found in redis : " + access_token);
        }
    }

    public void refreshToken(String oldToken, String newToken) {
        LOGGER.info("Refresh Token is called OLD::NEW" + oldToken + " :: " + newToken);
        if (redisTemplate.hasKey(oldToken)) {

            while (redisTemplate.opsForList().size(oldToken) > 0) {

                Object sessionId = redisTemplate.opsForList().leftPop(oldToken);
                if (redisTemplate.hasKey(sessionId))
                    if (oldToken.equals(redisTemplate.opsForHash().get(sessionId, "ACCESS_TOKEN"))) {
                        redisTemplate.opsForHash().delete(sessionId, "ACCESS_TOKEN");
                        redisTemplate.opsForHash().put(sessionId, "ACCESS_TOKEN", newToken);
                        redisTemplate.delete(oldToken);
                        redisTemplate.opsForValue().set(newToken, sessionId);
                    }
                redisTemplate.opsForList().leftPush(newToken, sessionId);
            }
            redisTemplate.delete(oldToken);

        }
    }

    public static ResponseInfo getResponseInfo(RequestInfo requestInfo, Integer status, String apiId) {
        ResponseInfo info = new ResponseInfo();

        if (requestInfo != null) {
            info.setVer(requestInfo.getVer());
            info.setResMsgId(requestInfo.getMsgId());
            info.setApiId(requestInfo.getApiId());
        } else if (apiId == null)
            info.setApiId(apiId);

        if (status != null)
            info.setStatus(status.toString());
        else
            Log.error("Code is sending null value for status");
        info.setTs(new Date().toString());
        return info;
    }

    public static Long getEpochDate(Date date) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneOffset.UTC);
        // Date date = new Date();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = dateFormat.format(date);
        long epoch = Instant.from(fmt.parse(strDate)).toEpochMilli();
        return epoch;
    }

    public void pushDataToIndexer(Object data, String topicName) {
        try {
            StringBuilder uri = new StringBuilder(appConfigManager.getEgovIndexerSerHost()).append(egovIndexerUrl);
            Object postForObject = restTemplate.postForObject(uri.toString(), data, Object.class, topicName);
        } catch (RestClientException e) {
            Log.error("ERROR occurred while trying to push the data to indexer : ", e);
        }
    }

    public Object getMdmsData(List<ModuleDetail> moduleDetails, boolean isStateLevel, String tenantId, String token) {
        String mdmsUrl = appConfigManager.getEgovMdmsSerHost() + this.mdmsSearchUrl;
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setAuthToken(token != null && !token.isEmpty() ? token : getUserToken());
        MdmsCriteria mdmscriteria = new MdmsCriteria();
        if (tenantId == null) {
            if (isStateLevel) {
                mdmscriteria.setTenantId(getTenentId().split(Pattern.quote("."))[0]);
            } else {
                mdmscriteria.setTenantId(getTenentId());
            }
        } else {
            mdmscriteria.setTenantId(tenantId);
        }
        mdmscriteria.setModuleDetails(moduleDetails);
        MdmsCriteriaReq mdmsrequest = new MdmsCriteriaReq();
        mdmsrequest.setRequestInfo(requestInfo);
        mdmsrequest.setMdmsCriteria(mdmscriteria);
        return restTemplate.postForObject(mdmsUrl, mdmsrequest, Map.class);
    }

    public String getHeaderNameForTenant() {
        String ulbGrade = "";
        List<ModuleDetail> moduleDetailList = new ArrayList<>();
        String tenentId = getTenentId();
        try {
            this.prepareModuleDetails(moduleDetailList, "tenant", "tenants", "code", tenentId, String.class);
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailList, true, null, null), Map.class);
            if (postForObject != null) {
                ulbGrade = mapper.convertValue(
                        JsonPath.read(postForObject, "$.MdmsRes.tenant.tenants[0].city.ulbGrade"), String.class);
            }
            if (ulbGrade != null && !ulbGrade.isEmpty())
                ulbGrade = environment.getProperty(ulbGrade, ulbGrade);
        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching header name of tenant in getHeaderNameForTenant : ", e);
        }
        return tenentId.split(Pattern.quote("."))[1] + " " + (ulbGrade != null ? ulbGrade : "");
    }

    private void prepareModuleDetails(List<ModuleDetail> moduleDetailsList, String moduleNme, String masterName,
            String filterKey, String filterValue, Class filterType) {
        List<MasterDetail> masterDetails = new ArrayList<>();
        ListIterator<ModuleDetail> listIterator = moduleDetailsList.listIterator();
        while (listIterator.hasNext()) {
            ModuleDetail existModName = listIterator.next();
            if (existModName.getModuleName().equals(moduleNme)) {
                this.prepareMasterDetails(existModName.getMasterDetails(), masterName, filterKey, filterValue,
                        filterType);
                listIterator.remove();
                listIterator.add(existModName);
                return;
            }
        }
        this.prepareMasterDetails(masterDetails, masterName, filterKey, filterValue, filterType);
        moduleDetailsList.add(new ModuleDetail(moduleNme, masterDetails));
    }

    private void prepareMasterDetails(List<MasterDetail> masterDetailList, String masterName, String filterKey,
            String filterValue, Class filterType) {
        String filter = null;
        StringBuilder filterBuilder = new StringBuilder();
        ListIterator<MasterDetail> listIterator = masterDetailList.listIterator();
        while (listIterator.hasNext()) {
            MasterDetail md = listIterator.next();
            if (md.getName().equals(masterName)) {
                if (StringUtils.isNotBlank(filterKey) && StringUtils.isNotBlank(filterValue)) {
                    String oldFilter = md.getFilter();
                    if (StringUtils.isNotBlank(oldFilter)) {
                        Pattern pattern = Pattern.compile(filterKey);
                        Matcher matcher = pattern.matcher(oldFilter);
                        if (matcher.find()) {
                            String newFilter = oldFilter.substring(0, oldFilter.length() - 3);
                            filterBuilder.append(newFilter).append(",").append(getSingleQuoteBasedOnType(filterType))
                                    .append(filterValue).append(getSingleQuoteBasedOnType(filterType)).append("])]");
                        } else {
                            String newFilter = oldFilter.substring(0, oldFilter.length() - 2);
                            filterBuilder.append(newFilter).append(" && ").append("@.").append(filterKey)
                                    .append(" in [").append(getSingleQuoteBasedOnType(filterType)).append(filterValue)
                                    .append(getSingleQuoteBasedOnType(filterType)).append("])]");
                        }
                    } else {
                        filterBuilder.append("[?(@.").append(filterKey).append(" in [")
                                .append(getSingleQuoteBasedOnType(filterType)).append(filterValue)
                                .append(getSingleQuoteBasedOnType(filterType)).append("])]");
                    }
                    listIterator.remove();
                    filter = filterBuilder.toString();
                    masterDetailList.add(new MasterDetail(masterName, filter));
                }
                return;
            }
        }
        if (filterKey != null && filterValue != null) {
            filterBuilder.append("[?(@.").append(filterKey).append(" in [")
                    .append(getSingleQuoteBasedOnType(filterType)).append(filterValue)
                    .append(getSingleQuoteBasedOnType(filterType)).append("])]");
            filter = filterBuilder.toString();
        }
        masterDetailList.add(new MasterDetail(masterName, filter));
    }

    private String getSingleQuoteBasedOnType(Class filterType) {
        String string = filterType.getSimpleName().equalsIgnoreCase("Boolean")
                || filterType.getSimpleName().equalsIgnoreCase("Long") ? "" : "'";
        return string;
    }

    public String getBusinessServiceNameByCode(String code) {
        String serviceName = "";
        try {
            List<BusinessService> serviceByCodes = this.getBusinessServiceByCodes(Collections.singleton(code));
            if (serviceByCodes != null && !serviceByCodes.isEmpty()) {
                serviceName = serviceByCodes.get(0).getBusinessService();
            }
        } catch (ApplicationRuntimeException e) {
            LOGGER.error(
                    "ERROR occurred while fetching business service details in getBusinessServiceNameByCode method: ",
                    e);
        }
        return serviceName.isEmpty() ? code : serviceName;
    }

    public List<BusinessService> getBusinessServiceByCodes(Set<String> codes) {
        List<BusinessService> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        try {
            if (codes != null && !codes.isEmpty()) {
                for (String code : codes)
                    this.prepareModuleDetails(moduleDetailsList, "BillingService", "BusinessService", "code", code,
                            String.class);
            } else {
                this.prepareModuleDetails(moduleDetailsList, "BillingService", "BusinessService", "code", null,
                        String.class);
            }
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
            if (postForObject != null) {
                return list = mapper.convertValue(
                        JsonPath.read(postForObject, "$.MdmsRes.BillingService.BusinessService"),
                        new TypeReference<List<BusinessService>>() {
                        });
            }
        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching business service details in getBusinessServiceByCodes method: ",
                    e);
        }
        return null;
    }

    public List<BusinessService> getBusinessService(String type) {
        List<BusinessService> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        this.prepareModuleDetails(moduleDetailsList, "BillingService", "BusinessService", "type", type, String.class);
        Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
        if (postForObject != null) {
            list = mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.BillingService.BusinessService"),
                    new TypeReference<List<BusinessService>>() {
                    });
        }
        return list;
    }

    public List<BusinessService> getBusinessServices(List<String> types) {
        List<BusinessService> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        for (String type : types)
            this.prepareModuleDetails(moduleDetailsList, "BillingService", "BusinessService", "type", type,
                    String.class);
        Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
        if (postForObject != null) {
            list = mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.BillingService.BusinessService"),
                    new TypeReference<List<BusinessService>>() {
                    });
        }
        return list;
    }

    public List<BusinessServiceMapping> getBusinessServiceMappingBySearchCriteria(BusinessServiceCriteria criteria) {
        List<BusinessServiceMapping> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        Field[] declaredFields = criteria.getClass().getDeclaredFields();
        for (Field field : declaredFields) {
            field.setAccessible(true);
            String fieldName = field.getName();
            String fieldValue = null;
            Class<?> fieldType = String.class;
            try {
                if (field.getType().equals(Boolean.TYPE)) {
                    fieldValue = (Boolean) field.get(criteria) ? "true" : "false";
                    fieldType = Boolean.class;
                } else if (field.getType().equals(Long.TYPE)) {
                    fieldValue = (String) field.get(criteria);
                    fieldType = Long.class;
                } else {
                    fieldValue = (String) field.get(criteria);
                }
            } catch (IllegalArgumentException | IllegalAccessException e) {
                LOGGER.error(
                        "ERROR occurred while fetching business service mapping details in getBusinessServiceMappingBySearchCriteria method: ",
                        e);
            }
            if (StringUtils.isNotBlank(fieldValue)) {
                for (String str : StringUtils.split(fieldValue, ",")) {
                    this.prepareModuleDetails(moduleDetailsList, "FinanceModule", "BusinessServiceMapping", fieldName,
                            str, fieldType);
                }
            }
        }
        Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
        if (postForObject != null) {
            list = mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.FinanceModule.BusinessServiceMapping"),
                    new TypeReference<List<BusinessServiceMapping>>() {
                    });
        }
        return list;
    }

    public List<TaxHeadMaster> getTaxheadsByServiceCode(String serviceCode) {
        List<TaxHeadMaster> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        this.prepareModuleDetails(moduleDetailsList, "BillingService", "TaxHeadMaster", "service", serviceCode,
                String.class);
        Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
        if (postForObject != null) {
            list = mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.BillingService.TaxHeadMaster"),
                    new TypeReference<List<TaxHeadMaster>>() {
                    });
        }
        return list;
    }

    public InstrumentResponse updateInstruments(List<Instrument> instruments, String depositedBankAccountNum,
            FinancialStatus finStatus) {
        for (Instrument i : instruments) {
            i.setFinancialStatus(finStatus);
            if (depositedBankAccountNum != null) {
                i.setBankAccount(new BankAccount());
                i.getBankAccount().setAccountNumber(depositedBankAccountNum);
            }
            i.getBank().setTenantId(getTenentId());
        }
        return updateInstruments(instruments);
    }

    public InstrumentResponse updateInstruments(List<Instrument> instruments) {
        final StringBuilder url = new StringBuilder(appConfigManager.getEgovEgfInstSerHost())
                .append(instrumentUpdateUrl);
        InstrumentRequest request = new InstrumentRequest();
        request.setInstruments(instruments);
        final RequestInfo requestinfo = new RequestInfo();
        requestinfo.setAuthToken(getUserToken());
        request.setRequestInfo(requestinfo);
        return restTemplate.postForObject(url.toString(), request, InstrumentResponse.class);
    }

    public InstrumentAccountCode getInstrumentAccountGlCodeByType(String type) {
        List<InstrumentAccountCode> list = null;
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        this.prepareModuleDetails(moduleDetailsList, "FinanceModule", "InstrumentGLcodeMapping", "instrumenttype", type,
                String.class);
        Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
        if (postForObject != null) {
            list = mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.FinanceModule.InstrumentGLcodeMapping"),
                    new TypeReference<List<InstrumentAccountCode>>() {
                    });
        }
        return !list.isEmpty() ? list.get(0) : null;
    }

    public Department getDepartment(String code, String tenantId, String token) {
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        this.prepareModuleDetails(moduleDetailsList, "common-masters", "Department", "code", code, String.class);
        try {
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, tenantId, token),
                    Map.class);
            if (postForObject != null) {
                return mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.common-masters.Department[0]"),
                        Department.class);
            }
        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching the Department for code : " + code, e);
        }
        return null;
    }

    public List<Payment> getPayments(PaymentSearchCriteria searchCriteria) {
        PaymentResponse response = null;
        StringBuilder url = new StringBuilder();
        if (paymentSearchEndPointEnabled) {
            url = new StringBuilder(appConfigManager.getEgovCollSerHost())
                    .append(appConfigManager.getCollSerPaymentModuleNameSearch()).append("?");
        } else {
            url = new StringBuilder(appConfigManager.getEgovCollSerHost())
                    .append(appConfigManager.getCollSerPaymentSearch()).append("?");
        }
        final RequestInfo requestInfo = getRequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();
        reqWrapper.setRequestInfo(requestInfo);
        try {
            preparePaymentSearchQueryString(searchCriteria, url);
            if (paymentSearchEndPointEnabled) {
                for (String serviceCode :searchCriteria.getBusinessServices()) {
                response = restTemplate.postForObject(url.toString(), reqWrapper, PaymentResponse.class,serviceCode);
                }
            } else {
                response = restTemplate.postForObject(url.toString(), reqWrapper, PaymentResponse.class);
            }
            return response!=null ? response.getPayments() : null;

        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching the Payment list : ", e);
        }
        return null;
    }

    public StorageResponse getFileStorageService(final List<MultipartFile> files, String modulename)
            throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("module", modulename);
        map.add("tenantId", getTenentId());

        ByteArrayResource contentsAsResource = null;
        for (MultipartFile file : files) {
            contentsAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
        };
        map.add("file", contentsAsResource);
        //map.add("file", contentsAsResource);
       
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovFileStoreSerHost())
                .append(appConfigManager.getEgovFileStoreUploadFile());

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, headers);

        return restTemplate.postForObject(uri.toString(), request, StorageResponse.class);
    }
    
    public ResponseEntity<byte[]> fetchFilesFromDigitService(String fileStoreId) {
        Map<String, String> request = new HashMap<String, String>();
        String tenantId=getTenentId();
        request.put("tenantId", tenantId);
        request.put("fileStoreId", fileStoreId);
        
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovFileStoreSerHost())
                .append(appConfigManager.getEgovFileStoreDownloadFile()).append("?");

        if (StringUtils.isNotBlank(tenantId)) {
            uri.append("tenantId=").append(tenantId);
        }
        if (StringUtils.isNotBlank(fileStoreId)) {
            uri.append("&fileStoreId=").append(fileStoreId);
        }
      
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<byte[]> response = restTemplate.exchange(uri.toString(), HttpMethod.GET, entity, byte[].class);
        return response;
    }
    
    private void preparePaymentSearchQueryString(PaymentSearchCriteria searchCriteria, StringBuilder url) {
        searchCriteria.setTenantId(getTenentId());
        url.append("tenantId=").append(searchCriteria.getTenantId());
        if (CollectionUtils.isNotEmpty(searchCriteria.getReceiptNumbers())) {
            url.append("&receiptNumbers=").append(StringUtils.join(searchCriteria.getReceiptNumbers(), ","));
        }
        if (CollectionUtils.isNotEmpty(searchCriteria.getStatus())) {
            url.append("&status=").append(StringUtils.join(searchCriteria.getStatus(), ","));
        }
        if (CollectionUtils.isNotEmpty(searchCriteria.getInstrumentStatus())) {
            url.append("&instrumentStatus=").append(StringUtils.join(searchCriteria.getInstrumentStatus(), ","));
        }
        if (CollectionUtils.isNotEmpty(searchCriteria.getPaymentModes())) {
            url.append("&paymentModes=").append(StringUtils.join(searchCriteria.getPaymentModes(), ","));
        }
        if (searchCriteria.getFromDate() != null) {
            url.append("&fromDate=").append(searchCriteria.getFromDate());
        }
        if (searchCriteria.getToDate() != null) {
            url.append("&toDate=").append(searchCriteria.getToDate());
        }
        if (StringUtils.isNotBlank(searchCriteria.getTransactionNumber())) {
            url.append("&transactionNumber=").append(searchCriteria.getTransactionNumber());
        }
        if (CollectionUtils.isNotEmpty(searchCriteria.getBusinessServices())) {
            url.append("&businessServices=").append(StringUtils.join(searchCriteria.getBusinessServices(), ","));
        }
        if (CollectionUtils.isNotEmpty(searchCriteria.getBillIds())) {
            url.append("&billIds=").append(StringUtils.join(searchCriteria.getBillIds(), ","));
        }
        if (CollectionUtils.isNotEmpty(searchCriteria.getIds())) {
            url.append("&ids=").append(StringUtils.join(searchCriteria.getIds(), ","));
        }
    }

    public PaymentResponse generatePayments(Payment payment) {
        PaymentResponse response = null;
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovCollSerHost())
                .append(appConfigManager.getCollSerPaymentCreate());
        final RequestInfo requestInfo = getRequestInfo();
        PaymentRequest request = PaymentRequest.builder().requestInfo(requestInfo).payment(payment).build();
        response = restTemplate.postForObject(uri.toString(), request, PaymentResponse.class);
        return response;
    }

    private RequestInfo getRequestInfo() {
        final RequestInfo requestInfo = new RequestInfo();
        requestInfo.setAuthToken(getUserToken());
        requestInfo.setUserInfo(getUserInfo());
        return requestInfo;
    }

    //payment workflow url without modulename
    public PaymentResponse performWorkflow(Set<String> paymentIdSet, PaymentAction action, String reason) {
        List<PaymentWorkflow> paymentWFList = paymentIdSet.stream().map(id -> PaymentWorkflow.builder().paymentId(id)
                .tenantId(getTenentId()).reason(reason).action(action).build()).collect(Collectors.toList());
        PaymentWorkflowRequest request = PaymentWorkflowRequest.builder().paymentWorkflows(paymentWFList)
                .requestInfo(getRequestInfo()).build();
        PaymentResponse response = null;
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovCollSerHost())
                .append(appConfigManager.getCollSerPaymentWorkflow());
        response = restTemplate.postForObject(uri.toString(), request, PaymentResponse.class);
        return response;
    }
    
    // payment workflow url with module name
    public PaymentResponse performWorkflowWithModuleName(Set<String> paymentIdSet, PaymentAction action, String reason,
            String serviceCode) {
        List<PaymentWorkflow> paymentWFList = paymentIdSet.stream().map(id -> PaymentWorkflow.builder().paymentId(id)
                .tenantId(getTenentId()).reason(reason).action(action).build()).collect(Collectors.toList());
        PaymentWorkflowRequest request = PaymentWorkflowRequest.builder().paymentWorkflows(paymentWFList)
                .requestInfo(getRequestInfo()).build();
        PaymentResponse response = null;
        StringBuilder uri = new StringBuilder();
        uri = new StringBuilder(appConfigManager.getEgovCollSerHost())
                .append(appConfigManager.getCollSerPaymentModuleNameWorkflow());
        response = restTemplate.postForObject(uri.toString(), request, PaymentResponse.class, serviceCode);
        return response;
    }

    public RemittanceResponse getRemittance(RemittanceSearcCriteria criteria) {
        StringBuilder uri = new StringBuilder(appConfigManager.getEgovCollSerHost())
                .append(appConfigManager.getCollSerRemittanceSearch()).append("?");
        this.prepareRemmittanceSearchQueryString(uri, criteria);
        RemittanceRequest request = new RemittanceRequest();
        request.setRequestInfo(getAdminRequestInfo());
        return restTemplate.postForObject(uri.toString(), request, RemittanceResponse.class);
    }

    private RequestInfo getAdminRequestInfo() {
        final RequestInfo requestInfo = new RequestInfo();
        requestInfo.setAuthToken(generateAdminToken(getTenentId()));
        requestInfo.setUserInfo(new UserInfo());
        requestInfo.getUserInfo().setId(ApplicationThreadLocals.getUserId());
        return requestInfo;
    }

    private void prepareRemmittanceSearchQueryString(StringBuilder uri, RemittanceSearcCriteria criteria) {
        if (StringUtils.isNotBlank(criteria.getBankaccount())) {
            uri.append("&bankaccount=").append(criteria.getBankaccount());
        }
        if (criteria.getFromDate() != null && criteria.getFromDate().longValue() != 0) {
            uri.append("&fromDate=").append(criteria.getFromDate());
        }
        if (criteria.getToDate() != null && criteria.getToDate().longValue() != 0) {
            uri.append("&toDate=").append(criteria.getToDate());
        }
        if (StringUtils.isNotBlank(criteria.getFund())) {
            uri.append("&fund=").append(criteria.getFund());
        }
        if (StringUtils.isNotBlank(criteria.getStatus())) {
            uri.append("&status=").append(criteria.getStatus());
        }
        if (criteria.getLimit() != null && criteria.getLimit().intValue() != 0) {
            uri.append("&limit=").append(criteria.getLimit());
        }
    }

    public List<AccountCodeTemplate> getAccountCodeTemplate(String module, String billSubType, String accountDetailType) {
        List<ModuleDetail> moduleDetailsList = new ArrayList<>();
        try {
            this.prepareModuleDetails(moduleDetailsList, "FinanceModule", "AccountCodeTemplate", "module", module, String.class);
            this.prepareModuleDetails(moduleDetailsList, "FinanceModule", "AccountCodeTemplate", "subModule", billSubType, String.class);
            this.prepareModuleDetails(moduleDetailsList, "FinanceModule", "AccountCodeTemplate", "subledgerType", accountDetailType, String.class);
            Map postForObject = mapper.convertValue(this.getMdmsData(moduleDetailsList, true, null, null), Map.class);
            if (postForObject != null) {
                return mapper.convertValue(JsonPath.read(postForObject, "$.MdmsRes.FinanceModule.AccountCodeTemplate"),new TypeReference<List<AccountCodeTemplate>>(){});
            }
        } catch (RestClientException e) {
            LOGGER.error("ERROR occurred while fetching AccountCode Templates in getAccountCodeTemplate method: ",e);
        }
        return null;
    }

   

}

class FilterRequest {
    private List<Long> id;

    private String name;

    private String code;

    @Size(min = 8, max = 64)
    @JsonProperty("names")
    private List<String> names;

    @Size(min = 1, max = 10)
    @JsonProperty("codes")
    private List<String> codes;

    private Boolean active;

    @NotNull
    private String tenantId;

    private String sortBy;

    private String sortOrder;

    @Min(1)
    @Max(500)
    private Short pageSize;

    private Short pageNumber;

    public List<Long> getId() {
        return id;
    }

    public void setId(List<Long> id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<String> getNames() {
        return names;
    }

    public void setNames(List<String> names) {
        this.names = names;
    }

    public List<String> getCodes() {
        return codes;
    }

    public void setCodes(List<String> codes) {
        this.codes = codes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Short getPageSize() {
        return pageSize;
    }

    public void setPageSize(Short pageSize) {
        this.pageSize = pageSize;
    }

    public Short getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(Short pageNumber) {
        this.pageNumber = pageNumber;
    }

}
