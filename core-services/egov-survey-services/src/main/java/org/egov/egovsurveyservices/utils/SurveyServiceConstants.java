package org.egov.egovsurveyservices.utils;

import org.springframework.stereotype.Component;

@Component
public class SurveyServiceConstants {
    public static final String EMPLOYEE = "EMPLOYEE";
    public static final String ACTIVE = "ACTIVE";
    public static final String INACTIVE = "INACTIVE";
    public static final String CITIZEN = "CITIZEN";
    public static final String LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";
    public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";
}
