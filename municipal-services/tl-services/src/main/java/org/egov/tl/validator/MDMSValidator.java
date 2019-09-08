package org.egov.tl.validator;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.util.TLConstants;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;


@Component
@Slf4j
public class MDMSValidator {


    private ServiceRequestRepository requestRepository;

    private TradeUtil util;

    private ServiceRequestRepository serviceRequestRepository;


    @Autowired
    public MDMSValidator(ServiceRequestRepository requestRepository, TradeUtil util,
                         ServiceRequestRepository serviceRequestRepository) {
        this.requestRepository = requestRepository;
        this.util = util;
        this.serviceRequestRepository = serviceRequestRepository;
    }





    /**
     * method to validate the mdms data in the request
     *
     * @param licenseRequest
     */
    public void validateMdmsData(TradeLicenseRequest licenseRequest,Object mdmsData) {

        Map<String, String> errorMap = new HashMap<>();

        Map<String, List<String>> masterData = getAttributeValues(mdmsData);
        
        String[] masterArray = { TLConstants.ACCESSORIES_CATEGORY, TLConstants.TRADE_TYPE,
                                 TLConstants.OWNERSHIP_CATEGORY, TLConstants.STRUCTURE_TYPE};

        validateIfMasterPresent(masterArray, masterData);

        Map<String,String> tradeTypeUomMap = getTradeTypeUomMap(mdmsData);
        Map<String,String> accessoryeUomMap = getAccessoryUomMap(mdmsData);

        licenseRequest.getLicenses().forEach(license -> {

            if(!masterData.get(TLConstants.OWNERSHIP_CATEGORY)
                    .contains(license.getTradeLicenseDetail().getSubOwnerShipCategory()))
                errorMap.put("INVALID OWNERSHIPCATEGORY", "The SubOwnerShipCategory '"
                        + license.getTradeLicenseDetail().getSubOwnerShipCategory() + "' does not exists");

            if(!masterData.get(TLConstants.STRUCTURE_TYPE).
                    contains(license.getTradeLicenseDetail().getStructureType()))
                errorMap.put("INVALID STRUCTURETYPE", "The structureType '"
                        + license.getTradeLicenseDetail().getStructureType() + "' does not exists");

               license.getTradeLicenseDetail().getTradeUnits().forEach(unit -> {
                   if (!tradeTypeUomMap.containsKey(unit.getTradeType()))
                    errorMap.put("INVALID TRADETYPE", "The Trade type '" + unit.getTradeType() + "' does not exists");

                    if(unit.getUom()!=null){
                       if(!unit.getUom().equalsIgnoreCase(tradeTypeUomMap.get(unit.getTradeType())))
                           errorMap.put("INVALID UOM","The UOM: "+unit.getUom()+" is not valid for tradeType: "+unit.getTradeType());
                       else if(unit.getUom().equalsIgnoreCase(tradeTypeUomMap.get(unit.getTradeType()))
                               && unit.getUomValue()==null)
                           throw new CustomException("INVALID UOMVALUE","The uomValue cannot be null");
                   }

                   else if(unit.getUom()==null){
                       if(tradeTypeUomMap.get(unit.getTradeType())!=null)
                           errorMap.put("INVALID UOM","The UOM cannot be null for tradeType: "+unit.getTradeType());
                   }
                });

               if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getAccessories())){
                    license.getTradeLicenseDetail().getAccessories().forEach(accessory -> {
                        if (!accessoryeUomMap.containsKey(accessory.getAccessoryCategory()))
                            errorMap.put("INVALID ACCESORRYCATEGORY",
                                    "The Accessory Category '" + accessory.getAccessoryCategory() + "' does not exists");

                         if(accessory.getUom()!=null){
                            if(!accessory.getUom().equalsIgnoreCase(accessoryeUomMap.get(accessory.getAccessoryCategory())))
                                errorMap.put("INVALID UOM","The UOM: "+accessory.getUom()+" is not valid for accessoryCategory: "
                                        +accessory.getAccessoryCategory());
                            else if(accessory.getUom().equalsIgnoreCase(accessoryeUomMap.get(accessory.getAccessoryCategory()))
                                    && accessory.getUomValue()==null)
                                throw new CustomException("INVALID UOMVALUE","The uomValue cannot be null");
                        }

                        else if(accessory.getUom()==null){
                            if(accessoryeUomMap.get(accessory.getAccessoryCategory())!=null)
                                errorMap.put("INVALID UOM","The UOM cannot be null for tradeType: "+accessory.getAccessoryCategory());
                        }
                    });
               }

        });

        if (!CollectionUtils.isEmpty(errorMap))
            throw new CustomException(errorMap);
    }



    /**
     * Validates if MasterData is properly fetched for the given MasterData names
     * @param masterNames
     * @param codes
     */
    private void validateIfMasterPresent(String[] masterNames,Map<String,List<String>> codes){
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
     * Fetches all the values of particular attribute as map of field name to list
     *
     * takes all the masters from each module and adds them in to a single map
     *
     * note : if two masters from different modules have the same name then it
     *
     *  will lead to overriding of the earlier one by the latest one added to the map
     *
     * @return Map of MasterData name to the list of code in the MasterData
     *
     */
    private Map<String, List<String>> getAttributeValues(Object mdmsData) {

        List<String> modulepaths = Arrays.asList(TLConstants.TL_JSONPATH_CODE,
                TLConstants.COMMON_MASTER_JSONPATH_CODE);

        final Map<String, List<String>> mdmsResMap = new HashMap<>();
        modulepaths.forEach( modulepath -> {
            try {
                mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
            } catch (Exception e) {
                log.error("Error while fetvhing MDMS data", e);
                throw new CustomException(TLConstants.INVALID_TENANT_ID_MDMS_KEY, TLConstants.INVALID_TENANT_ID_MDMS_MSG);
            }
        });

        System.err.println(" the mdms response is : " + mdmsResMap);
        return mdmsResMap;
    }


    /**
     * Fetches map of UOM to UOMValues
     * @param mdmsData The MDMS data
     * @return
     */
    private Map<String, List<String>> getUomMap(Object mdmsData) {

        List<String> modulepaths = Arrays.asList(TLConstants.TL_JSONPATH_CODE);
        final Map<String, List<String>> mdmsResMap = new HashMap<>();

        modulepaths.forEach( modulepath -> {
            try {
                mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
            } catch (Exception e) {
                log.error("Error while fetvhing MDMS data", e);
                throw new CustomException(TLConstants.INVALID_TENANT_ID_MDMS_KEY, TLConstants.INVALID_TENANT_ID_MDMS_MSG);
            }
        });

        System.err.println(" the mdms response is : " + mdmsResMap);
        return mdmsResMap;
    }


    private Map getTradeTypeUomMap(Object mdmsData){

        List<String> tradeTypes = JsonPath.read(mdmsData,TLConstants.TRADETYPE_JSONPATH_CODE);
        List<String> tradeTypeUOM = JsonPath.read(mdmsData,TLConstants.TRADETYPE_JSONPATH_UOM);

        Map<String,String> tradeTypeToUOM = new HashMap<>();

        for (int i = 0;i < tradeTypes.size();i++){
            tradeTypeToUOM.put(tradeTypes.get(i),tradeTypeUOM.get(i));
        }

        return tradeTypeToUOM;
    }


    private Map getAccessoryUomMap(Object mdmsData){

        List<String> accessories = JsonPath.read(mdmsData,TLConstants.ACCESSORY_JSONPATH_CODE);
        List<String> accessoryUOM = JsonPath.read(mdmsData,TLConstants.ACCESSORY_JSONPATH_UOM);

        Map<String,String> accessoryToUOM = new HashMap<>();

        for (int i = 0;i < accessories.size();i++){
            accessoryToUOM.put(accessories.get(i),accessoryUOM.get(i));
        }

        return accessoryToUOM;
    }

















}
