package org.egov.commons.mdms.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.InvalidPathException;
import com.jayway.jsonpath.JsonPath;

@Service
public class MDMSValidator {

    private static final Logger LOG = LogManager.getLogger(MDMSValidator.class);

    public List<ErrorDetail> validateMdmsData(Map<String, List<Object>> masterData, Map<String, String> data) {

        List<ErrorDetail> errors = new ArrayList<>();

        String[] masterArray = { "ApplicationType", "ServiceType", "OccupancyType", "SubOccupancyType", "Usages",
                /* "SubFeatureColorCode" */ };
        validateIfMasterPresent(masterArray, masterData, errors);

        if (!masterData.get("ApplicationType").contains(data.get("applicationType")))
            errors.add(new ErrorDetail("INVALID APPLICATIONTYPE", "The application type '" + data.get("applicationType") +
                    "' does not exists"));
        if (!masterData.get("ServiceType").contains(data.get("serviceType")))
            errors.add(new ErrorDetail("INVALID SERVICETYPE", "The service type '" + data.get("serviceType") +
                    "' does not exists"));
        return errors;
    }

    public Map<String, List<Object>> getAttributeValues(Object mdmsData, String moduleName) {

        List<String> modulepaths = Arrays.asList("$.MdmsRes." + moduleName);
        final Map<String, List<Object>> mdmsResMap = new HashMap<>();
        modulepaths.forEach(modulepath -> {
            try {
                mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
            } catch (InvalidPathException e) {
                LOG.error("Error while fetching MDMS data", e);
            }
        });
        return mdmsResMap;
    }

    /**
     * Validates if MasterData is properly fetched for the given MasterData names
     * 
     * @param masterNames
     * @param codes
     */

    private List<ErrorDetail> validateIfMasterPresent(String[] masterNames, Map<String, List<Object>> codes,
            List<ErrorDetail> errors) {
        for (String masterName : masterNames) {
            if (CollectionUtils.isEmpty(codes.get(masterName))) {
                errors.add(new ErrorDetail("MDMS DATA ERROR ", "Unable to fetch " + masterName + " codes from MDMS"));
            }
        }
        return errors;
    }

}
