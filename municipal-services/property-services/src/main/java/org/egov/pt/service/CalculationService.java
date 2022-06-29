package org.egov.pt.service;

import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.oldProperty.OldUserDetailResponse;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.MigrationUtils;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private MigrationUtils migrationUtils;

    @Autowired
    private ObjectMapper mapper;


     public void calculateTax(AssessmentRequest assessmentRequest, Property property){
    	 
         StringBuilder uri = new StringBuilder(config.getCalculationHost())
			        		 .append(config.getCalculationContextPath())
			                 .append(config.getCalculationEndpoint());

         String tenantId = property.getTenantId();
         List<OwnerInfo> owners = new ArrayList<>();
         for(OwnerInfo ownerInfo : property.getOwners()){
             owners.add(getPlainOwnerDetails(assessmentRequest.getRequestInfo(),ownerInfo.getUuid(), tenantId));
         }
         property.setOwners(owners);

         Map<String, Object> oldPropertyObject = translationService.translate(assessmentRequest, property);
         Object response = serviceRequestRepository.fetchResult(uri, oldPropertyObject);
         if(response == null)
             throw new CustomException("CALCULATION_ERROR","The calculation object is coming null from calculation service");
     }

     

     /**
      * Calculates the mutation fee
      * @param requestInfo RequestInfo of the request
      * @param property Property getting mutated
      */
     public void calculateMutationFee(RequestInfo requestInfo, Property property){

         PropertyRequest propertyRequest = PropertyRequest.builder()
         		.requestInfo(requestInfo)
         		.property(property)
         		.build();

         String tenantId = property.getTenantId();
         List<OwnerInfo> owners = new ArrayList<>();
         for(OwnerInfo ownerInfo : property.getOwners()){
             owners.add(getPlainOwnerDetails(requestInfo,ownerInfo.getUuid(), tenantId));
         }
         property.setOwners(owners);

 		StringBuilder url = new StringBuilder(config.getCalculationHost())
 				.append(config.getCalculationContextPath())
 				.append(config.getMutationCalculationEndpoint());

 		serviceRequestRepository.fetchResult(url, propertyRequest);
 	}

    private OwnerInfo getPlainOwnerDetails(RequestInfo requestInfo, String uuid, String tenantId){
        User userInfoCopy = requestInfo.getUserInfo();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
        Map<String, Object> userSearchRequest = new HashMap<>();
        tenantId = tenantId.split("\\.")[0];

        Role role = Role.builder()
                .name("Internal Microservice Role").code("INTERNAL_MICROSERVICE_ROLE")
                .tenantId(tenantId).build();

        User userInfo = User.builder()
                .uuid(config.getEgovInternalMicroserviceUserUuid())
                .type("SYSTEM")
                .roles(Collections.singletonList(role)).id(0L).build();

        requestInfo.setUserInfo(userInfo);

        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("uuid",Collections.singletonList(uuid));
        OwnerInfo user = null;
        try {
            LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) migrationUtils.fetchResult(uri, userSearchRequest);


            List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
            String dobFormat = "yyyy-MM-dd";
            migrationUtils.parseResponse(responseMap,dobFormat);
            user = 	mapper.convertValue(users.get(0), OwnerInfo.class);

        } catch (Exception e) {
            throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user");
        }
        requestInfo.setUserInfo(userInfoCopy);
        return user;
    }


//     private CalculationReq createCalculationReq(PropertyRequest request){
//         CalculationReq calculationReq = new CalculationReq();
//         calculationReq.setRequestInfo(request.getRequestInfo());
//
//         request.getProperties().forEach(property -> {
//             CalculationCriteria calculationCriteria = new CalculationCriteria();
//             calculationCriteria.setProperty(property);
//             calculationCriteria.setTenantId(property.getTenantId());
//
//             calculationReq.addCalulationCriteriaItem(calculationCriteria);
//         });
//       return calculationReq;
//     }





}
