package org.egov.wf.util;


import org.springframework.stereotype.Component;

@Component
public class WorkflowConstants {

    public WorkflowConstants() {}

    public static final String MDMS_WORKFLOW = "Workflow";

    public static final String WF_JSONPATH_CODE = "$.MdmsRes.Workflow.BusinessService[?(@.businessService=='{name}')]";

    public static final String ALL_WF_JSONPATH_CODE = "$.MdmsRes.Workflow.BusinessService.*";

    public static final String MDMS_BUSINESSSERVICE= "BusinessServiceMasterConfig";

    public static final String MDMS_AUTOESCALTION= "AutoEscalation";

    public static final String JSONPATH_AUTOESCALTION = "$.MdmsRes.Workflow.AutoEscalation";

    public static final String JSONPATH_BUSINESSSERVICE_STATELEVEL = "$.MdmsRes.Workflow.BusinessServiceMasterConfig";

    public static final String JSONPATH_TEANANTIDS = "$.MdmsRes.tenant.tenants.*.code";

    public static final String MDMS_MODULE_TENANT= "tenant";
    
    public static final String MDMS_WF_SLA_CONFIG = "wfSlaConfig";

    public static final String MDMS_COMMON_MASTERS = "common-masters";

    public static final String SLOT_PERCENTAGE_PATH = "$.MdmsRes.common-masters.wfSlaConfig[0].slotPercentage";

    public static final String MDMS_TENANTS= "tenants";

    public static final String MDMS_ALLOWED_ROLES_ALL_SERVICES = "$..roles";

    public static final String MDMS_ALLOWED_ROLES= "$.BusinessService[?(@.businessService=='NewTL')]..roles";

    public static final String UUID_REGEX = "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

    public static final String MDMS_BUSINESSSERVICECONFIG= "businessServiceConfig";

    public static final String CITIZEN_TYPE = "CITIZEN";

    public static final String SENDBACKTOCITIZEN = "SENDBACKTOCITIZEN";

    public static final String RATE_ACTION = "RATE";

    public static final String AUTO_ESC_EMPLOYEE_ROLE_CODE = "AUTO_ESCALATE";
    
    public static final String  FSM_MODULE="FSM";

}
