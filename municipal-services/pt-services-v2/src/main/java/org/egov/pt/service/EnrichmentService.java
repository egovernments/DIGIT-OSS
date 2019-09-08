package org.egov.pt.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.repository.IdGenRepository;
import org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnrichmentService {


    @Autowired
    PropertyUtil propertyutil;

    @Autowired
    IdGenRepository idGenRepository;

    @Autowired
    BoundaryService boundaryService;

    @Autowired
    private PropertyConfiguration config;



    /**
     * Assigns UUIDs to all id fields and also assigns acknowledgementnumber and assessmentnumber generated from idgen
     * @param request  PropertyRequest received for property creation
     * @param onlyPropertyDetail if true only the fields related to propertyDetail are enriched(assigned)
     */
    public void enrichCreateRequest(PropertyRequest request,Boolean onlyPropertyDetail) {
        RequestInfo requestInfo = request.getRequestInfo();
        AuditDetails propertyAuditDetails = propertyutil.getAuditDetails(requestInfo.getUserInfo().getUuid(), !onlyPropertyDetail);
        AuditDetails assessmentAuditDetails = propertyutil.getAuditDetails(requestInfo.getUserInfo().getUuid(),true);

        for (Property property : request.getProperties()) {
            if(!onlyPropertyDetail)
            {  property.getAddress().setId(UUID.randomUUID().toString());
            }
            setAssessmentNo(property.getTenantId(),property.getPropertyDetails(),requestInfo);
            property.getAddress().setTenantId(property.getTenantId());
            property.setAuditDetails(propertyAuditDetails);
            property.setStatus(PropertyInfo.StatusEnum.ACTIVE);
            property.getPropertyDetails().forEach(propertyDetail -> {
                //   if(propertyDetail.getAssessmentNumber()==null)
                {
                    propertyDetail.setTenantId(property.getTenantId());
                    propertyDetail.setAuditDetails(assessmentAuditDetails);
                    propertyDetail.setAssessmentDate(System.currentTimeMillis());
                    if(!CollectionUtils.isEmpty(propertyDetail.getUnits()))
                        propertyDetail.getUnits().forEach(unit -> {
                            unit.setId(UUID.randomUUID().toString());
                            unit.setTenantId(property.getTenantId());});
                    if( propertyDetail.getDocuments()!=null)
                        propertyDetail.getDocuments().forEach(document -> document.setId(UUID.randomUUID().toString()));
                    if(propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL"))
                    { propertyDetail.getInstitution().setId(UUID.randomUUID().toString());
                        propertyDetail.getInstitution().setTenantId(property.getTenantId());
                        propertyDetail.getOwners().forEach(owner -> {
                            owner.setInstitutionId(propertyDetail.getInstitution().getId());
                        });

                        propertyDetail.getOwners().forEach(owner -> {
                            if(owner.getMobileNumber()==null && owner.getAltContactNumber()!=null)
                                 owner.setMobileNumber(owner.getAltContactNumber());
                        });

                    }
                    propertyDetail.getOwners().forEach(owner -> {
                        if(!CollectionUtils.isEmpty(owner.getDocuments()))
                            owner.getDocuments().forEach(document -> {
                                document.setId(UUID.randomUUID().toString());
                            });
                    });
                }
            });
        }
        if(!onlyPropertyDetail)
            setIdgenIds(request);
        enrichBoundary(request);
    }

    /**
     * Assigns UUID for new fields that are added and sets propertyDetail and address ids from propertyId
     * @param request  PropertyRequest received for property update
     * @param propertiesFromResponse Properties returned by calling search based on ids in PropertyRequest
     */
    public void enrichUpdateRequest(PropertyRequest request,List<Property> propertiesFromResponse) {
        RequestInfo requestInfo = request.getRequestInfo();
        AuditDetails auditDetails = propertyutil.getAuditDetails(requestInfo.getUserInfo().getId().toString(), false);

        /*Map of propertyId to property is created from the responseproperty list
         * Not required if address id is sent in request was used before when one to one mapping was
         * present between property and propertyDetail
         * */
        Map<String,Property> idToProperty = new HashMap<>();
        propertiesFromResponse.forEach(propertyFromResponse -> {
            idToProperty.put(propertyFromResponse.getPropertyId(),propertyFromResponse);
        });

        /*For every Property if id of any subfield is null new uuid is assigned
         *
         * */
        for (Property property : request.getProperties()){
            property.setAuditDetails(auditDetails);

            //Not Required **
            String id = property.getPropertyId();
            Property responseProperty = idToProperty.get(id);
            property.getAddress().setId(responseProperty.getAddress().getId());
            /**/

            property.getPropertyDetails().forEach(propertyDetail -> {
                if (propertyDetail.getAssessmentNumber() == null)
                    propertyDetail.setAssessmentNumber(UUID.randomUUID().toString());
                Set<Document> documents = propertyDetail.getDocuments();
                List<Unit> units=propertyDetail.getUnits();

                if(documents!=null && !documents.isEmpty()){
                    documents.forEach(document ->{
                        if(document.getId()==null) document.setId(UUID.randomUUID().toString());
                    });
                }
                if(units!=null && !units.isEmpty()){
                    units.forEach(unit ->{
                        if(unit.getId()==null) unit.setId(UUID.randomUUID().toString());
                    });
                }
            });
        }
    }


    /**
     * Returns a list of numbers generated from idgen
     * @param requestInfo RequestInfo from the request
     * @param tenantId tenantId of the city
     * @param idKey code of the field defined in application properties for which ids are generated for
     * @param idformat format in which ids are to be generated
     * @param count Number of ids to be generated
     * @return List of ids generated using idGen service
     */
    private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey,
                                   String idformat,int count) {
        List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idformat,count).getIdResponses();

        if(CollectionUtils.isEmpty(idResponses))
            throw new CustomException("IDGEN ERROR","No ids returned from idgen Service");

        return idResponses.stream()
                .map(IdResponse::getId).collect(Collectors.toList());
    }

    /**
     * Sets the acknowledgement and assessment Numbers for given PropertyRequest
     * @param request PropertyRequest which is to be created
     */
    private void setIdgenIds(PropertyRequest request) {
        RequestInfo requestInfo = request.getRequestInfo();
        String tenantId = request.getProperties().get(0).getTenantId();
        List<Property> properties = request.getProperties();

        // Make one combined call? (If format is to be kept same)
        //Calling idGen service to generate id's
        List<String> acknowledgementNumbers = getIdList(requestInfo,tenantId,config.getAcknowldgementIdGenName(),config.getAcknowldgementIdGenFormat(),request.getProperties().size());
        List<String> propertyIds = getIdList(requestInfo,tenantId,config.getPropertyIdGenName(),config.getPropertyIdGenFormat(),request.getProperties().size());
        ListIterator<String> itAck = acknowledgementNumbers.listIterator();
        ListIterator<String> itPt = propertyIds.listIterator();

        Map<String,String> errorMap = new HashMap<>();
        if(acknowledgementNumbers.size()!=request.getProperties().size()){
            errorMap.put("IDGEN ERROR ","The number of acknowledgementNumbers returned by idgen is not equal to number of properties");
        }
        if(propertyIds.size()!=request.getProperties().size()){
            errorMap.put("IDGEN ERROR ","The number of propertyIds returned by idgen is not equal to number of properties");
        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

        properties.forEach(property -> {
            property.setAcknowldgementNumber(itAck.next());
            property.setPropertyId(itPt.next());
        });
    }


    /**
     * Sets assessmentNumbers for the given list of propertyDetail
     * @param tenantId tenantId of the propertyDetails
     * @param propertyDetails List of propertyDetails whose assessmentNumber is to be assigned
     * @param requestInfo RequestInfo of the PropertyRequest
     */
    private void setAssessmentNo(String tenantId,List<PropertyDetail> propertyDetails,RequestInfo requestInfo){
        int numOfPropertyDetails = propertyDetails.size();
        List<String> assessmentNumbers = getIdList(requestInfo,tenantId,config.getAssessmentIdGenName(),config.getAssessmentIdGenFormat(),numOfPropertyDetails);
        ListIterator<String> itAssess = assessmentNumbers.listIterator();
        Map<String,String> errorMap = new HashMap<>();
        if(assessmentNumbers.size()!=propertyDetails.size()){
            errorMap.put("IdGen ERROR ","The number of assessmentNumbers returned by idgen is not equal to number of propertyDetails");
        }
        propertyDetails.forEach(propertyDetail -> {
            propertyDetail.setAssessmentNumber(itAssess.next());
        });
    }


    /**
     * Populates the owner fields inside of property objects from the response got from calling user api
     * @param userDetailResponse response from user api which contains list of user which are used to populate owners in properties
     * @param properties List of property whose owner's are to be populated from userDetailResponse
     */
    public void enrichOwner(UserDetailResponse userDetailResponse, List<Property> properties){
        List<OwnerInfo> users = userDetailResponse.getUser();
        Map<String,OwnerInfo> userIdToOwnerMap = new HashMap<>();
        users.forEach(user -> userIdToOwnerMap.put(user.getUuid(),user));
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail ->
            {
                propertyDetail.getOwners().forEach(owner -> {
                    if(userIdToOwnerMap.get(owner.getUuid())==null)
                     throw new CustomException("OWNER SEARCH ERROR","The owner of the propertyDetail "+propertyDetail.getAssessmentNumber()+" is not coming in user search");
                    else
                      owner.addUserDetail(userIdToOwnerMap.get(owner.getUuid()));

                });
                if(userIdToOwnerMap.get(propertyDetail.getCitizenInfo().getUuid())!=null)
                  propertyDetail.getCitizenInfo().addCitizenDetail(userIdToOwnerMap.get(propertyDetail.getCitizenInfo().getUuid()));
                else
                    throw new CustomException("CITIZENINFO ERROR","The citizenInfo of property with id: "+property.getPropertyId()+" cannot be found");
            });
        });
    }



    /**
     * Populates ownerids in PropertyCriteria with the uuid's of users in userDetailResponse
     * @param criteria PropertyCriteria whose ownerids are to be populated
     * @param userDetailResponse The user response that contains list of users whose uuid's are to added
     */
    public void enrichPropertyCriteriaWithOwnerids(PropertyCriteria criteria, UserDetailResponse userDetailResponse){
        if(CollectionUtils.isEmpty(criteria.getOwnerids())){
            Set<String> ownerids = new HashSet<>();
            userDetailResponse.getUser().forEach(owner -> ownerids.add(owner.getUuid()));
            criteria.setOwnerids(ownerids);
        }
    }

    /**
     * Overloaded function which populates ownerids in criteria from list of property
     * @param criteria PropertyCriteria whose ownerids are to be populated
     * @param properties List of property whose owner's uuids are to added in propertyCriteria
     */
    public void enrichPropertyCriteriaWithOwnerids(PropertyCriteria criteria, List<Property> properties){
        Set<String> ownerids = new HashSet<>();
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> propertyDetail.getOwners().forEach(owner -> ownerids.add(owner.getUuid())));
        });
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                ownerids.add(propertyDetail.getCitizenInfo().getUuid());
            });
        });
        criteria.setOwnerids(ownerids);
    }

    /**
     * Returns PropertyCriteria with ids populated using propertyids from properties
     * @param properties properties whose propertyids are to added to propertyCriteria for search
     * @return propertyCriteria to search on basis of propertyids
     */
    public PropertyCriteria getPropertyCriteriaFromPropertyIds(List<Property> properties){
        PropertyCriteria criteria = new PropertyCriteria();
        Set<String> propertyids = new HashSet<>();
        properties.forEach(property -> propertyids.add(property.getPropertyId()));
        criteria.setIds(propertyids);
        criteria.setTenantId(properties.get(0).getTenantId());
        return criteria;
    }

    /**
     *  Enriches the locality object
     * @param request The propertyRequest received for create or update
     */
    public void enrichBoundary(PropertyRequest request){
        List<PropertyRequest> requests = getRequestByTenantId(request);
        requests.forEach(tenantWiseRequest -> {
        boundaryService.getAreaType(tenantWiseRequest,PTConstants.BOUNDARY_HEIRARCHY_CODE);
        });
    }

    /**
     * From single Request with multiple tenantIds returns List of PropertyRequests grouped together by tenantId
     * @param request PropertyRequest received from search
     * @return List of PropertyRequest grouped by tenantId
     */
    private List<PropertyRequest> getRequestByTenantId(PropertyRequest request){
        List<Property> properties = request.getProperties();
        RequestInfo requestInfo = request.getRequestInfo();

        Map<String,List<Property>> tenantIdToProperties = new HashMap<>();
        if(!CollectionUtils.isEmpty(properties)){
            properties.forEach(property -> {
                if(tenantIdToProperties.containsKey(property.getTenantId()))
                    tenantIdToProperties.get(property.getTenantId()).add(property);
                else{
                    List<Property> list = new ArrayList<>();
                    list.add(property);
                    tenantIdToProperties.put(property.getTenantId(),list);
                }
            });
        }
        List<PropertyRequest> requests = new LinkedList<>();

       tenantIdToProperties.forEach((key,value)-> {
           requests.add(new PropertyRequest(requestInfo,value));
       });
       return requests;
    }

    /**
     *
     * @param request The propertyrequest received for update
     */
    public void enrichAssessmentNumber(PropertyRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        request.getProperties().forEach(property -> {
            setAssessmentNo(property.getTenantId(),property.getPropertyDetails(),requestInfo);
        });
    }


}
