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

    //Notification Constants
    public static final String SURVEY_TITLE = "{survey_title}";
    public static final String NEW_SURVEY = "New Survey";
    public static final String WEBAPP = "WEBAPP";
    public static final String SYSTEMGENERATED = "SYSTEMGENERATED";
    public static final String APPLICATION_NUMBER_PLACEHOLDER = "{APPNUMBER}";
    public static final String TENANTID_PLACEHOLDER = "{TENANTID}";
    public static final String LOCALIZATION_MODULE = "rainmaker-common";
    public static final String LOCALIZATION_CODE = "SS_SURVEY_NOTIFICATION_TEMPLATE";

}
