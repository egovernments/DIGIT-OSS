package org.egov.fsm.repository.querybuilder;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.web.model.FSMAuditSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FSMAuditQueryBuilder {

	@Autowired
	private FSMConfiguration config;

	private static final String Query = "select fsm.*,fsm_address.*,fsm_geo.*,fsm_pit.*,fsm.id as fsm_id, fsm.createdby as fsm_createdby,"
			+ "  fsm.lastmodifiedby as fsm_lastmodifiedby, fsm.createdtime as fsm_createdtime, fsm.lastmodifiedtime as fsm_lastmodifiedtime,"
			+ "	 fsm.additionaldetails,fsm_address.id as fsm_address_id,fsm_geo.id as fsm_geo_id,"
			+ "	 fsm_pit.id as fsm_pit_id" + "	 FROM eg_fsm_application fsm"
			+ "	 INNER JOIN   eg_fsm_address fsm_address on fsm_address.fsm_id = fsm.id"
			+ "	 LEFT OUTER JOIN  eg_fsm_geolocation fsm_geo on fsm_geo.address_id = fsm_address.id"
			+ "	 LEFT OUTER JOIN  eg_fsm_pit_detail fsm_pit on fsm_pit.fsm_id = fsm.id where fsm.tenantid=?";
	
	private static final String AUDIT_Query = "select fsm.*,fsm_address.*,fsm_geo.*,fsm_pit.*,fsm.id as fsm_id, fsm.createdby as fsm_createdby,"
			+ "  fsm.lastmodifiedby as fsm_lastmodifiedby, fsm.createdtime as fsm_createdtime, fsm.lastmodifiedtime as fsm_lastmodifiedtime,"
			+ "	 fsm.additionaldetails,fsm_address.id as fsm_address_id, fsm_geo.id as fsm_geo_id,"
			+ "	 fsm_pit.id as fsm_pit_id	 FROM eg_fsm_application_auditlog fsm"
			+ "	 LEFT OUTER JOIN   eg_fsm_address_auditlog fsm_address on fsm_address.fsm_id = fsm.id	 and fsm_address.lastmodifiedtime=fsm.lastmodifiedtime"
			+ "	 LEFT OUTER JOIN  eg_fsm_geolocation_auditlog fsm_geo on fsm_geo.address_id = fsm_address.id	 and fsm_address.lastmodifiedtime=fsm_geo.lastmodifiedtime"
			+ "	 LEFT OUTER JOIN  eg_fsm_pit_detail_auditlog fsm_pit on fsm_pit.fsm_id = fsm.id  and fsm_pit.lastmodifiedtime=fsm.lastmodifiedtime where fsm.tenantid=?";
	
	private static final String FSM_ID = " AND fsm.id=?";
	private static final String APPLICATION_NO = " AND fsm.applicationno=?";

	public String getFSMActualDataQuery(FSMAuditSearchCriteria criteria, List<Object> preparedStmtList) {
		return generateQuery(Query, criteria, preparedStmtList);
	}
	
	private String generateQuery(String query, FSMAuditSearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder fsmDataQuery = new StringBuilder(query);
		preparedStmtList.add(criteria.getTenantId());
		if (StringUtils.isNotEmpty(criteria.getId())) {
			fsmDataQuery = fsmDataQuery.append(FSM_ID);
			preparedStmtList.add(criteria.getId());
		}
		if (StringUtils.isNotEmpty(criteria.getApplicationNo())) {
			fsmDataQuery = fsmDataQuery.append(APPLICATION_NO);
			preparedStmtList.add(criteria.getApplicationNo());
		}
		fsmDataQuery.append(" order by fsm.lastmodifiedtime desc");
		return fsmDataQuery.toString();
	}
	
	public String getFSMAuditDataQuery(FSMAuditSearchCriteria criteria, List<Object> preparedStmtList) {
		return generateQuery(AUDIT_Query, criteria, preparedStmtList);
	}

}
