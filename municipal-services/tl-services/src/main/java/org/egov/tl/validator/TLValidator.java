package org.egov.tl.validator;

import com.jayway.jsonpath.JsonPath;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.service.TradeLicenseService;
import org.egov.tl.service.UserService;
import org.egov.tl.util.BPAConstants;
import org.egov.tl.util.TLConstants;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.*;
import org.egov.tl.web.models.user.UserDetailResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.tl.util.TLConstants.businessService_BPA;
import static org.egov.tl.util.TLConstants.businessService_TL;
import static org.egov.tl.util.TLConstants.APPLICATION_TYPE_RENEWAL;

@Component
public class TLValidator {


    private TLRepository tlRepository;

    private TLConfiguration config;

    private PropertyValidator propertyValidator;

    private MDMSValidator mdmsValidator;

    private TradeUtil tradeUtil;

    private UserService userService;
   
    @Value("${egov.allowed.businessServices}")
    private String allowedBusinessService;

    @Value("${egov.receipt.businessserviceTL}")
    private String businessServiceTL;

    @Autowired
    public TLValidator(TLRepository tlRepository, TLConfiguration config, PropertyValidator propertyValidator,
                       MDMSValidator mdmsValidator, TradeUtil tradeUtil,UserService userService) {
        this.tlRepository = tlRepository;
        this.config = config;
        this.propertyValidator = propertyValidator;
        this.mdmsValidator = mdmsValidator;
        this.tradeUtil = tradeUtil;
        this.userService=userService;
    }


    /**
     *  Validate the create Requesr
     * @param request The input TradeLicenseRequest Object
     */
    public void validateCreate(TradeLicenseRequest request, Object mdmsData, Object billingSlabs) {
        List<TradeLicense> licenses = request.getLicenses();
        String businessService = request.getLicenses().isEmpty()?null:request.getLicenses().get(0).getBusinessService();
        if(licenses.get(0).getApplicationType() != null && licenses.get(0).getApplicationType().toString().equals(TLConstants.APPLICATION_TYPE_RENEWAL)){
            validateRenewal(request);
        }
        if (businessService == null)
            businessService = businessService_TL;
        switch (businessService) {
            case businessService_TL:
                valideDates(request, mdmsData);
                propertyValidator.validateProperty(request);
                validateTLSpecificNotNullFields(request);
                break;

            case businessService_BPA:
                validateBPASpecificValidations(request);
                break;
        }
        mdmsValidator.validateMdmsData(request, mdmsData, billingSlabs);
        validateInstitution(request);
        validateDuplicateDocuments(request);
    }

    public void validateBusinessService(TradeLicenseRequest request, String businessServiceFromPath) {
        List<String> allowedservices = Arrays.asList(allowedBusinessService.split(","));
        if (!allowedservices.contains(businessServiceFromPath)) {
            throw new CustomException("BUSINESSSERVICE_NOTALLOWED", " The business service is not allowed in this module");
        }
        for (TradeLicense license : request.getLicenses()) {
            String licenseBusinessService = license.getBusinessService()==null?businessService_TL:license.getBusinessService();
            if (!StringUtils.equals(businessServiceFromPath, licenseBusinessService)) {
                throw new CustomException("BUSINESSSERVICE_NOTMATCHING", " The business service inside license not matching with the one sent in path variable");
            }
        }
    }

    private void validateTLSpecificNotNullFields(TradeLicenseRequest request) {
        request.getLicenses().forEach(license -> {
            Map<String, String> errorMap = new HashMap<>();
            if (license.getFinancialYear() == null)
                errorMap.put("NULL_FINANCIALYEAR", " Financial Year cannot be null");
            if (license.getTradeLicenseDetail().getStructureType() == null)
                errorMap.put("NULL_STRUCTURETYPE", " Structure Type cannot be null");
            if (license.getTradeLicenseDetail().getSubOwnerShipCategory() == null)
                errorMap.put("NULL_SUBOWNERSHIPCATEGORY", " SubOwnership Category cannot be null");
            if ((license.getTradeLicenseDetail().getAddress().getLocality() == null)||(license.getTradeLicenseDetail().getAddress().getLocality().getCode() == null))
                errorMap.put("NULL_LOCALITY", " Locality cannot be null");

            if (!errorMap.isEmpty())
                throw new CustomException(errorMap);
        });
    }

