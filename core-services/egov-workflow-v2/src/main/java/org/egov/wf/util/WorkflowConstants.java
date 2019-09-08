package org.egov.wf.util;


import org.springframework.stereotype.Component;

@Component
public class WorkflowConstants {

    public WorkflowConstants() {}

    public static final String MDMS_WORKFLOW = "Workflow";

    public static final String WF_JSONPATH_CODE = "$.MdmsRes.Workflow.BusinessService[?(@.businessService=='{name}')]";

    public static final String ALL_WF_JSONPATH_CODE = "$.MdmsRes.Workflow.BusinessService.*";

    public static final String MDMS_BUSINESSSERVICE= "BusinessService";

    public static final String MDMS_ALLOWED_ROLES_ALL_SERVICES = "$..roles";

    public static final String MDMS_ALLOWED_ROLES= "$.BusinessService[?(@.businessService=='NewTL')]..roles";

    public static final String UUID_REGEX = "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";








}
