package org.egov.pgr.util;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
@NoArgsConstructor
public class PGRConstants {


    public static final String PGR_BUSINESSSERVICE = "PGR";

    public static final String USERTYPE_EMPLOYEE = "EMPLOYEE";

    public static final String USERTYPE_CITIZEN = "CITIZEN";

    public static final String PGR_MODULENAME = "PGR";

    public static final String PGR_WF_REOPEN = "REOPEN";

    public static final String MDMS_SERVICEDEF = "ServiceDefs";

    public static final String MDMS_MODULE_NAME = "RAINMAKER-PGR";

    public static final String MDMS_SERVICEDEF_SEARCH = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs[?(@.serviceCode=='{SERVICEDEF}')]";

    public static final String MDMS_DEPARTMENT_SEARCH = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs[?(@.serviceCode=='{SERVICEDEF}')].department";

    public static final String HRMS_DEPARTMENT_JSONPATH = "$.Employees.*.assignments.*.department";

    public static final String HRMS_DESIGNATION_JSONPATH = "$.Employees.*.assignments[?(@.department=='{department}')].designation";

    public static final String HRMS_EMP_NAME_JSONPATH = "$.Employees.*.user.name";

    public static final String PENDING_FOR_REASSIGNMENT = "PENDINGFORREASSIGNMENT";

    public static final String APPLY_PENDING_FOR_REASSIGNMENT = "APPLY_PENDINGFORASSIGNMENT";

    public static final String RESOLVE_RESOLVED = "RESOLVE_RESOLVED";

    public static final String REOPEN_PENDING_FOR_ASSIGNMENT = "REOPEN_PENDINGFORASSIGNMENT";

    public static final String REASSIGN_PENDINGATLME = "REASSIGN_PENDINGATLME";

    public static final String REJECT_REJECTED = "REJECT_REJECTED";

    public static final String PENDINGATLME = "PENDINGATLME";

    public static final String REASSIGN = "REASSIGN";

    public static final String REJECT = "REJECT";

    public static final String REJECTED = "REJECTED";

    public static final String PENDINGFORASSIGNMENT = "PENDINGFORASSIGNMENT";

    public static final String RESOLVED = "RESOLVED";

    public static final String CLOSED_AFTER_RESOLUTION = "CLOSEDAFTERRESOLUTION";

    public static final String CLOSED_AFTER_REJECTION = "CLOSEDAFTERREJECTION";

    public static final String RATE = "RATE";

    public static final String APPLY = "APPLY";

    public static final String CITIZEN = "CITIZEN";

    public static final String EMPLOYEE = "EMPLOYEE";

    public static final String COMMENT = "COMMENT";

    public static final String COMMENT_DEFAULT = "COMMENT_DEFAULT";

    public static final String DEFAULT = "DEFAULT";

    public static final String ASSIGN_CITIZEN_PENDINGATLME = "ASSIGN_CITIZEN_PENDINGATLME";

    public static final String ASSIGN_EMPLOYEE_PENDINGATLME = "ASSIGN_EMPLOYEE_PENDINGATLME";

    public static final String CLOSE_EMPLOYEE_CLOSED_AFTER_RESOLUTION = "CLOSE_EMPLOYEE_CLOSEDAFTERRESOLUTION";

    public static final String REASSIGN_CITIZEN_PENDINGATLME = "REASSIGN_CITIZEN_PENDINGATLME";

    public static final String REASSIGN_EMPLOYEE_PENDINGATLME = "REASSIGN_EMPLOYEE_PENDINGATLME";

    public static final String REJECT_CITIZEN_REJECTED = "REJECT_CITIZEN_REJECTED";

    public static final String REOPEN_CITIZEN_PENDINGFORASSIGNMENT = "REOPEN_CITIZEN_PENDINGFORASSIGNMENT";

    public static final String REOPEN_EMPLOYEE_PENDINGFORASSIGNMENT = "REOPEN_EMPLOYEE_PENDINGFORASSIGNMENT";

    public static final String RESOLVE_CITIZEN_RESOLVED = "RESOLVE_CITIZEN_RESOLVED";

    public static final String APPLY_PENDINGFORASSIGNMENT = "APPLY_PENDINGFORASSIGNMENT";

    public static final String REASSIGN_PENDING_FOR_REASSIGNMENT = "REASSIGN_PENDINGFORREASSIGNMENT";

    public static final String ASSIGN = "ASSIGN";

    public static final String ASSIGN_PENDING_AT_LME = "ASSIGN_PENDINGATLME";

    public static final String RATE_CLOSED_AFTER_REJECTION = "RATE_CLOSEDAFTERREJECTION";

    public static final String RATE_CLOSED_AFTER_RESOLUTION = "RATE_CLOSEDAFTERRESOLUTION";

    public static final List<String> NOTIFICATION_ENABLE_FOR_STATUS = Collections
            .unmodifiableList(Arrays.asList(APPLY_PENDING_FOR_REASSIGNMENT,RESOLVE_RESOLVED,REOPEN_PENDING_FOR_ASSIGNMENT,REASSIGN_PENDINGATLME,
                    REJECT_REJECTED,ASSIGN_CITIZEN_PENDINGATLME,ASSIGN_EMPLOYEE_PENDINGATLME,CLOSE_EMPLOYEE_CLOSED_AFTER_RESOLUTION,
                    REASSIGN_CITIZEN_PENDINGATLME,REASSIGN_EMPLOYEE_PENDINGATLME,REJECT_CITIZEN_REJECTED,REOPEN_CITIZEN_PENDINGFORASSIGNMENT,
                    REOPEN_EMPLOYEE_PENDINGFORASSIGNMENT,RESOLVE_CITIZEN_RESOLVED,APPLY_PENDINGFORASSIGNMENT,COMMENT, COMMENT_DEFAULT, DEFAULT,
                    REASSIGN_PENDING_FOR_REASSIGNMENT, ASSIGN_PENDING_AT_LME, RATE_CLOSED_AFTER_REJECTION, RATE_CLOSED_AFTER_RESOLUTION));

    public static final String NOTIFICATION_LOCALE = "en_IN";

    public static final String PGR_MODULE = "rainmaker-pgr";

    public static final String COMMON_MODULE = "rainmaker-common";

    public static final String DATE_PATTERN = "dd/MM/yyyy";

    public static final String PGR_WF_RESOLVE = "RESOLVE";

    public static final String USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";

    public static final String USREVENTS_EVENT_NAME = "PGR";

    public static final String USREVENTS_EVENT_POSTEDBY = "SYSTEM-PGR";

    public static final String IMAGE_DOCUMENT_TYPE = "PHOTO";

    public static final String MDMS_DATA_JSONPATH = "$.MdmsRes.RAINMAKER-PGR.ServiceDefs";

    public static final String MDMS_DATA_SERVICE_CODE_KEYWORD = "serviceCode";

    public static final String MDMS_DATA_SLA_KEYWORD = "slaHours";
    
    public static final String COMPLAINTS_RESOLVED = "complaintsResolved";
    
    public static final String AVERAGE_RESOLUTION_TIME = "averageResolutionTime";

    public static final String DESIGNATION = "designation";

    public static final String DEPARTMENT = "department";


}
