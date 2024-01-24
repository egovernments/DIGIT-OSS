package org.egov.edcr.service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.PlanFeature;
import org.egov.common.entity.edcr.PlanInformation;
import org.egov.commons.mdms.EDCRMdmsUtil;
import org.egov.commons.mdms.config.MdmsConfiguration;
import org.egov.commons.mdms.model.MdmsEdcrResponse;
import org.egov.commons.mdms.validator.MDMSValidator;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.Amendment;
import org.egov.edcr.entity.AmendmentDetails;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.feature.FeatureExtract;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.custom.CustomImplProvider;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.json.simple.JSONObject;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.parser.DXFParser;
import org.kabeja.parser.ParseException;
import org.kabeja.parser.Parser;
import org.kabeja.parser.ParserBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ExtractService {
    @Autowired
    private CustomImplProvider specificRuleService;
    @Autowired
    private AppConfigValueService appConfigValueService;
    @Autowired
    private EDCRMdmsUtil edcrMdmsUtil;
    @Autowired
    private MdmsConfiguration mdmsConfiguration;
    @Autowired
    private CityService cityService;
    @Autowired
    private MDMSValidator mdmsValidator;

    private Logger LOG = LogManager.getLogger(ExtractService.class);

    public Plan extract(File dxfFile, Amendment amd, Date scrutinyDate, List<PlanFeature> features) {

        PlanInformation pi = new PlanInformation();
        DXFDocument doc = getDxfDocument(dxfFile);
        PlanDetail planDetail = new PlanDetail();
        planDetail.setDoc(doc);
        planDetail.setPlanInformation(pi);
        planDetail.setApplicationDate(scrutinyDate);
        Map<String, String> cityDetails = specificRuleService.getCityDetails();

        if (doc.getDXFHeader().getVariable("$INSUNITS") != null) {
            String unitValue = doc.getDXFHeader().getVariable("$INSUNITS").getValue("70");
            if ("1".equalsIgnoreCase(unitValue)) {
                planDetail.getDrawingPreference().setUom(DxfFileConstants.INCH_UOM);
            } else if ("2".equalsIgnoreCase(unitValue)) {
                planDetail.getDrawingPreference().setUom(DxfFileConstants.FEET_UOM);
            } else if ("6".equalsIgnoreCase(unitValue)) {
                planDetail.getDrawingPreference().setUom(DxfFileConstants.METER_UOM);
            } else {
                planDetail.getDrawingPreference().setInMeters(false);
                planDetail.getErrors().put("units not in meters", "The 'Drawing Unit' is not as per standard. ");
            }
        }

        /*
         * // dimension length factor should be 1 if (doc.getDXFHeader() != null && doc.getDXFHeader().getVariable("$DIMLFAC") !=
         * null) { BigDecimal dimensionLengthFactor = new BigDecimal( doc.getDXFHeader().getVariable("$DIMLFAC").getValue("40"));
         * if (dimensionLengthFactor.compareTo(BigDecimal.ONE) != 0) { planDetail.getDrawingPreference().setLengthFactor(false);
         * planDetail.getErrors().put("length factor", "The dimension length factor is not 1."); } }
         */
        if (planDetail.getErrors().size() > 0)
            return (Plan) planDetail;
        Boolean mdmsEnabled = mdmsConfiguration.getMdmsEnabled();
        if (mdmsEnabled != null && mdmsEnabled) {
            City stateCity = cityService.fetchStateCityDetails();
            String tenantID = ApplicationThreadLocals.getTenantID();
            Object mdmsData = edcrMdmsUtil.mDMSCall(new RequestInfo(),
                    new StringBuilder().append(stateCity.getCode()).append(".").append(tenantID).toString());

            if (mdmsData == null) {
                tenantID = stateCity.getCode();
                mdmsData = edcrMdmsUtil.mDMSCall(new RequestInfo(), tenantID);
            }
            if (mdmsData != null) {
                Map<String, List<Object>> edcrMdmsConfig = mdmsValidator.getAttributeValues(mdmsData,
                        DcrConstants.MDMS_EDCR_MODULE);
                List<Object> dimensionConfig = edcrMdmsConfig.get("DimensionConfig");
                LinkedHashMap<String, String> configs = new LinkedHashMap<>();
                for (Object obj : dimensionConfig) {
                    try {
                        String jsonString = new JSONObject((LinkedHashMap<?, ?>) obj).toString();
                        ObjectMapper mapper = new ObjectMapper();
                        MdmsEdcrResponse res = mapper.readValue(jsonString, MdmsEdcrResponse.class);
                        configs.put(res.getCode(), res.getEnabled());
                    } catch (IOException e) {
                        LOG.error("Error occured while reading mdms data", e);
                    }

                }
                if (!configs.isEmpty()) {
                    planDetail.setStrictlyValidateDimension(
                            Boolean.valueOf(configs.get(DcrConstants.MDMS_STRICTLY_VALIDATE_DIMENSION)));
                    planDetail.setStrictlyValidateBldgHeightDimension(
                            Boolean.valueOf(configs.get(DcrConstants.MDMS_STRICTLY_VALIDATE_BLDG_HGHT_DIMENSION)));
                }

            }
        } else {
            List<AppConfigValues> appConfigValueList = appConfigValueService.getConfigValuesByModuleAndKey(
                    DcrConstants.APPLICATION_MODULE_TYPE, DcrConstants.STRICTLY_VALIDATE_DIMENSION);

            if (appConfigValueList != null && !appConfigValueList.isEmpty()) {
                String value = appConfigValueList.get(0).getValue();
                planDetail.setStrictlyValidateDimension(DcrConstants.YES.equalsIgnoreCase(value));
            }
            List<AppConfigValues> bldgHghtDimensionValidation = appConfigValueService.getConfigValuesByModuleAndKey(
                    DcrConstants.APPLICATION_MODULE_TYPE, DcrConstants.STRICTLY_VALIDATE_BLDG_HGHT_DIMENSION);
            if (bldgHghtDimensionValidation != null && !bldgHghtDimensionValidation.isEmpty()) {
                String value = bldgHghtDimensionValidation.get(0).getValue();
                planDetail.setStrictlyValidateBldgHeightDimension(DcrConstants.YES.equalsIgnoreCase(value));
            }
        }

        int index = -1;
        AmendmentDetails[] a = null;
        int length = amd.getDetails().size();
        if (!amd.getDetails().isEmpty()) {
            index = amd.getIndex(planDetail.getApplicationDate());
            a = new AmendmentDetails[amd.getDetails().size()];
            amd.getDetails().toArray(a);
        }

        Date start = new Date();
        LOG.info("Initializeing fetch extract api" + start);
        for (PlanFeature ruleClass : features) {
            FeatureExtract rule = null;

            try {

                if (ruleClass.getRuleClass() != null) {
                    String str = ruleClass.getRuleClass().getSimpleName();
                    str = str.substring(0, 1).toLowerCase() + str.substring(1);
                    LOG.info("Looking for bean " + str);

                    if (amd.getDetails().isEmpty() || index == -1)
                        rule = (FeatureExtract) specificRuleService.find(str + "Extract");
                    else {

                        if (index >= 0) {
                            for (int i = index; i < length; i++) {
                                if (a[i].getChanges().keySet().contains(ruleClass.getClass().getSimpleName())) {
                                    String strNew = str + "Extract_" + a[i].getDateOfBylawString();

                                    rule = (FeatureExtract) specificRuleService.find(strNew);
                                    if (rule != null)
                                        break;
                                }

                            }

                        }

                        if (rule == null) {
                            rule = (FeatureExtract) specificRuleService.find(str + "Extract");
                        }
                        // for all amendments

                    }

                }
            } catch (Exception e) {
                LOG.error("Exception while finding extract api for  " + ruleClass.getRuleClass(), e);
            }

            if (rule != null) {
                LOG.info("Got bean ..." + rule.getClass().getSimpleName());
                try {
                    rule.extract(planDetail);
                } catch (Exception e) {
                    planDetail.addError("msg.error.failed.on.extraction",
                            "Please contact the adminstrator for the further information. The plan is failing while extracting data from plan in the feature "
                                    + rule);
                }
            } else
                LOG.error("Extract Api is not defined for " + ruleClass.getRuleClass());

        }
        Date end = new Date();
        LOG.info("Ending fetch extract api" + end);
        return (Plan) planDetail;

    }

    private DXFDocument getDxfDocument(File file) {
        Parser parser = ParserBuilder.createDefaultParser();
        try {
            parser.parse(file.getPath(), DXFParser.DEFAULT_ENCODING);
        } catch (ParseException e) {
            LOG.error("Error in gettting default parser", e);
            // throw e;

            StackTraceElement[] stackTrace = e.getStackTrace();
            for (StackTraceElement ele : stackTrace) {
                if (ele.toString().toLowerCase().contains("font")) {
                    throw new ValidationException(
                            Arrays.asList(new ValidationError("Unsupported font is used", "Unsupported font is used")));
                }
            }

        } catch (NoSuchElementException e) {
            StackTraceElement[] stackTrace = e.getStackTrace();
            for (StackTraceElement ele : stackTrace) {
                if (ele.toString().toLowerCase().contains("font")) {
                    throw new ValidationException(
                            Arrays.asList(new ValidationError("Unsupported font is used", "Unsupported font is used")));
                }
            }
        } catch (Exception e) {
            StackTraceElement[] stackTrace = e.getStackTrace();
            for (StackTraceElement ele : stackTrace) {
                if (ele.toString().toLowerCase().contains("font")) {
                    throw new ValidationException(
                            Arrays.asList(new ValidationError("Unsupported font is used", "Unsupported font is used")));
                }
            }
        }
        // Extract DXF Data
        DXFDocument doc = parser.getDocument();
        return doc;
    }

}
