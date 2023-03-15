package org.egov.pgr.repository;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.egov.pgr.contract.ParamValue;
import org.egov.pgr.contract.ReportRequest;
import org.egov.pgr.service.NotificationService;
import org.egov.pgr.utils.ReportConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ReportQueryBuilder {

	@Autowired
	private NotificationService notificationService;
	
/*	public String createATempTable() {
		String query = "create temporary table slaService (code varchar(265), sla numeric)";
		return query;
	}
	
	public String populateTempTable(ReportRequest reportRequest) {
		Map<String, Long> slaHoursMap = notificationService.getSlaHours(reportRequest.getRequestInfo(),
				reportRequest.getTenantId());
		StringBuilder queryBuilder = new StringBuilder();
		queryBuilder.append("insert into slaService(code, sla) VALUES ");
		for(String key: slaHoursMap.keySet()) {
			queryBuilder.append("(");
			queryBuilder.append("'" + key + "'" + ", ");
			queryBuilder.append(slaHoursMap.get(key));
			queryBuilder.append("),");
		}
		String query = queryBuilder.toString();
		query = query.substring(0, query.length() - 1);
		return query.toString();
	}

	public String getCreateViewQuery() {
		String 	query = "create view slaservicerequestidview as select businesskey, "
				+ "case when (max(\"when\") - min(\"when\") > (SELECT sla from slaService JOIN eg_pgr_service ON slaService.code = eg_pgr_service.servicecode JOIN "
				+ "eg_pgr_action ON eg_pgr_action.businesskey = eg_pgr_service.servicerequestid)) then 'Yes' else 'No' end as has_sla_crossed "
				+ "from eg_pgr_action group by businesskey";

		log.info("Create view query: " + query);
		return query;

	}*/
	
	public String getCreateViewQuery() {
		Long slaHours = notificationService.getSlaHours();
		String query = "create view slaservicerequestidview as select businesskey,\n"
				+ "case when (max(\"when\") - min(\"when\") > $sla) then 'Yes' else 'No' end as has_sla_crossed \n"
				+ "from eg_pgr_action                                                            \n"
				+ "group by businesskey\n" + "";
		
		query = query.replace("$sla", slaHours.toString());
		log.info("Create view query: " + query);
		return query;

	}

	public String getDropViewQuery() {
		String query = "DROP VIEW slaservicerequestidview";
		return query;

	}
	
	
/*	public String getDropTempTableQuery() {
		String query = "DROP TABLE slaService";
		return query;
	}*/

	public String getComplaintWiseReportQuery(ReportRequest reportRequest) {
		String query = "SELECT servicecode as complaint_type,          \n"
				+ "       sum(case when tenantId NOTNULL then 1 else 0 end) as total_complaints,\n"
				// + " sum(case when status IN ('closed','resolved','rejected') then 1 else 0
				// end) as total_closed_complaints,\n"
				+ "       sum(case when status IN ('open','assigned') then 1 else 0 end) as total_open_complaints,\n"
				// + " sum(case when has_sla_crossed = 'No' then 1 else 0 end) as within_sla,\n"
				+ "       sum(case when has_sla_crossed = 'Yes' then 1 else 0 end) as outside_sla, \n"
				+ "       avg(cast(rating as numeric)) as avg_citizen_rating\n"
				+ "  from eg_pgr_service INNER JOIN slaservicerequestidview ON servicerequestid = businesskey $where\n"
				+ "  group by servicecode";

		query = addWhereClause(query, reportRequest);
		log.info("Complaint Type wise report query: " + query);
		return query;

	}

	public String getAOWiseReportQuery(ReportRequest reportRequest) {
		String query = "SELECT by as ao_name,          \n"
				+ "       (select count(*) from eg_pgr_service $subwhere) as total_complaints_received,\n"
				+ "       sum(case when action = 'assign' OR action = 'requestforreassign' then 1 else 0 end) as complaints_assigned,\n"
				+ "       sum(case when action = 'reject' then 1 else 0 end) as complaints_rejected \n"
				+ "  FROM eg_pgr_service INNER JOIN eg_pgr_action ON eg_pgr_service.servicerequestid = eg_pgr_action.businesskey $where\n"
				+ "  GROUP BY by";

		query = addWhereClause(query, reportRequest);
		log.info("AO wise report query: " + query);
		return query;

	}

	public String getDepartmentWiseReportQuery(ReportRequest reportRequest) {
		String query = "SELECT servicecode as department_name,          \n"
				+ "       sum(case when tenantId NOTNULL then 1 else 0 end) as total_complaints,\n"
				+ "       sum(case when status IN ('open','assigned') then 1 else 0 end) as total_open_complaints,\n"
				+ "       sum(case when has_sla_crossed = 'Yes' then 1 else 0 end) as outside_sla, \n"
				+ "       avg(cast(rating as numeric)) as avg_citizen_rating\n"
				+ "  from eg_pgr_service INNER JOIN slaservicerequestidview ON servicerequestid = businesskey $where\n"
				+ "  group by servicecode";

		query = addWhereClause(query, reportRequest);
		log.info("Department name wise report query: " + query);
		return query;

	}

	public String getSourceWiseReportQuery(ReportRequest reportRequest) {
		String query = "SELECT sum(case when source = 'mobileapp' then 1 else 0 end) as citizen_mobile_app,\n"
				+ "       sum(case when source = 'web' then 1 else 0 end) as citizen_web_app,\n"
				+ "       sum(case when source = 'ivr' then 1 else 0 end) as customer_service_desk\n"
				+ "FROM eg_pgr_service $where";

		query = addWhereClause(query, reportRequest);
		log.info("Source wise report query: " + query);
		return query;
	}

	public String getFunctionaryWiseReportQuert(ReportRequest reportRequest) {
		String query = "select \n" + 
				"(SELECT (CASE WHEN assignee IN (select distinct assignee from eg_pgr_action where action = 'assign' and \"when\" = (select max(\"when\") from eg_pgr_action action where action.businesskey =  eg_pgr_action.businesskey and action = 'assign')) THEN CONCAT(assignee,'') END) as employee_name), \n" + 
				"sum(case when eg_pgr_action.businesskey IN (select DISTINCT businesskey from eg_pgr_action where \"when\" IN (select max(\"when\") from eg_pgr_action where status = 'assigned' group by businesskey)) then 1 else 0 end) as total_complaints_received, \n" + 
				"sum(case when eg_pgr_action.when IN (select max(\"when\") from eg_pgr_action where eg_pgr_action.status NOTNULL AND eg_pgr_action.status != 'resolved' group by businessKey) AND eg_pgr_action.status != 'resolved' then 1 else 0 end) as total_open_complaints,\n" + 
				"sum(case when has_sla_crossed = 'Yes' then 1 else 0 end) as outside_sla,\n" + 
				"avg(cast(rating as numeric)) as avg_citizen_rating\n" + 
				"from eg_pgr_service INNER JOIN eg_pgr_action ON servicerequestid = eg_pgr_action.businesskey INNER JOIN slaservicerequestidview ON servicerequestid = slaservicerequestidview.businesskey \n" + 
				"where eg_pgr_action.assignee NOTNULL $where group by eg_pgr_action.assignee";

		query = addWhereClause(query, reportRequest);
		log.info("Functionary Wise report query: " + query);
		return query;
	}

	public String addWhereClause(String query, ReportRequest reportRequest) {
		List<ParamValue> searchParams = reportRequest.getSearchParams();
		StringBuilder queryBuilder = new StringBuilder();
		if (reportRequest.getReportName().equalsIgnoreCase(ReportConstants.ULBEMPLOYEE_REPORT)) {
			queryBuilder.append(" AND eg_pgr_service.tenantid = ").append("'" + reportRequest.getTenantId() + "'");
		} else {
			queryBuilder.append("WHERE eg_pgr_service.tenantid = ").append("'" + reportRequest.getTenantId() + "'");
		}
		if (reportRequest.getReportName().equalsIgnoreCase(ReportConstants.AO_REPORT)) {
			queryBuilder.append(" AND (by LIKE '%Grievance Routing Officer' OR by LIKE '%Employee') ");
			query = query.replace("$subwhere", "WHERE tenantid = '" + reportRequest.getTenantId() + "'");
		}
		if (!CollectionUtils.isEmpty(searchParams)) {
			for (ParamValue param : searchParams) {
				if (param.getName().equalsIgnoreCase("fromDate")) {
					if (!StringUtils.isEmpty(param.getInput().toString())) {
						queryBuilder.append(" AND createdtime >= ").append(param.getInput());
					}
				} else if (param.getName().equalsIgnoreCase("toDate")) {
					if (!StringUtils.isEmpty(param.getInput().toString())) {
						queryBuilder.append(" AND createdtime <= ").append(param.getInput());
					}
				}
			}
		}
		queryBuilder.append(" AND eg_pgr_service.active = true");
		query = query.replace("$where", queryBuilder.toString());
		return query;
	}

}
