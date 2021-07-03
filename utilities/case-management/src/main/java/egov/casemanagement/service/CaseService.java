package egov.casemanagement.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import egov.casemanagement.config.Configuration;
import egov.casemanagement.models.AuditDetails;
import egov.casemanagement.models.user.User;
import egov.casemanagement.models.user.UserDetailResponse;
import egov.casemanagement.producer.Producer;
import egov.casemanagement.repository.IdGenRepository;
import egov.casemanagement.repository.SearchRepository;
import egov.casemanagement.repository.SignatureRepository;
import egov.casemanagement.utils.Utils;
import egov.casemanagement.web.models.*;
import egov.casemanagement.utils.SmsNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static egov.casemanagement.utils.Utils.getAuditDetails;
import static egov.casemanagement.utils.Utils.jsonMerge;

@Service
@Slf4j
public class CaseService {

    @Autowired
    private UserService userService;

    @Autowired
    private IdGenRepository idGenRepository;

    @Autowired
    private SignatureRepository signatureRepository;

    @Autowired
    private SearchRepository searchRepository;

    @Autowired
    private Producer producer;

    @Autowired
    private Configuration configuration;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SmsNotificationService smsNotificationService;

    public ModelCase createCase(CaseCreateRequest caseCreateRequest){
        ModelCase modelCase = caseCreateRequest.get_case();
        String mobileNumber = caseCreateRequest.get_case().getMobileNumber();

        validateCreateRequest(caseCreateRequest);
        enrichCreateRequest(caseCreateRequest);
        sanitizeData(modelCase, caseCreateRequest.getRequestInfo());
        // Generate signature
        modelCase.setSignature(signatureRepository.sign(modelCase.getTenantId(), getCaseObjForSign(modelCase)));

        producer.push(configuration.getSaveTopic(), modelCase.getUuid(), caseCreateRequest);
        producer.push(configuration.getEsCaseTopic(), modelCase.getUuid(), caseCreateRequest);

        smsNotificationService.sendCreateCaseSms(mobileNumber);
        return caseCreateRequest.get_case();
    }

    public ModelCase updateCase(CaseUpdateRequest caseUpdateRequest){
        UpdateCase updateCase = caseUpdateRequest.get_case();

        if(updateCase.getUuid() == null && updateCase.getCaseId() == null && updateCase.getMobileNumber() == null)
            throw new CustomException("INVALID_UPDATE", "Insufficient identifiers provided for update!");

        List<ModelCase> cases = searchCases(CaseSearchRequest.builder()
                .caseId(updateCase.getCaseId())
                .uuid(updateCase.getUuid())
                .mobileNumber(updateCase.getMobileNumber())
                .tenantId(updateCase.getTenantId())
                .build());

        if(cases.size() != 1)
            throw new CustomException("INVALID_UPDATE", "Unable to update, exactly one active case required for " +
                    "update");

        ModelCase modelCase = cases.get(0);

        updateFields(caseUpdateRequest, modelCase);

        sanitizeData(modelCase, caseUpdateRequest.getRequestInfo());

        modelCase.setSignature(signatureRepository.sign(modelCase.getTenantId(), getCaseObjForSign(modelCase)));
        CaseCreateRequest request = new CaseCreateRequest(caseUpdateRequest.getRequestInfo(), modelCase);
        producer.push(configuration.getUpdateTopic(), modelCase.getUuid(), request);
        producer.push(configuration.getEsCaseTopic(), modelCase.getUuid(), request);

        return modelCase;
    }

    public List<ModelCase> searchCases(CaseSearchRequest request){

        Map<String, User> userMap = new HashMap<>();

        if(request.getMobileNumber() != null || request.getUserUuids() != null) {
            List<User> user = userService.getUser(request, request.getRequestInfo()).getUser();
            user.forEach( u -> userMap.put(u.getUuid(), u));
            request.setUserUuids(userMap.keySet());
        }

        List<ModelCase> cases = searchRepository.searchCases(request);

        if(userMap.isEmpty()) {
            request.setUserUuids(cases.stream().map(ModelCase::getUserUuid).collect(Collectors.toSet()));
            List<User> user = userService.getUser(request, request.getRequestInfo()).getUser();
            user.forEach( u -> userMap.put(u.getUuid(), u));
        }

        for(ModelCase curr : cases){
            User user = userMap.get(curr.getUserUuid());
            curr.setName(user.getName());
            curr.setMobileNumber(user.getMobileNumber());
        }

        return cases;
    }