    private void validateBPASpecificValidations(TradeLicenseRequest request) {

        request.getLicenses().forEach(license -> {
            Map<String, String> errorMap = new HashMap<>();
            if (license.getTradeLicenseDetail().getSubOwnerShipCategory().contains("INSTITUTION")) {
                if (license.getTradeLicenseDetail().getInstitution().getContactNo() == null)
                    errorMap.put("NULL_INSTITUTIONCONTACTNO", " Institution Contact No cannot be null");
                if (license.getTradeLicenseDetail().getInstitution().getName() == null)
                    errorMap.put("NULL_AUTHORISEDPERSONNAME", " Authorised person name can not be null");
                if (license.getTradeLicenseDetail().getInstitution().getInstituionName() == null)
                    errorMap.put("NULL_INSTITUTIONNAME", " Institute name can not be null");
                if (license.getTradeLicenseDetail().getInstitution().getAddress() == null)
                    errorMap.put("NULL_ADDRESS", " Institute address can not be null");
                if (license.getTradeLicenseDetail().getTradeUnits().size()>1)
                    errorMap.put("NOTALLOWED_TRADEUNITS", " More than one tradeunit not supported in BPA");
                if (!errorMap.isEmpty())
                    throw new CustomException(errorMap);
            }
        });

        request.getLicenses().forEach(license -> {
            license.getTradeLicenseDetail().getOwners().forEach(
                    owner -> {
                        if (owner.getGender() == null)
                            throw new CustomException("NULL_USERGENDER", " User gender cannot be null");

                        if (owner.getEmailId() == null)
                            throw new CustomException("NULL_USEREMAIL", " User EmailId cannot be null");

                        if (owner.getPermanentAddress() == null)
                            throw new CustomException("NULL_PERMANENTADDRESS", " User Permanent Address cannot be null");
//
//                        if (owner.getCorrespondenceAddress() == null)
//                            throw new CustomException("NULL_CORRESPONDANCEADDRESS", " User Correspondance address cannot be null");
                    }
            );
        });
    }
    /**
     *  Validates the fromDate and toDate of the request
     * @param request The input TradeLicenseRequest Object
     */
    private void valideDates(TradeLicenseRequest request ,Object mdmsData){
        request.getLicenses().forEach(license -> {
            Map<String,Long> taxPeriods = null;
            if(license.getValidTo()==null)
                throw new CustomException("INVALID VALIDTO DATE"," Validto cannot be null");
//            if(license.getApplicationType() != null && license.getApplicationType().toString().equals(TLConstants.APPLICATION_TYPE_RENEWAL)){
//                taxPeriods = tradeUtil.getTaxPeriods(license,mdmsData);
//            }else{
//                taxPeriods = tradeUtil.getTaxPeriods(license,mdmsData);
//            }
            taxPeriods = tradeUtil.getTaxPeriods(license,mdmsData);                
            if(license.getValidTo()!=null && license.getValidTo()>taxPeriods.get(TLConstants.MDMS_ENDDATE)){
                Date expiry = new Date(license.getValidTo());
                throw new CustomException("INVALID TO DATE"," Validto cannot be greater than: "+expiry);
            }            
            if(license.getLicenseType().toString().equalsIgnoreCase(TradeLicense.LicenseTypeEnum.TEMPORARY.toString())) {
                Long startOfDay = getStartOfDay();
                if (!config.getIsPreviousTLAllowed() && license.getValidFrom() != null
                        && license.getValidFrom() < startOfDay)
                    throw new CustomException("INVALID FROM DATE", "The validFrom date cannot be less than CurrentDate");
                if ((license.getValidFrom() != null && license.getValidTo() != null) && (license.getValidTo() - license.getValidFrom()) < config.getMinPeriod())
                    throw new CustomException("INVALID PERIOD", "The license should be applied for minimum of 30 days");
            }
        });
    }

