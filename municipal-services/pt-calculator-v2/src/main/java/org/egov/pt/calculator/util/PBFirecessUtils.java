package org.egov.pt.calculator.util;

import org.egov.pt.calculator.service.MasterDataService;
import org.egov.pt.calculator.web.models.property.PropertyDetail;
import org.egov.pt.calculator.web.models.property.Unit;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
public class PBFirecessUtils {

    @Autowired
    private MasterDataService mDataService;


    public BigDecimal calculateFireCess(PropertyDetail propertyDetails, Map<String, Object> applicableMaster ){
        String propertyUsageCategoryMajor = propertyDetails.getUsageCategoryMajor();
        List<Unit> units = propertyDetails.getUnits();
        Map propertyAttributes = (LinkedHashMap) propertyDetails.getAdditionalDetails();
        Set<String> unitSet = new HashSet<>();

        for (Unit unit : units) {
            unitSet.add(unit.getUsageCategoryMajor());
        }
        BigDecimal firecess_category_major = BigDecimal.ZERO;
        BigDecimal firecess_building_height = BigDecimal.ZERO;
        BigDecimal firecess_inflammable = BigDecimal.ZERO;

        if (propertyUsageCategoryMajor.equalsIgnoreCase("RESIDENTIAL")  || (unitSet.size() == 1 && unitSet.contains("RESIDENTIAL"))) {
            // There is no category major firecess applicable as it i
            firecess_category_major = BigDecimal.ZERO;
        } else {
            firecess_category_major =new BigDecimal ((Integer) ((HashMap)applicableMaster.get("dynamicRates")).get("firecess_category_major"));
        }

        if (propertyAttributes!=null &&
                propertyAttributes.get("heightAbove36Feet")!=null &&
                (Boolean) propertyAttributes.get("heightAbove36Feet")) {
            // height is above 36 feet
            firecess_building_height = new BigDecimal ((Integer) ((HashMap)applicableMaster.get("dynamicRates")).get("firecess_building_height"));
        }

        if (propertyAttributes!=null &&
                propertyAttributes.get("inflammable")!=null &&
                (Boolean)propertyAttributes.get("inflammable")) {
            // height is above 36 feet
            firecess_inflammable = new BigDecimal ((Integer) ((HashMap)applicableMaster.get("dynamicRates")).get("firecess_inflammable"));
        }

        return firecess_category_major.add(firecess_building_height).add(firecess_inflammable);
    }

    /**
     * Estimates the fire cess that needs to be paid for the given tax amount
     *
     * Returns Zero if no data is found for the given criteria
     *
     * @param payableTax
     * @param assessmentYear
     * @return
     */
    public BigDecimal getPBFireCess(BigDecimal payableTax, String assessmentYear,List<Object> masterList, PropertyDetail propertyDetail) {
        BigDecimal fireCess = BigDecimal.ZERO;

        if (payableTax.doubleValue() == 0.0)
            return fireCess;

        Map<String, Object> CessMap = mDataService.getApplicableMaster(assessmentYear,masterList);

        BigDecimal firecessRate;

        if (CessMap == null)
            throw new CustomException("MASTER_DATA_NOT_FOUND", "There is no master data for financial year - " + assessmentYear);

        if ((Boolean)CessMap.get("dynamicFirecess"))
        {
            firecessRate = calculateFireCess(propertyDetail, CessMap);
        } else {
            firecessRate = new BigDecimal ((Integer) CessMap.get("rate"));
        }

        return  firecessRate.multiply(payableTax).divide(new BigDecimal(100));
    }

}
