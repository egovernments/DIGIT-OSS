package org.egov.rb.util;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class Constants {

    public static final String MDMS_SERVICEDEF = "ServiceDefs";

    public static final String MDMS_MODULE_NAME = "RAINMAKER-PGR";

    public static final String MDMS_SERVICECODE_SEARCH = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs[?(@.name=='{COMPLAINT_NAME}')].serviceCode";
	
    public static final String MDMS_SERVICENAME_SEARCH ="$.MdmsRes.RAINMAKER-PGR.ServiceDefs[?(@.serviceCode=='{COMPLAINT_CODE}')].name";

    public static final String SOURCE="RB Bot";

	public static final String APPLY = "APPLY";
}
