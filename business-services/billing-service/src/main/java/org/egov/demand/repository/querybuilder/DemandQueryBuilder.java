/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.demand.repository.querybuilder;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.egov.demand.model.DemandCriteria;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DemandQueryBuilder {
	

	public static final String PAYMENT_BACKUPDATE_AUDIT_INSERT_QUERY = "INSERT INTO egbs_payment_backupdate_audit (paymentid, isbackupdatesuccess, isreceiptcancellation, errorMessage)"
			+ " VALUES (?,?,?,?);";
	
	public static final String PAYMENT_BACKUPDATE_AUDIT_SEARCH_QUERY = "SELECT paymentid FROM egbs_payment_backupdate_audit where paymentid=? AND isbackupdatesuccess=? AND isreceiptcancellation=?;";

	public static final String BASE_DEMAND_QUERY = "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,"
			+ "dmd.consumertype AS dconsumertype,dmd.businessservice AS dbusinessservice,dmd.payer,"
			+ "dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as dfixedBillExpiryDate, "
			+ "dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,"
			+ "dmd.minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,"
			+ "dmd.lastmodifiedby AS dlastmodifiedby,dmd.createdtime AS dcreatedtime,"
			+ "dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid AS dtenantid,dmd.status,"
			+ "dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as ispaymentcompleted,"

			+ "dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,"
			+ "dmdl.taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,"
			+ "dmdl.createdby AS dlcreatedby,dmdl.lastModifiedby AS dllastModifiedby,"
			+ "dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS dllastModifiedtime,"
			+ "dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails " + "FROM egbs_demand_v1 dmd "
			+ "INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid " + "AND dmd.tenantid=dmdl.tenantid WHERE ";

	public static final String BASE_DEMAND_DETAIL_QUERY = "SELECT "
			+ "demanddetail.id AS dlid,demanddetail.demandid AS dldemandid,demanddetail.taxheadcode AS dltaxheadcode,"
			+ "demanddetail.taxamount AS dltaxamount,demanddetail.collectionamount AS dlcollectionamount,"
			+ "demanddetail.createdby AS dlcreatedby,demanddetail.lastModifiedby AS dllastModifiedby,"
			+ "demanddetail.createdtime AS dlcreatedtime,demanddetail.lastModifiedtime AS dllastModifiedtime,"
			+ "demanddetail.tenantid AS dltenantid " + " FROM egbs_demanddetail_v1 demanddetail "
					+ "INNER JOIN egbs_demand demand ON demanddetail.demandid=demand.id AND "
					+ "demanddetail.tenantid=demand.tenantid WHERE ";

	public static final String DEMAND_QUERY_ORDER_BY_CLAUSE = "dmd.taxperiodfrom";

	public static final String BASE_DEMAND_DETAIL_QUERY_ORDER_BY_CLAUSE = "dmdl.id";

	public static final String DEMAND_INSERT_QUERY = "INSERT INTO egbs_demand_v1 "
			+ "(id,consumerCode,consumerType,businessService,payer,taxPeriodFrom,taxPeriodTo,"
			+ "minimumAmountPayable,createdby,lastModifiedby,createdtime,lastModifiedtime,tenantid, status, additionaldetails, billexpirytime, fixedBillExpiryDate) "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

	public static final String DEMAND_DETAIL_INSERT_QUERY = "INSERT INTO egbs_demanddetail_v1 "
			+ "(id,demandid,taxHeadCode,taxamount,collectionamount,"
			+ "createdby,lastModifiedby,createdtime,lastModifiedtime,tenantid,additionaldetails)" 
			+ " VALUES (?,?,?,?,?,?,?,?,?,?,?);";

	public static final String DEMAND_UPDATE_QUERY = "UPDATE egbs_demand_v1 SET " + "payer=?,taxPeriodFrom=?,"
			+ "taxPeriodTo=?,minimumAmountPayable=?,lastModifiedby=?," + "lastModifiedtime=?,tenantid=?,"
			+ " status=?,additionaldetails=?,billexpirytime=?,ispaymentcompleted=?, fixedBillExpiryDate=? WHERE id=? AND tenantid=?;";
	
	public static final String DEMAND_DETAIL_UPDATE_QUERY = "UPDATE egbs_demanddetail_v1 SET taxamount=?,collectionamount=?,"
			+ "lastModifiedby=?,lastModifiedtime=?, additionaldetails=? WHERE id=? AND demandid=? AND tenantid=?;";

	public static final String DEMAND_AUDIT_INSERT_QUERY = "INSERT INTO egbs_demand_v1_audit "
			+ "(demandid,consumerCode,consumerType,businessService,payer,taxPeriodFrom,taxPeriodTo,"
			+ "minimumAmountPayable,createdby,createdtime,tenantid, status, additionaldetails,id,billexpirytime, ispaymentcompleted) "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

	public static final String DEMAND_DETAIL_AUDIT_INSERT_QUERY = "INSERT INTO egbs_demanddetail_v1_audit "
			+ "(demanddetailid,demandid,taxHeadCode,taxamount,collectionamount,"
			+ "createdby,createdtime,tenantid,additionaldetails,id)" 
			+ " VALUES (?,?,?,?,?,?,?,?,?,?);";
	
	public static final String DEMAND_UPDATE_CONSUMERCODE_QUERY="UPDATE egbs_demand_v1 SET consumercode=?, lastmodifiedby=?, lastmodifiedtime=? "
			+ " WHERE tenantid=? AND id IN (";
	

	public String getDemandQueryForConsumerCodes(Map<String,Set<String>> businessConsumercodeMap,List<Object> preparedStmtList, String tenantId){
		
		StringBuilder query = new StringBuilder(BASE_DEMAND_QUERY);
		
		query.append("dmd.tenantid=? ");
		preparedStmtList.add(tenantId);
		
		query.append("AND dmd.status='ACTIVE' ");
		
		boolean orFlag = false;
		for (Entry<String, Set<String>> consumerCode : businessConsumercodeMap.entrySet()) {
			
			String businessService = consumerCode.getKey();
			Set<String> consumerCodes = consumerCode.getValue();
			
			if(consumerCodes!=null && !consumerCodes.isEmpty()){
				
				if(orFlag)
					query.append("OR");
				else
					query.append("AND");
				
				query.append(" dmd.businessservice='"+businessService+"' AND dmd.consumercode IN ("
						+getIdQueryForStrings(consumerCodes)+")");
				addToPreparedStatement(preparedStmtList, consumerCodes);
				orFlag=true;
			}
		}
		
		return query.toString();
				}

	public String getDemandQuery(DemandCriteria demandCriteria, List<Object> preparedStatementValues) {

		StringBuilder demandQuery = new StringBuilder(BASE_DEMAND_QUERY);

		String tenantId = demandCriteria.getTenantId();
		String[] tenantIdChunks = tenantId.split("\\.");
		
		if(tenantIdChunks.length == 1){
			demandQuery.append(" dmd.tenantid LIKE ? ");
			preparedStatementValues.add(demandCriteria.getTenantId() + '%');
		}else{
			demandQuery.append(" dmd.tenantid = ? ");
			preparedStatementValues.add(demandCriteria.getTenantId());
		}
		

		if (demandCriteria.getStatus() != null) {

			addAndClause(demandQuery);
			demandQuery.append("dmd.status=?");
			preparedStatementValues.add(demandCriteria.getStatus());
		}
		
		if (demandCriteria.getDemandId() != null && !demandCriteria.getDemandId().isEmpty()) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.id IN (" + getIdQueryForStrings(demandCriteria.getDemandId()) + ")");
			addToPreparedStatement(preparedStatementValues, demandCriteria.getDemandId());
		}
		if (!CollectionUtils.isEmpty(demandCriteria.getPayer())) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.payer IN (" + getIdQueryForStrings(demandCriteria.getPayer()) + ")");
			addToPreparedStatement(preparedStatementValues, demandCriteria.getPayer());
		}
		if (demandCriteria.getBusinessService() != null) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.businessservice=?");
			preparedStatementValues.add(demandCriteria.getBusinessService());
		}
		
		if(demandCriteria.getIsPaymentCompleted() != null){
			addAndClause(demandQuery);
			demandQuery.append("dmd.ispaymentcompleted = ?");
			preparedStatementValues.add(demandCriteria.getIsPaymentCompleted());
		}
		
		if (demandCriteria.getPeriodFrom() != null) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.taxPeriodFrom >= ?");
			preparedStatementValues.add(demandCriteria.getPeriodFrom());
		}
		
		if(demandCriteria.getPeriodTo() != null){
			addAndClause(demandQuery);
			demandQuery.append("dmd.taxPeriodTo <= ?");
			preparedStatementValues.add(demandCriteria.getPeriodTo());
		}
		
		if (demandCriteria.getConsumerCode() != null && !demandCriteria.getConsumerCode().isEmpty()) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.consumercode IN ("
			+ getIdQueryForStrings(demandCriteria.getConsumerCode()) + ")");
			addToPreparedStatement(preparedStatementValues, demandCriteria.getConsumerCode());
		}

		addOrderByClause(demandQuery, DEMAND_QUERY_ORDER_BY_CLAUSE);
		addPagingClause(demandQuery, preparedStatementValues);

		log.info("the query String for demand : " + demandQuery.toString());
		return demandQuery.toString();
	}
	
	private static void addOrderByClause(StringBuilder demandQueryBuilder,String columnName) {
		demandQueryBuilder.append(" ORDER BY " + columnName);
	}

	private static void addPagingClause(StringBuilder demandQueryBuilder, List<Object> preparedStatementValues) {
//		demandQueryBuilder.append(" LIMIT ?");
//		preparedStatementValues.add(500);
//		demandQueryBuilder.append(" OFFSET ?");
//		preparedStatementValues.add(0);
	}

	private static boolean addAndClause(StringBuilder queryString) {
		queryString.append(" AND ");
		return true;
	}
	
	private static String getIdQueryForStrings(Set<String> idList) {

		StringBuilder builder = new StringBuilder();
		int length = idList.size();
		for( int i = 0; i< length; i++){
			builder.append(" ? ");
			if(i != length -1) builder.append(",");
		}
		return builder.toString();
	}

	private void addToPreparedStatement(List<Object> preparedStmtList, Collection<String> ids)
	{
		ids.forEach(id ->{ preparedStmtList.add(id);});
	}
}
