package org.egov.pgr.utils;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ReportConstants {
	
	public static final String BLOCK_REPORT = "BlockWiseReport";
	public static final String DEPARTMENT_REPORT = "DepartmentWiseReport";
	public static final String ULBEMPLOYEE_REPORT = "ULBEmployeeWiseReport";
	public static final String AO_REPORT = "AOWiseReport";
	public static final String COMPLAINT_TYPE_REPORT = "ComplaintTypeWiseReport";
	public static final String SOURCE_REPORT = "SourceWiseReport";
	
	public static final String[] REPORT_LIST = {BLOCK_REPORT, DEPARTMENT_REPORT, ULBEMPLOYEE_REPORT, AO_REPORT, COMPLAINT_TYPE_REPORT, SOURCE_REPORT};
	
	public static Map<String, String> reportCoulmnKeyMap = prepareReportColumnKeyMap();

	public static Map<String, String> prepareReportColumnKeyMap() {
		
		Map<String, String> map = new HashMap<>();
		map.put(COMPLAINT_TYPE_REPORT, "complaint type");
		map.put(DEPARTMENT_REPORT, "department name");
		map.put(BLOCK_REPORT, "Block");
		map.put(ULBEMPLOYEE_REPORT, "employee name");
		map.put(AO_REPORT, "ao name");
		map.put(SOURCE_REPORT, "Source");
	
		return map;		
	}

}