    /**
     * Returns the start of the current day in millis
     * @return time in millis
     */
    private Long getStartOfDay(){
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(config.getEgovAppTimeZone()));
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND,0);
        return cal.getTimeInMillis();
    }


    /**
     *  Validates the details if subOwnersipCategory is institutional
     * @param request The input TradeLicenseRequest Object
     */
    private void validateInstitution(TradeLicenseRequest request){
        List<TradeLicense> licenses = request.getLicenses();
        licenses.forEach(license -> {
            if(license.getTradeLicenseDetail().getInstitution()!=null &&
                    !license.getTradeLicenseDetail().getSubOwnerShipCategory().contains(config.getInstitutional()))
                throw new CustomException("INVALID REQUEST","The institution object should be null for ownershipCategory "
                        +license.getTradeLicenseDetail().getSubOwnerShipCategory());

            if(license.getTradeLicenseDetail().getInstitution()==null &&
                    license.getTradeLicenseDetail().getSubOwnerShipCategory().contains(config.getInstitutional()))
                throw new CustomException("INVALID REQUEST","The institution object cannot be null for ownershipCategory "
                        +license.getTradeLicenseDetail().getSubOwnerShipCategory());

        });
    }



    /**
     *  Validates the fromDate and toDate of the request
     * @param request The input TradeLicenseRequest Object
     */
    public void validateRenewal(TradeLicenseRequest request){
            
        TradeLicenseSearchCriteria criteria = new TradeLicenseSearchCriteria();
        List<String> licenseNumbers = new LinkedList<>();
        request.getLicenses().forEach(license -> {
            if(license.getLicenseNumber() != null){
                licenseNumbers.add(license.getLicenseNumber());
            } else{
                throw new CustomException("INVALID LICENSE","Please select the existing licence for renewal");  
                
            }
        });
        
        request.getLicenses().forEach(license->{
        	if(license.getStatus().equalsIgnoreCase(TLConstants.STATUS_CANCELLED)) {
        		throw new CustomException("LICENSE CANCELLED", "Licenses which are cancelled cannot be renewed");
        	}
        }       		        		
        	);
        
        request.getLicenses().forEach(license->{
        	if(license.getStatus().equalsIgnoreCase(TLConstants.STATUS_MANUALLYEXPIRED) && license.getValidTo()>System.currentTimeMillis()) {
        		throw new CustomException("LICENSE MANUALLY EXPIRED", "Licenses which are manually expired cannot be renewed");
        	}
        }       		        		
        	);
        
        criteria.setTenantId(request.getLicenses().get(0).getTenantId());
        
        List<String> statuses = new ArrayList<String>();
        statuses.add(TLConstants.STATUS_APPROVED);
        statuses.add(TLConstants.STATUS_MANUALLYEXPIRED);
        statuses.add(TLConstants.STATUS_EXPIRED);

        criteria.setStatus(statuses);
        criteria.setBusinessService(request.getLicenses().get(0).getBusinessService());
        criteria.setLicenseNumbers(licenseNumbers);
        List<TradeLicense> searchResult = tlRepository.getLicenses(criteria);

        Map<String , TradeLicense> licenseMap = new HashMap<>();
        searchResult.forEach(license -> {
            licenseMap.put(license.getLicenseNumber() , license);
        });
        
        request.getLicenses().forEach(license -> {
            if(license.getApplicationType() != null && license.getApplicationType().toString().equals(TLConstants.APPLICATION_TYPE_RENEWAL)){

                if(license.getStatus().equalsIgnoreCase(TLConstants.STATUS_APPROVED)
                        && licenseMap.containsKey(license.getLicenseNumber())
                        && licenseMap.get(license.getLicenseNumber()).getId().equalsIgnoreCase(license.getId())){
                    return;
                }
                else if(licenseMap.containsKey(license.getLicenseNumber())){
                    TradeLicense searchObj = licenseMap.get(license.getLicenseNumber());
                    Long currentFromDate = license.getValidFrom();
                    Long currentToDate = license.getValidTo();
                    Long existingFromDate = searchObj.getValidFrom();
                    Long existingToDate = searchObj.getValidTo();
                    if(currentFromDate < existingToDate){
                        throw new CustomException("INVALID FROM DATE","ValidFrom should be greater than the previous applications ValidTo Date");
                    }
                    if(currentFromDate  <= existingFromDate){
                        throw new CustomException("INVALID FROM DATE","ValidFrom should be greater than the applications ValidFrom Date");
                    }
                    if(currentToDate <= existingToDate) {
                        throw new CustomException("INVALID TO DATE", "ValidTo should be greater than the applications ValidTo Date");
                    }
                    if(currentFromDate > currentToDate){
                        throw new CustomException("INVALID FROM DATE","ValidFrom cannot be greater than ValidTo Date");
                    }          
                   
                }else{
                    throw new CustomException("RENEWAL ERROR","The license applied for renewal is not present in the repository");
                }
            }
        });
    }


	/**
     *  Validates the update request
     * @param request The input TradeLicenseRequest Object
     */
    public void validateUpdate(TradeLicenseRequest request, List<TradeLicense> searchResult, Object mdmsData, Object billingSlabs) {
        List<TradeLicense> licenses = request.getLicenses();
        if (searchResult.size() != licenses.size())
            throw new CustomException("INVALID UPDATE", "The license to be updated is not in database");
        validateAllIds(searchResult, licenses);
        String businessService = request.getLicenses().isEmpty()?null:licenses.get(0).getBusinessService();
        if(licenses.get(0).getApplicationType() != null && licenses.get(0).getApplicationType().toString().equals(TLConstants.APPLICATION_TYPE_RENEWAL)){
            validateRenewal(request);
        }        
        if (businessService == null)
            businessService = businessService_TL;
        switch (businessService) {
            case businessService_TL:
                valideDates(request, mdmsData);
                propertyValidator.validateProperty(request);
                validateTLSpecificNotNullFields(request);
                break;

            case businessService_BPA:
                validateBPASpecificValidations(request);
                break;
        }
        mdmsValidator.validateMdmsData(request, mdmsData, billingSlabs);
        validateTradeUnits(request);
        validateDuplicateDocuments(request);
        setFieldsFromSearch(request, searchResult, mdmsData);
        validateOwnerActiveStatus(request);
    }


    /**
     * Validates that atleast one tradeUnit is active equal true or new tradeUnit
     * @param request The input TradeLicenseRequest Object
     */
    private void validateTradeUnits(TradeLicenseRequest request){
        Map<String,String> errorMap = new HashMap<>();
        List<TradeLicense> licenses = request.getLicenses();

        for(TradeLicense license : licenses)
        {
            Boolean flag = false;
            List<TradeUnit> units = license.getTradeLicenseDetail().getTradeUnits();
            for(TradeUnit unit : units) {
                if(unit.getId()!=null && unit.getActive())
                    flag = true;
                else if(unit.getId()==null)
                    flag = true;
            }
            if(!flag)
                errorMap.put("INVALID UPDATE","All TradeUnits are inactive in the tradeLicense: "+license.getApplicationNumber());
        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }





    /**
     * Returns the list of ids of all owners as list for the given tradelicense
     * @param license TradeLicense whose ownerIds are to be extracted
     * @return list od OwnerIds
     */
    private List<String> getOwnerIds(TradeLicense license){
        List<String> ownerIds = new LinkedList<>();
        if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getOwners())){
            license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                if(owner.getUserActive()!=null)
                    ownerIds.add(owner.getUuid());
            });
        }
        return ownerIds;
    }

    /**
     * Returns the list of ids of all tradeUnits as list for the given tradelicense
     * @param license TradeLicense whose tradeUnitIds are to be extracted
     * @return list od tradeUnitIdss
     */
    private List<String> getTradeUnitIds(TradeLicense license){
        List<String> tradeUnitIds = new LinkedList<>();
        if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getTradeUnits())){
            license.getTradeLicenseDetail().getTradeUnits().forEach(tradeUnit -> {
                tradeUnitIds.add(tradeUnit.getId());
            });
        }
        return tradeUnitIds;
    }

    /**
     * Returns the list of ids of all accessories as list for the given tradelicense
     * @param license TradeLicense whose accessoryIds are to be extracted
     * @return list od accessoryIds
     */
    private List<String> getAccessoryIds(TradeLicense license){
        List<String> accessoryIds = new LinkedList<>();
        if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getAccessories())){
            license.getTradeLicenseDetail().getAccessories().forEach(accessory -> {
                accessoryIds.add(accessory.getId());
            });
        }
        return accessoryIds;
    }

    /**
     * Returns the list of ids of all ownerDocs as list for the given tradelicense
     * @param license TradeLicense whose ownerDocIds are to be extracted
     * @return list od ownerDocIds
     */
    private List<String> getOwnerDocIds(TradeLicense license){
        List<String> ownerDocIds = new LinkedList<>();
        if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getOwners())){
            license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                if(!CollectionUtils.isEmpty(owner.getDocuments())){
                    owner.getDocuments().forEach(document -> {
                        ownerDocIds.add(document.getId());
                    });
                }
            });
        }
        return ownerDocIds;
    }

    /**
     * Returns the list of ids of all applicationDoc as list for the given tradelicense
     * @param license TradeLicense whose applicationDocIds are to be extracted
     * @return list od applicationDocIds
     */
    private List<String> getApplicationDocIds(TradeLicense license){
        List<String> applicationDocIds = new LinkedList<>();
        if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getApplicationDocuments())){
            license.getTradeLicenseDetail().getApplicationDocuments().forEach(document -> {
                applicationDocIds.add(document.getId());
            });
        }
        return applicationDocIds;
    }

    /**
     * Returns the list of ids of all verficationDoc as list for the given tradelicense
     * @param license TradeLicense whose VerficationDocIds are to be extracted
     * @return list od VerficationDocIds
     */
    private List<String> getVerficationDocIds(TradeLicense license){
        List<String> verficationDocIds = new LinkedList<>();
        if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getVerificationDocuments())) {
            license.getTradeLicenseDetail().getVerificationDocuments().forEach(document -> {
                verficationDocIds.add(document.getId());
            });
        }
        return verficationDocIds;
    }


    /**
     * Enriches the immutable fields from database
     * @param request The input TradeLicenseRequest
     * @param searchResult The list of searched licenses
     */
    private void setFieldsFromSearch(TradeLicenseRequest request, List<TradeLicense> searchResult, Object mdmsData) {
        Map<String,TradeLicense> idToTradeLicenseFromSearch = new HashMap<>();
        searchResult.forEach(tradeLicense -> {
            idToTradeLicenseFromSearch.put(tradeLicense.getId(),tradeLicense);
        });
        request.getLicenses().forEach(license -> {
            license.getAuditDetails().setCreatedBy(idToTradeLicenseFromSearch.get(license.getId()).getAuditDetails().getCreatedBy());
            license.getAuditDetails().setCreatedTime(idToTradeLicenseFromSearch.get(license.getId()).getAuditDetails().getCreatedTime());
            license.setStatus(idToTradeLicenseFromSearch.get(license.getId()).getStatus());
            license.setLicenseNumber(idToTradeLicenseFromSearch.get(license.getId()).getLicenseNumber());
            String businessService = license.getBusinessService();
            if (businessService == null)
                businessService = businessService_TL;
            switch (businessService) {
                case businessService_TL:
                    if (!idToTradeLicenseFromSearch.get(license.getId()).getFinancialYear().equalsIgnoreCase(license.getFinancialYear())
                            && license.getLicenseType().equals(TradeLicense.LicenseTypeEnum.PERMANENT)) {
                        Map<String, Long> taxPeriods = tradeUtil.getTaxPeriods(license, mdmsData);
                        license.setValidTo(taxPeriods.get(TLConstants.MDMS_ENDDATE));
                    }
                    break;
            }
        });
    }

    /**
     * Validates if all ids are same as obtained from search result
     * @param searchResult The license from search
     * @param licenses The licenses from the update Request
     */
    private void validateAllIds(List<TradeLicense> searchResult,List<TradeLicense> licenses){

        Map<String,TradeLicense> idToTradeLicenseFromSearch = new HashMap<>();
        searchResult.forEach(tradeLicense -> {
            idToTradeLicenseFromSearch.put(tradeLicense.getId(),tradeLicense);
        });

        Map<String,String> errorMap = new HashMap<>();
        licenses.forEach(license -> {
            TradeLicense searchedLicense = idToTradeLicenseFromSearch.get(license.getId());

            if(!searchedLicense.getApplicationNumber().equalsIgnoreCase(license.getApplicationNumber()))
                errorMap.put("INVALID UPDATE","The application number from search: "+searchedLicense.getApplicationNumber()
                        +" and from update: "+license.getApplicationNumber()+" does not match");

            if(!searchedLicense.getTradeLicenseDetail().getId().
                    equalsIgnoreCase(license.getTradeLicenseDetail().getId()))
                errorMap.put("INVALID UPDATE","The id "+license.getTradeLicenseDetail().getId()+" does not exist");

            if(!searchedLicense.getTradeLicenseDetail().getAddress().getId().
                    equalsIgnoreCase(license.getTradeLicenseDetail().getAddress().getId()))
                errorMap.put("INVALID UPDATE","The id "+license.getTradeLicenseDetail().getAddress().getId()+" does not exist");

            compareIdList(getTradeUnitIds(searchedLicense),getTradeUnitIds(license),errorMap);
            compareIdList(getAccessoryIds(searchedLicense),getAccessoryIds(license),errorMap);
            compareIdList(getOwnerIds(searchedLicense),getOwnerIds(license),errorMap);
            compareIdList(getOwnerDocIds(searchedLicense),getOwnerDocIds(license),errorMap);
            compareIdList(getApplicationDocIds(searchedLicense),getApplicationDocIds(license),errorMap);
            compareIdList(getVerficationDocIds(searchedLicense),getVerficationDocIds(license),errorMap);
        });

        if(!CollectionUtils.isEmpty(errorMap))
            throw new CustomException(errorMap);
    }


    /**
     * Checks if the ids are present in the searchedIds
     * @param searchIds Ids got from search
     * @param updateIds The ids received from update Request
     * @param errorMap The map for collecting errors
     */
    private void compareIdList(List<String> searchIds,List<String> updateIds,Map<String,String> errorMap){
        if(!CollectionUtils.isEmpty(searchIds))
            searchIds.forEach(searchId -> {
                if(!updateIds.contains(searchId))
                    errorMap.put("INVALID UPDATE","The id: "+searchId+" was not present in update request");
            });
    }


    /**
     * Validates if the search parameters are valid
     * @param requestInfo The requestInfo of the incoming request
     * @param criteria The TradeLicenseSearch Criteria
     */
    public void validateSearch(RequestInfo requestInfo, TradeLicenseSearchCriteria criteria, String serviceFromPath, boolean isInterServiceCall) {
        String serviceInSearchCriteria = criteria.getBusinessService();
        if ((serviceInSearchCriteria != null) && (!StringUtils.equals(serviceFromPath, serviceInSearchCriteria))) {
            throw new CustomException("INVALID SEARCH", "Business service in Path param and requestbody not matching");
        }

        List<String> allowedservices = Arrays.asList(allowedBusinessService.split(","));
        if ((serviceFromPath != null) && (!allowedservices.contains(serviceFromPath))) {
            throw new CustomException("INVALID SEARCH", "Search not allowed on this business service");
        }

        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN" )&& criteria.isEmpty())
            throw new CustomException("INVALID SEARCH","Search without any paramters is not allowed");

        if(requestInfo.getUserInfo().getType().equalsIgnoreCase("EMPLOYEE" )&& criteria.tenantIdOnly())
            throw new CustomException("INVALID SEARCH","Search based only on tenantId is not allowed");

        /*if(requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN" )&& criteria.tenantIdOnly())
            throw new CustomException("INVALID SEARCH","Search only on tenantId is not allowed");*/

        String allowedParamStr = null;

        if(requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN" ))
            allowedParamStr = config.getAllowedCitizenSearchParameters();
        else if(requestInfo.getUserInfo().getType().equalsIgnoreCase("EMPLOYEE" ))
            allowedParamStr = config.getAllowedEmployeeSearchParameters();
        else if(requestInfo.getUserInfo().getType().equalsIgnoreCase("SYSTEM" ))
            allowedParamStr = config.getAllowedSystemSearchParameters();
        else throw new CustomException("INVALID SEARCH","The userType: "+requestInfo.getUserInfo().getType()+
                    " does not have any search config");

        if(StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
            throw new CustomException("INVALID SEARCH","No search parameters are expected");
        else {
            List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
            validateSearchParams(criteria, allowedParams, isInterServiceCall, requestInfo);
        }
    }


    /**
     * Validates if the paramters coming in search are allowed
     * @param criteria TradeLicense search criteria
     * @param allowedParams Allowed Params for search
     */
    private void validateSearchParams(TradeLicenseSearchCriteria criteria, List<String> allowedParams, boolean isInterServiceCall
            , RequestInfo requestInfo) {

        if(criteria.getApplicationNumber()!=null && !allowedParams.contains("applicationNumber"))
            throw new CustomException("INVALID SEARCH","Search on applicationNumber is not allowed");

        if(criteria.getTenantId()!=null && !allowedParams.contains("tenantId"))
            throw new CustomException("INVALID SEARCH","Search on tenantId is not allowed");

        if(criteria.getToDate()!=null && !allowedParams.contains("toDate"))
            throw new CustomException("INVALID SEARCH","Search on toDate is not allowed");

        if(criteria.getFromDate()!=null && !allowedParams.contains("fromDate"))
            throw new CustomException("INVALID SEARCH","Search on fromDate is not allowed");

        if(criteria.getStatus()!=null && !allowedParams.contains("status"))
            throw new CustomException("INVALID SEARCH","Search on Status is not allowed");

        if(criteria.getIds()!=null && !allowedParams.contains("ids"))
            throw new CustomException("INVALID SEARCH","Search on ids is not allowed");

        if(criteria.getMobileNumber()!=null && !allowedParams.contains("mobileNumber"))
        {
            if(!isInterServiceCall || !requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN" ))
                throw new CustomException("INVALID SEARCH","Search on mobileNumber is not allowed");
        }

        if(criteria.getLicenseNumbers()!=null && !allowedParams.contains("licenseNumbers"))
            throw new CustomException("INVALID SEARCH","Search on licenseNumber is not allowed");

        if(criteria.getOldLicenseNumber()!=null && !allowedParams.contains("oldLicenseNumber"))
            throw new CustomException("INVALID SEARCH","Search on oldLicenseNumber is not allowed");

        if(criteria.getOffset()!=null && !allowedParams.contains("offset"))
            throw new CustomException("INVALID SEARCH","Search on offset is not allowed");

        if(criteria.getLimit()!=null && !allowedParams.contains("limit"))
            throw new CustomException("INVALID SEARCH","Search on limit is not allowed");

    }


    /**
     * Validates application documents for duplicates
     * @param request The tradeLcienseRequest
     */
    private void validateDuplicateDocuments(TradeLicenseRequest request){
        List<String> documentFileStoreIds = new LinkedList();
        request.getLicenses().forEach(license -> {
            if(license.getTradeLicenseDetail().getApplicationDocuments()!=null){
                license.getTradeLicenseDetail().getApplicationDocuments().forEach(
                        document -> {
                                if(documentFileStoreIds.contains(document.getFileStoreId()))
                                    throw new CustomException("DUPLICATE_DOCUMENT ERROR","Same document cannot be used multiple times");
                                else documentFileStoreIds.add(document.getFileStoreId());
                        }
                );
            }
        });
    }


    /**
     * Checks if atleast one owner is active in TL
     * @param request The update request
     */
    private void validateOwnerActiveStatus(TradeLicenseRequest request){
        Map<String,String> errorMap = new HashMap<>();
        request.getLicenses().forEach(license -> {
            Boolean flag = false;
            for(OwnerInfo ownerInfo : license.getTradeLicenseDetail().getOwners()){
                if(ownerInfo.getUserActive()){
                    flag=true;
                    break;
                }
            }
            if(!flag)
                errorMap.put("INVALID OWNER","All owners are inactive for application:  "+license.getApplicationNumber());
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }






}


