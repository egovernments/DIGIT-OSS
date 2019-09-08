package org.egov.pt.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.ErrorConstants;
import  org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.models.Document;
import org.egov.pt.web.models.OwnerInfo;
import org.egov.pt.web.models.Property;
import org.egov.pt.web.models.PropertyCriteria;
import org.egov.pt.web.models.PropertyDetail;
import org.egov.pt.web.models.PropertyRequest;
import org.egov.pt.web.models.Unit;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PropertyValidator {


    @Autowired
    private PropertyUtil propertyUtil;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyConfiguration propertyConfiguration;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndpoint;



    /**
     * Validate the masterData and ctizenInfo of the given propertyRequest
     * @param request PropertyRequest for create
     */
    public void validateCreateRequest(PropertyRequest request){
        validateMasterData(request);
        validateCitizenInfo(request);
        validateUnits(request);
        validateMobileNumber(request);
    }

    /**
     * Validates the masterData,CitizenInfo and the authorization of the assessee for update
     * @param request PropertyRequest for update
     */
    public void validateUpdateRequest(PropertyRequest request){
        validateIds(request);
        validateMobileNumber(request);
        PropertyCriteria criteria = getPropertyCriteriaForSearch(request);
        List<Property> propertiesFromSearchResponse = propertyRepository.getProperties(criteria);
        boolean ifPropertyExists=PropertyExists(request,propertiesFromSearchResponse);
        if(!ifPropertyExists)
        {throw new CustomException("PROPERTY NOT FOUND","The property to be updated does not exist");}
        propertyUtil.addAddressIds(propertiesFromSearchResponse,request.getProperties());
        validateMasterData(request);
        validateCitizenInfo(request);
        if(request.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN"))
            validateAssessees(request);
    }

    /**
     * Validates if the fields in PropertyRequest are present in the MDMS master Data
     *
     * @param request PropertyRequest received for creating or update
     *
     */
    private void validateMasterData(PropertyRequest request){
        Map<String,String> errorMap = new HashMap<>();
        String tenantId = request.getProperties().get(0).getTenantId();

        String[] masterNames = {PTConstants.MDMS_PT_CONSTRUCTIONSUBTYPE, PTConstants.MDMS_PT_CONSTRUCTIONTYPE, PTConstants.MDMS_PT_OCCUPANCYTYPE,
                PTConstants.MDMS_PT_PROPERTYTYPE,PTConstants.MDMS_PT_PROPERTYSUBTYPE,PTConstants.MDMS_PT_OWNERSHIP,PTConstants.MDMS_PT_SUBOWNERSHIP,
                PTConstants.MDMS_PT_USAGEMAJOR,PTConstants.MDMS_PT_USAGEMINOR,PTConstants.MDMS_PT_USAGESUBMINOR,PTConstants.MDMS_PT_USAGEDETAIL,
                PTConstants.MDMS_PT_OWNERTYPE};
        List<String> names = new ArrayList<>(Arrays.asList(masterNames));

        validateFinancialYear(request,errorMap);
        validateInstitution(request,errorMap);
        Map<String,List<String>> codes = getAttributeValues(tenantId,PTConstants.MDMS_PT_MOD_NAME,names,"$.*.code",PTConstants.JSONPATH_CODES,request.getRequestInfo());
        validateMDMSData(masterNames,codes);
        validateCodes(request.getProperties(),codes,errorMap);

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    /**
     *Fetches all the values of particular attribute as map of fieldname to list
     *
     * @param tenantId tenantId of properties in PropertyRequest
     * @param names List of String containing the names of all masterdata whose code has to be extracted
     * @param requestInfo RequestInfo of the received PropertyRequest
     * @return Map of MasterData name to the list of code in the MasterData
     *
     */
    private Map<String,List<String>> getAttributeValues(String tenantId, String moduleName, List<String> names, String filter,String jsonpath, RequestInfo requestInfo){
        StringBuilder uri = new StringBuilder(mdmsHost).append(mdmsEndpoint);
        MdmsCriteriaReq criteriaReq = propertyUtil.prepareMdMsRequest(tenantId,moduleName,names,filter,requestInfo);
        try {
            Object result = serviceRequestRepository.fetchResult(uri, criteriaReq);
            return JsonPath.read(result,jsonpath);
        } catch (Exception e) {
            log.error("Error while fetvhing MDMS data",e);
            throw new CustomException(ErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
                    ErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
        }
    }

    /**
     *Checks if the codes of all fields are in the list of codes obtain from master data
     *
     * @param properties List of properties from PropertyRequest which are to validated
     * @param codes Map of MasterData name to List of codes in that MasterData
     * @param errorMap Map to fill all errors caught to send as custom Exception
     * @return Error map containing error if existed
     *
     */
    private static Map<String,String> validateCodes(List<Property> properties,Map<String,List<String>> codes,Map<String,String> errorMap){
        log.info("Validating Property");
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {

                if(!codes.get(PTConstants.MDMS_PT_PROPERTYTYPE).contains(propertyDetail.getPropertyType()) && propertyDetail.getPropertyType()!=null){
                    errorMap.put("Invalid PROPERTYTYPE","The PropertyType '"+propertyDetail.getPropertyType()+"' does not exists");
                }

                if(!codes.get(PTConstants.MDMS_PT_SUBOWNERSHIP).contains(propertyDetail.getSubOwnershipCategory()) && propertyDetail.getSubOwnershipCategory()!=null){
                    errorMap.put("Invalid SUBOWNERSHIPCATEGORY","The SubOwnershipCategory '"+propertyDetail.getSubOwnershipCategory()+"' does not exists");
                }

                if(!codes.get(PTConstants.MDMS_PT_OWNERSHIP).contains(propertyDetail.getOwnershipCategory()) && propertyDetail.getOwnershipCategory()!=null){
                    errorMap.put("Invalid OWNERSHIPCATEGORY","The OwnershipCategory '"+propertyDetail.getOwnershipCategory()+"' does not exists");
                }

                if(!codes.get(PTConstants.MDMS_PT_PROPERTYSUBTYPE).contains(propertyDetail.getPropertySubType()) && propertyDetail.getPropertySubType()!=null){
                    errorMap.put(ErrorConstants.INVALID_PROPERTYSUBTYPE,"The PropertySubType '"+propertyDetail.getPropertySubType()+"' does not exists");
                }

                if(!codes.get(PTConstants.MDMS_PT_USAGEMAJOR).contains(propertyDetail.getUsageCategoryMajor()) && propertyDetail.getUsageCategoryMajor()!=null){
                    errorMap.put("INVALID USAGECATEGORYMAJOR","The UsageCategoryMajor '"+propertyDetail.getUsageCategoryMajor()+"' at Property level does not exists");
                }

                if(!CollectionUtils.isEmpty(propertyDetail.getUnits()))
                    propertyDetail.getUnits().forEach(unit ->{
                        if(!codes.get(PTConstants.MDMS_PT_USAGEMAJOR).contains(unit.getUsageCategoryMajor()) && unit.getUsageCategoryMajor()!=null){
                            errorMap.put("INVALID USAGECATEGORYMAJOR","The UsageCategoryMajor '"+unit.getUsageCategoryMajor()+"' at unit level does not exists");
                        }

                        if(!codes.get(PTConstants.MDMS_PT_USAGEMINOR).contains(unit.getUsageCategoryMinor()) && unit.getUsageCategoryMinor()!=null){
                            errorMap.put("INVALID USAGECATEGORYMINOR","The UsageCategoryMinor '"+unit.getUsageCategoryMinor()+"' does not exists");
                        }

                        if(!codes.get(PTConstants.MDMS_PT_USAGESUBMINOR).contains(unit.getUsageCategorySubMinor()) && unit.getUsageCategorySubMinor()!=null){
                            errorMap.put("INVALID USAGECATEGORYSUBMINOR","The UsageCategorySubMinor '"+unit.getUsageCategorySubMinor()+"' does not exists");
                        }

                        if(!codes.get(PTConstants.MDMS_PT_USAGEDETAIL).contains(unit.getUsageCategoryDetail()) && unit.getUsageCategoryDetail()!=null){
                            errorMap.put("INVALID USAGECATEGORYDETAIL","The UsageCategoryDetail "+unit.getUsageCategoryDetail()+" does not exists");
                        }

                        if(!codes.get(PTConstants.MDMS_PT_CONSTRUCTIONTYPE).contains(unit.getConstructionType()) && unit.getConstructionType()!=null){
                            errorMap.put("INVALID CONSTRUCTIONTYPE","The ConstructionType '"+unit.getConstructionType()+"' does not exists");
                        }

                        if(!codes.get(PTConstants.MDMS_PT_CONSTRUCTIONSUBTYPE).contains(unit.getConstructionSubType()) && unit.getConstructionSubType()!=null){
                            errorMap.put("INVALID CONSTRUCTIONSUBTYPE","The ConstructionSubType '"+unit.getConstructionSubType()+"' does not exists");
                        }

                        if(!codes.get(PTConstants.MDMS_PT_OCCUPANCYTYPE).contains(unit.getOccupancyType()) && unit.getOccupancyType()!=null){
                            errorMap.put("INVALID OCCUPANCYTYPE","The OccupancyType '"+unit.getOccupancyType()+"' does not exists");
                        }

                        if("RENTED".equalsIgnoreCase(unit.getOccupancyType())){
                            if(unit.getArv()==null || unit.getArv().compareTo(new BigDecimal(0))!=1)
                                errorMap.put("INVALID ARV","Total Annual Rent should be greater than zero ");
                        }
                    });

                propertyDetail.getOwners().forEach(owner ->{
                    if(!codes.get(PTConstants.MDMS_PT_OWNERTYPE).contains(owner.getOwnerType()) && owner.getOwnerType()!=null){
                        errorMap.put("INVALID OWNERTYPE","The OwnerType '"+owner.getOwnerType()+"' does not exists");
                    }
                });
            });

        });
        return errorMap;

    }


    /**
     * Validates if MasterData is properly fetched for the given MasterData names
     * @param masterNames
     * @param codes
     */
    private void validateMDMSData(String[] masterNames,Map<String,List<String>> codes){
        Map<String,String> errorMap = new HashMap<>();
        for(String masterName:masterNames){
            if(CollectionUtils.isEmpty(codes.get(masterName))){
                errorMap.put("MDMS DATA ERROR ","Unable to fetch "+masterName+" codes from MDMS");
            }
        }
        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    /**
     * Validates units based on PropertyType
     * @param request PropertyRequest received for create or update
     */
    private void validateUnits(PropertyRequest request){
        Map<String,String> errorMap = new HashMap<>();
        request.getProperties().forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                /*If the Units is empty or null the propertyType should be vacant*/
                if(CollectionUtils.isEmpty(propertyDetail.getUnits()))
                    if(!propertyDetail.getPropertyType().equalsIgnoreCase("VACANT"))
                       errorMap.put("INVALID UNITS","Units cannot be null or empty");
                    else if(propertyDetail.getPropertyType().equalsIgnoreCase("VACANT"))
                       {if(propertyDetail.getLandArea()==null)
                           errorMap.put("INVALID LANDAREA","Vacant land cannot have landArea as null");
                       }

                if(request.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN")){
                    if(propertyDetail.getAdhocExemption()!=null || propertyDetail.getAdhocPenalty()!=null)
                        errorMap.put("INVALID ADHOC CHARGES","AdhocExemption or AdhocPenalty should be null for request from citizen ");
                }
            });
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    private void validateIds(PropertyRequest request){
        Map<String,String> errorMap = new HashMap<>();
        request.getProperties().forEach(property -> {
            if(property.getPropertyId()==null)
                errorMap.put("INVALID PROPERTY","Property cannot be updated without propertyId");
            property.getPropertyDetails().forEach(propertyDetail -> {
                if(propertyDetail.getAssessmentNumber()==null)
                    errorMap.put("INVALID PROPERTYDETAIL","The propertyDetail cannot be updated without assessment number");
            });
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    /**
     * Returns PropertyCriteria to search for properties in database with ids set from properties in request
     *
     * @param request PropertyRequest received for update
     * @return PropertyCriteria containg ids of all properties and all its childrens
     */
    public PropertyCriteria getPropertyCriteriaForSearch(PropertyRequest request) {

        RequestInfo requestInfo = request.getRequestInfo();
        List<Property> properties=request.getProperties();
        Set<String> ids = new HashSet<>();
        Set<String> propertyDetailids = new HashSet<>();
        Set<String> unitids = new HashSet<>();
        Set<String> documentids = new HashSet<>();
        Set<String> ownerids = new HashSet<>();
        Set<String> addressids = new HashSet<>();

        PropertyCriteria propertyCriteria = new PropertyCriteria();
        /*
         * Is search on ids other than propertyIds required?
         * */
        properties.forEach(property -> {
            ids.add(property.getPropertyId());
            if(!CollectionUtils.isEmpty(ids)) {
                if (property.getAddress().getId() != null)
                    addressids.add(property.getAddress().getId());
                property.getPropertyDetails().forEach(propertyDetail -> {
                    if (propertyDetail.getAssessmentNumber() != null)
                        propertyDetailids.add(propertyDetail.getAssessmentNumber());
                    if (!CollectionUtils.isEmpty(propertyDetail.getOwners()))
                        ownerids.addAll(getOwnerids(propertyDetail));
                    if (!CollectionUtils.isEmpty(propertyDetail.getDocuments()))
                        documentids.addAll(getDocumentids(propertyDetail));
                    if (!CollectionUtils.isEmpty(propertyDetail.getUnits())) {
                        unitids.addAll(getUnitids(propertyDetail));
                    }
                });
            }
        });

        propertyCriteria.setTenantId(properties.get(0).getTenantId());
        propertyCriteria.setIds(ids);
        propertyCriteria.setPropertyDetailids(propertyDetailids);
        propertyCriteria.setAddressids(addressids);
        propertyCriteria.setOwnerids(ownerids);
        propertyCriteria.setUnitids(unitids);
        propertyCriteria.setDocumentids(documentids);

        return propertyCriteria;
    }

    /**
     * Extract all ownerids from given propertyDetail
     * @param propertyDetail PropertyDetail whose owner ids are to be returned
     * @return Set of ids of all owners of the given propertyDetail
     */
    private Set<String> getOwnerids(PropertyDetail propertyDetail){
        Set<OwnerInfo> owners= propertyDetail.getOwners();
        Set<String> ownerIds = new HashSet<>();
        owners.forEach(owner -> {
            if(owner.getUuid()!=null)
                ownerIds.add(owner.getUuid());
        });
        return ownerIds;
    }


    /**
     * Adds ids of all Units of property to a list
     * @param propertyDetail PropertyDetail whose unit ids are to be returned
     * @return Set of all unitids of a propertyDetail
     */
    private List<String> getUnitids(PropertyDetail propertyDetail){
        List<Unit> units= propertyDetail.getUnits();
        List<String> unitIds = new ArrayList<>();
        units.forEach(unit -> {
            if(unit.getId()!=null)
                unitIds.add(unit.getId());
        });
        return unitIds;
    }


    /**
     * Adds ids of all Documents of property to a list
     * @param propertyDetail PropertyDetail whose document ids are to be returned
     * @return Set of all documentids of properyDetail
     */
    private Set<String> getDocumentids(PropertyDetail propertyDetail){
        Set<Document> documents= propertyDetail.getDocuments();
        Set<String> documentIds = new HashSet<>();
        documents.forEach(document -> {
            if(document.getId()!=null)
                documentIds.add(document.getId());
        });
        return documentIds;
    }

    /**
     * Checks if the property ids in search response are same as in request
     * @param request PropertyRequest received for update
     * @param responseProperties List of properties received from property Search
     * @return
     */
    public boolean PropertyExists(PropertyRequest request,List<Property> responseProperties){

        List<String> responseids = new ArrayList<>();
        List<String> requestids = new ArrayList<>();

        request.getProperties().forEach(property -> {
            requestids.add(property.getPropertyId());
        });

        responseProperties.forEach(property -> {
            responseids.add(property.getPropertyId());
        });
        return listEqualsIgnoreOrder(responseids,requestids);
    }


    /**
     * Compares if two list contains same elements
     * @param list1
     * @param list2
     * @param <T>
     * @return Boolean true if both list contains the same elements irrespective of order
     */
    private static <T> boolean listEqualsIgnoreOrder(List<T> list1, List<T> list2) {
        return new HashSet<>(list1).equals(new HashSet<>(list2));
    }


    /**
     * Validates the financial year in PropertyRequest by comparing data from MDMS
     * @param request PropertRequest received for update or create
     * @param errorMap ErrorMap to catch all the errors
     */
    private void validateFinancialYear(PropertyRequest request,Map<String,String> errorMap){
        String tenantId = request.getProperties().get(0).getTenantId();
        RequestInfo requestInfo = request.getRequestInfo();
        request.getProperties().forEach(property ->
                property.getPropertyDetails().forEach(propertyDetail ->
                        { // String filter = "$.FinancialYear[?(@.finYearRange == '"+propertyDetail.getFinancialYear()+"')].id";
                            String filter = "$.*.[?(@.module=='PT')].finYearRange";
                            Map<String,List<String>> years = getAttributeValues(tenantId.split("\\.")[0],PTConstants.MDMS_PT_EGF_MASTER,Arrays.asList("FinancialYear"),filter,PTConstants.JSONPATH_FINANCIALYEAR,requestInfo);
                            if(!years.get(PTConstants.MDMS_PT_FINANCIALYEAR).contains(propertyDetail.getFinancialYear()))
                            {
                                errorMap.put("INVALID FINANCIALYEAR","The finacialYear '"+propertyDetail.getFinancialYear()+"' is not valid for PT");
                            }
                        }
                ));
    }

    /**
     * Validates if institution Object has null InstitutionType
     * @param request PropertyRequest which is to be validated
     * @param errorMap ErrorMap to catch and to throw error using CustomException
     */
    private void validateInstitution(PropertyRequest request,Map<String,String> errorMap){
        List<Property> properties = request.getProperties();
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                log.debug("contains check: "+propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL"));
                // Checks for mandatory fields in Institution object if SubownershipCategory is INSTITUTIONAL
                if(propertyDetail.getInstitution()!=null && propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL")){
                    if(propertyDetail.getInstitution().getType()==null)
                        errorMap.put(" INVALID INSTITUTION OBJECT ","The institutionType cannot be null ");
                    if(propertyDetail.getInstitution().getName()==null)
                        errorMap.put("INVALID INSTITUTION OBJECT","Institution name cannot be null");
                    if(propertyDetail.getInstitution().getDesignation()==null)
                        errorMap.put("INVALID INSTITUTION OBJECT","Designation cannot be null");
                }
                // Throws error if the SubownerShipCategory is not institutional and the institution object contains not null values
                else if(!propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL") && propertyDetail.getInstitution()!=null){
                    if(propertyDetail.getInstitution().getType()!=null || propertyDetail.getInstitution().getName()!=null
                            || propertyDetail.getInstitution().getDesignation()!=null)
                        errorMap.put("INVALID INSTITUTION OBJECT","The institution object should be null. OwnershipCategory does not contain Institutional");
                }
            });
        });
    }


    /**
     * Validates the UserInfo of the the PropertyRequest. Update is allowed only for the user who created the property
     * @param request PropertyRequest received for update
     */
    private void validateAssessees(PropertyRequest request){
        String uuid = request.getRequestInfo().getUserInfo().getUuid();
        Map<String,String> errorMap = new HashMap<>();
        request.getProperties().forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                // Only the person who has created the property can assess it
                if(!propertyDetail.getCitizenInfo().getUuid().equals(uuid)){
                    errorMap.put("UPDATE AUTHORIZATION FAILURE","Not Authorized to assess property with propertyId "+property.getPropertyId());
                }
            });
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    /**
     * Validates if property is created by employee the citizenInfo cannot be null
     * @param request PropertyRequest received for create or update
     */
    private void validateCitizenInfo(PropertyRequest request){
        Map<String,String> errorMap = new HashMap<>();
        RequestInfo requestInfo = request.getRequestInfo();
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN")){
            request.getProperties().forEach(property -> {
                property.getPropertyDetails().forEach(propertyDetail -> {
                 // Checks for mandatory fields in citizenInfo if the assessment is done by employee
                    if(propertyDetail.getCitizenInfo()==null){
                        errorMap.put("INVALID CITIZENINFO","CitizenInfo Object cannot be null");
                    }
                    else if(propertyDetail.getCitizenInfo().getMobileNumber()==null)
                        errorMap.put("INVALID CITIZENINFO","MobileNumber in CitizenInfo cannot be null");
                    else if(propertyDetail.getCitizenInfo().getName()==null)
                        errorMap.put("INVALID CITIZENINFO","Name in CitizenInfo cannot be null");
                });
            });
        }
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    /**
     * Validates the mobileNumber of owners
     * @param request The propertyRequest received for create or update
     */
    private void validateMobileNumber(PropertyRequest request){
        Map<String,String > errorMap = new HashMap<>();
        request.getProperties().forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                if(!propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL"))
                {
                    propertyDetail.getOwners().forEach(owner -> {
                        if(owner.getMobileNumber()==null || !isMobileNumberValid(owner.getMobileNumber()))
                            errorMap.put("INVALID OWNER","MobileNumber is not valid");
                    });
                }
                if(propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL"))
                {
                    propertyDetail.getOwners().forEach(owner -> {
                        if(owner.getAltContactNumber()==null)
                            errorMap.put("INVALID OWNER","TelephoneNumber cannot be null for institutional");
                    });
                }

            });
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

    }

    public void validatePropertyCriteria(PropertyCriteria propertyCriteria,RequestInfo requestInfo){
        List<String> allowedParams = null;

        if(requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN"))
            allowedParams = Arrays.asList(propertyConfiguration.getCitizenSearchParams().split(","));
        else
            allowedParams = Arrays.asList(propertyConfiguration.getEmployeeSearchParams().split(","));

        if(propertyCriteria.getTenantId()==null)
            throw new CustomException("INVALID SEARCH","TenantId cannot be null in search");

        if(propertyCriteria.getName()!=null && !allowedParams.contains("name"))
            throw new CustomException("INVALID SEARCH","Search based on name is not available");

        if(propertyCriteria.getUserName()!=null && !allowedParams.contains("userName"))
            throw new CustomException("INVALID SEARCH","Search based on userName is not available");

        if(propertyCriteria.getMobileNumber()!=null && !allowedParams.contains("mobileNumber"))
            throw new CustomException("INVALID SEARCH","Search based on mobileNumber is not available");

        if(propertyCriteria.getDoorNo()!=null && !allowedParams.contains("doorNo"))
            throw new CustomException("INVALID SEARCH","Search based on doorNo is not available");

        if(propertyCriteria.getLocality()!=null && !allowedParams.contains("locality"))
            throw new CustomException("INVALID SEARCH","Search based on locality is not available");

        if(propertyCriteria.getAccountId()!=null && !allowedParams.contains("accountId"))
            throw new CustomException("INVALID SEARCH","Search based on accountId is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getIds()) && !allowedParams.contains("ids"))
            throw new CustomException("INVALID SEARCH","Search based on ids is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getPropertyDetailids()) && !allowedParams.contains("propertyDetailids"))
            throw new CustomException("INVALID SEARCH","Search based on assessmentNumber is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getOldpropertyids()) && !allowedParams.contains("oldpropertyids"))
            throw new CustomException("INVALID SEARCH","Search based on oldPropertyId is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getAddressids()) && !allowedParams.contains("addressids"))
            throw new CustomException("INVALID SEARCH","Search based on addressId is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getUnitids()) && !allowedParams.contains("unitids"))
            throw new CustomException("INVALID SEARCH","Search based on unitId is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getDocumentids()) && !allowedParams.contains("documentids"))
            throw new CustomException("INVALID SEARCH","Search based on documentId is not available");

        if(!CollectionUtils.isEmpty(propertyCriteria.getOwnerids()) && !allowedParams.contains("ownerids"))
            throw new CustomException("INVALID SEARCH","Search based on ownerId is not available");


        // Search on locality is allowed only with doorNo.
        if((propertyCriteria.getLocality()!=null && propertyCriteria.getDoorNo()==null) ||
                (propertyCriteria.getLocality()==null && propertyCriteria.getDoorNo()!=null))
            throw new CustomException("INVALID SEARCH","For search based on address locality and doorno are both mandatory");


        // Search Based only on tenantId is not allowed
         Boolean emptySearch = (propertyCriteria.getAccountId()==null && propertyCriteria.getName()==null
         && propertyCriteria.getLocality()==null && propertyCriteria.getDoorNo()==null
         && propertyCriteria.getMobileNumber()==null && propertyCriteria.getUserName()==null
         && CollectionUtils.isEmpty(propertyCriteria.getIds()) && CollectionUtils.isEmpty(propertyCriteria.getOldpropertyids())
         && CollectionUtils.isEmpty(propertyCriteria.getAddressids()) && CollectionUtils.isEmpty(propertyCriteria.getUnitids())
                 && CollectionUtils.isEmpty(propertyCriteria.getOwnerids()) && CollectionUtils.isEmpty(propertyCriteria.getPropertyDetailids())
                 && CollectionUtils.isEmpty(propertyCriteria.getDocumentids()));
        if(emptySearch)
            throw new CustomException("INVALID SEARCH","Search is not allowed on tenantId alone");

        if(requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN")){
            if(propertyCriteria.getAccountId()!=null
                    && !requestInfo.getUserInfo().getUuid().equalsIgnoreCase(propertyCriteria.getAccountId()))
                throw new CustomException("INVALID SEARCH","Unauthorized search on others uuid");
        }



    }

    /**
     * Validates if the mobileNumber is 10 digit and starts with 5 or greater
     * @param mobileNumber The mobileNumber to be validated
     * @return True if valid mobileNumber else false
     */
    private Boolean isMobileNumberValid(String mobileNumber){
        if(mobileNumber.length()!=10)
            return false;
        if(Character.getNumericValue(mobileNumber.charAt(0))<5)
            return false;
        return true;
    }







}
