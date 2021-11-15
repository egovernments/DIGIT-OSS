package org.egov.egovdocumentuploader.utils;

import org.springframework.stereotype.Component;

@Component
public class DocumentUploaderConstants {
    public static final String EMPLOYEE = "EMPLOYEE";

    public static final String LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";

    public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";

}
