package egov.casemanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import egov.casemanagement.config.Configuration;
import egov.casemanagement.models.cova.CovaData;
import egov.casemanagement.models.cova.CovaSearchResponse;
import egov.casemanagement.models.user.User;
import egov.casemanagement.producer.Producer;
import egov.casemanagement.repository.ServiceRequestRepository;
import egov.casemanagement.utils.SmsNotificationService;
import egov.casemanagement.web.models.HealthdetailCreateRequest;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class CovaService {

    @Autowired
    private UserService userService;

    @Autowired
    private SmsNotificationService smsNotificationService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private Producer producer;

    @Autowired
    private Configuration configuration;

    @Autowired
    private ObjectMapper mapper;

    public void createCovaCases(RequestInfo requestInfo,String date){

        HttpHeaders headers = new HttpHeaders();
        headers.set("authorization", configuration.getCovaAuthToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map> request = new HttpEntity<>(Collections.singletonMap("timestamp", date), headers);
        LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(configuration.getCovaFetchUrl(), request);
        CovaSearchResponse response = mapper.convertValue(responseMap, CovaSearchResponse.class);

        if(response.getResponse() == 1){
            Set<String> mobileNumbers = new HashSet<>();
            for (CovaData record: response.getData()) {
                mobileNumbers.add(record.getMobileNumber());
            }
            Set<String> usersToCreate = userService.removeExistingUsers(mobileNumbers, requestInfo);
            for (String mobile: usersToCreate) {
                User user = userService.createCovaUser(requestInfo, mobile);
                if(user !=null && user.getUuid() != null){
                    log.info("User successfully created, sending on-boarding SMS.");
                    smsNotificationService.sendCreateCaseSms(mobile);
                }
            }
        }
    }

    public void addHealthDetail(HealthdetailCreateRequest request){
        if(request.getMobileNumber() == null )
            throw new CustomException("INVALID_CREATE_REQUEST", "Mobile number or user identifier mandatory");

        if( ! userService.userExists(request.getMobileNumber(), request.getRequestInfo()))
            throw new CustomException("INVALID_CREATE_REQUEST", "No COVA case registered against this number");


        producer.push(configuration.getCovaHealthRecordTopic(), request.getMobileNumber(), request);
        HttpHeaders headers = new HttpHeaders();
        headers.set("authorization", configuration.getCovaAuthToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> map = new HashMap<>();
        map.put("inspection_type", "W");
        map.put("mobile_no", request.getMobileNumber());
        map.put("arrival_at_home", getValFromBool(true));
        map.put("question_1", getValFromBool(request.getHealthDetails().at("/0/fever").asBoolean()));
        map.put("question_2", getValFromBool(request.getHealthDetails().at("/0/dryCough").asBoolean()));
        map.put("question_3", getValFromBool(request.getHealthDetails().at("/0/breathingIssues").asBoolean()));
        map.put("current_temp", request.getHealthDetails().at("/0/temperature").asText());
        HttpEntity<Map> body = new HttpEntity<>(map, headers);
        LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(configuration.getCovaCreateHealthRecordUrl(), body);

        if((int) responseMap.get("response") != 1) {
            log.error("Error response received from API!");
            log.error(responseMap.toString());
            throw new CustomException("HEALTH_DETAILS_SUBMITTED", "You have already submitted Self-Quarantine " +
                    "Inspection for the day.");
        }
    }

    private String getValFromBool(boolean flag){
        if(flag)
            return "YES";
        else
            return "NO";
    }
}