    public ModelCase addHealthDetail(HealthdetailCreateRequest request){
        if(request.getMobileNumber() == null && request.getUserUuid() == null)
            throw new CustomException("INVALID_UPDATE", "Mobile number or user identifier mandatory");

        CaseSearchRequest searchRequest = CaseSearchRequest.builder()
                .tenantId(request.getTenantId())
                .status(Status.ACTIVE)
                .requestInfo(request.getRequestInfo())
                .userUuids(request.getUserUuid() == null ? null : Collections.singleton(request.getUserUuid()))
                .mobileNumber(request.getMobileNumber())
                .build();

        List<ModelCase> cases = searchCases(searchRequest);
        if(cases.size() != 1)
            throw new CustomException("INVALID_UPDATE", "Unable to update, exactly one active case required for " +
                    "update");

        ModelCase modelCase = cases.get(0);

        AuditDetails auditDetails = Utils.getAuditDetails(request.getRequestInfo().getUserInfo().getUuid(), true);

        for(JsonNode node : request.getHealthDetails()){
            ((ObjectNode) node).set("auditDetails", objectMapper.convertValue(auditDetails,
                    JsonNode.class));
            ((ObjectNode) node).put("signature", signatureRepository.sign(modelCase.getTenantId(), node));
        }

        modelCase.setHealthDetails(jsonMerge(modelCase.getHealthDetails(), request.getHealthDetails()));

        sanitizeData(modelCase, request.getRequestInfo());

        CaseCreateRequest caseCreateRequest = new CaseCreateRequest(request.getRequestInfo(), modelCase);
        producer.push(configuration.getUpdateTopic(), modelCase.getUuid(), caseCreateRequest);
        producer.push(configuration.getEsCaseTopic(), modelCase.getUuid(), caseCreateRequest);

        return modelCase;
    }

    public List<ModelCase> getDefaulterCases(String tenantId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime midnight = now.toLocalDate().atStartOfDay();
        Long midnightTimestamp = Timestamp.valueOf(midnight).getTime();

        List<ModelCase> cases = searchRepository.searchDefaulterCases(tenantId, midnightTimestamp);
        cases = addUserDetails(cases);
        return cases;
    }

    private List<ModelCase> addUserDetails(List<ModelCase> cases) {
        for(ModelCase modelCase : cases) {
            UserDetailResponse userDetailResponse = userService.getUserDetailsFromUuid(modelCase.getUserUuid());
            modelCase.setMobileNumber(userDetailResponse.getUser().get(0).getMobileNumber());
            modelCase.setName(userDetailResponse.getUser().get(0).getName());
        }
        return cases;
    }

    private JsonNode getCaseObjForSign(ModelCase modelCase){
        JsonNode node = objectMapper.convertValue(modelCase, JsonNode.class);
        ((ObjectNode) node).remove("healthDetails");
        ((ObjectNode) node).remove("signature");
        return node;
    }

    private void updateFields(CaseUpdateRequest caseUpdateRequest, ModelCase modelCase) {
        UpdateCase updateCase = caseUpdateRequest.get_case();
        if(updateCase.getStartDate() != null)
            modelCase.setStartDate(updateCase.getStartDate());

        if(updateCase.getEndDate() != null)
            modelCase.setEndDate(updateCase.getEndDate());

        if(updateCase.getStatus() != null)
            modelCase.setStatus(updateCase.getStatus());

        if(updateCase.getReason() != null)
            modelCase.setReason(updateCase.getReason());

        if(updateCase.getAdditionalDetails() != null)
            modelCase.setAdditionalDetails(jsonMerge(modelCase.getAdditionalDetails(), updateCase.getAdditionalDetails()));

        AuditDetails auditDetails = modelCase.getAuditDetails();
        auditDetails.setLastModifiedBy(caseUpdateRequest.getRequestInfo().getUserInfo().getUuid());
        auditDetails.setLastModifiedTime(Instant.now().toEpochMilli());
    }

    private void validateCreateRequest(CaseCreateRequest caseCreateRequest){
        ModelCase modelCase = caseCreateRequest.get_case();
        RequestInfo requestInfo = caseCreateRequest.getRequestInfo();
        List<ModelCase> cases =
                searchCases(CaseSearchRequest.builder()
                        .mobileNumber(modelCase.getMobileNumber())
                        .requestInfo(requestInfo)
                        .build()
        );

        for(ModelCase curr : cases){
            if(curr.getStatus() == Status.ACTIVE)
                throw new CustomException("CASE_ACTIVE", "An active case already exists for this mobile number");
        }
    }

    private void enrichCreateRequest(CaseCreateRequest caseCreateRequest){
        RequestInfo requestInfo = caseCreateRequest.getRequestInfo();
        ModelCase modelCase = caseCreateRequest.get_case();

        List<String> applicationNumbers = idGenRepository.getIdList(requestInfo,
                modelCase.getTenantId(),
                configuration.getApplicationNumberIdgenName(),
                configuration.getApplicationNumberIdgenFormat(), 1);

        modelCase.setCaseId(applicationNumbers.get(0));
        modelCase.setUuid(UUID.randomUUID().toString());
        modelCase.setStatus(Status.ACTIVE);
        if(modelCase.getStartDate() == null)
            modelCase.setStartDate(Instant.now().toEpochMilli());

        modelCase.setAuditDetails(getAuditDetails(requestInfo.getUserInfo().getUuid(), true));

        userService.createUser(caseCreateRequest);
    }

    private void sanitizeData(ModelCase modelCase, RequestInfo requestInfo){
        if(requestInfo != null && requestInfo.getUserInfo()!=null) {
            requestInfo.getUserInfo().setMobileNumber("");
            requestInfo.getUserInfo().setUserName("");
            requestInfo.getUserInfo().setName("");
        }
        modelCase.setName("");
        modelCase.setMobileNumber("");
    }

}
