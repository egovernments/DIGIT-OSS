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

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetailCriteria;
import org.egov.demand.model.DemandUpdateMisRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DemandQueryBuilder {

	public static final String BASE_DEMAND_QUERY = "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,"
			+ "dmd.consumertype AS dconsumertype,dmd.businessservice AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime,"
			+ "dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,"
			+ "dmd.minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,"
			+ "dmd.lastmodifiedby AS dlastmodifiedby,dmd.createdtime AS dcreatedtime,"
			+ "dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,"

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
			+ "minimumAmountPayable,createdby,lastModifiedby,createdtime,lastModifiedtime,tenantid, status, additionaldetails, billexpirytime) "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

	public static final String DEMAND_DETAIL_INSERT_QUERY = "INSERT INTO egbs_demanddetail_v1 "
			+ "(id,demandid,taxHeadCode,taxamount,collectionamount,"
			+ "createdby,lastModifiedby,createdtime,lastModifiedtime,tenantid,additionaldetails)" 
			+ " VALUES (?,?,?,?,?,?,?,?,?,?,?);";

	public static final String DEMAND_UPDATE_QUERY = "UPDATE egbs_demand_v1 SET " + "payer=?,taxPeriodFrom=?,"
			+ "taxPeriodTo=?,minimumAmountPayable=?,lastModifiedby=?," + "lastModifiedtime=?,tenantid=?,"
			+ " status=?,additionaldetails=?,billexpirytime=? WHERE id=? AND tenantid=?;";

	public static final String DEMAND_DETAIL_UPDATE_QUERY = "UPDATE egbs_demanddetail_v1 SET taxamount=?,collectionamount=?,"
			+ "lastModifiedby=?,lastModifiedtime=?, additionaldetails=? WHERE id=? AND demandid=? AND tenantid=?;";

	public static final String DEMAND_AUDIT_INSERT_QUERY = "INSERT INTO egbs_demand_v1_audit "
			+ "(demandid,consumerCode,consumerType,businessService,payer,taxPeriodFrom,taxPeriodTo,"
			+ "minimumAmountPayable,createdby,createdtime,tenantid, status, additionaldetails,id,billexpirytime) "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

	public static final String DEMAND_DETAIL_AUDIT_INSERT_QUERY = "INSERT INTO egbs_demanddetail_v1_audit "
			+ "(demanddetailid,demandid,taxHeadCode,taxamount,collectionamount,"
			+ "createdby,createdtime,tenantid,additionaldetails,id)" 
			+ " VALUES (?,?,?,?,?,?,?,?,?,?);";
	
	public static final String DEMAND_UPDATE_CONSUMERCODE_QUERY="UPDATE egbs_demand_v1 SET consumercode=?, lastmodifiedby=?, lastmodifiedtime=? "
			+ " WHERE tenantid=? AND id IN (";
	
	public static final String COLLECTED_RECEIPT_INSERT_QUERY="INSERT INTO egbs_collectedreceipts(id, businessservice, consumercode, receiptnumber,"
			+ " receiptamount, receiptdate, status, tenantid, createdby, createddate, lastmodifiedby, lastmodifieddate)"
			+ " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
	
	public  final String Collected_Receipt_search_Query="select * from egbs_collectedreceipts where ";
	
	public String getCollectedReceiptsQuery(DemandCriteria demandCriteria){
		StringBuilder query = new StringBuilder(Collected_Receipt_search_Query);
		query.append(" tenantid = '" + demandCriteria.getTenantId() + "' AND businessservice='"
				+ demandCriteria.getBusinessService() + "' AND consumercode IN ("
				+ getIdQueryForStrings(demandCriteria.getConsumerCode())+" order by consumercode desc");
		log.info("query::"+query);
		return query.toString();
	}
	public String getDemandQueryForConsumerCodes(Map<String,Set<String>> businessConsumercodeMap,List<Object> preparedStmtList, String tenantId){
		
		StringBuilder query = new StringBuilder(BASE_DEMAND_QUERY);
		
		query.append("dmd.tenantid=? ");
		preparedStmtList.add(tenantId);
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
						+getIdQueryForStrings(consumerCodes));
				orFlag=true;
			}
		}
		
		return query.toString();
				}

	public String getDemandQuery(DemandCriteria demandCriteria, List<Object> preparedStatementValues) {

		StringBuilder demandQuery = new StringBuilder(BASE_DEMAND_QUERY);

		demandQuery.append("dmd.tenantid=?");
		preparedStatementValues.add(demandCriteria.getTenantId());

		if (demandCriteria.getDemandId() != null && !demandCriteria.getDemandId().isEmpty()) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.id IN (" + getIdQueryForStrings(demandCriteria.getDemandId()));
		}
		if (!CollectionUtils.isEmpty(demandCriteria.getPayer())) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.payer IN (" + getIdQueryForStrings(demandCriteria.getPayer()));
		}
		if (demandCriteria.getBusinessService() != null) {
			addAndClause(demandQuery);
			demandQuery.append("dmd.businessservice=?");
			preparedStatementValues.add(demandCriteria.getBusinessService());
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
			+ getIdQueryForStrings(demandCriteria.getConsumerCode()));
		}

		addOrderByClause(demandQuery, DEMAND_QUERY_ORDER_BY_CLAUSE);
		addPagingClause(demandQuery, preparedStatementValues);

		log.info("the query String for demand : " + demandQuery.toString());
		return demandQuery.toString();
	}
	
	public static String getDemandDetailQuery(DemandDetailCriteria demandDetailCriteria,
			List<Object> preparedStatementValues) {

		StringBuilder demandDetailQuery = new StringBuilder(BASE_DEMAND_DETAIL_QUERY);

		demandDetailQuery.append("demanddetail.tenantid=?");
		preparedStatementValues.add(demandDetailCriteria.getTenantId());

		if (demandDetailCriteria.getDemandId() != null) {
			addAndClause(demandDetailQuery);
			demandDetailQuery.append("demanddetail.demandid=?");
			preparedStatementValues.add(demandDetailCriteria.getDemandId());
		}
		if (demandDetailCriteria.getTaxHeadCode() != null) {
			addAndClause(demandDetailQuery);
			demandDetailQuery.append("demanddetail.taxheadcode=?");
			preparedStatementValues.add(demandDetailCriteria.getTaxHeadCode());
		}
		if (demandDetailCriteria.getPeriodFrom() != null) {
			addAndClause(demandDetailQuery);
			demandDetailQuery.append("demand.taxPeriodFrom=?");
			preparedStatementValues.add(demandDetailCriteria.getPeriodFrom());
		}
		if(demandDetailCriteria.getPeriodTo() != null){
			addAndClause(demandDetailQuery);
			demandDetailQuery.append("demand.taxPeriodTo=?");
			preparedStatementValues.add(demandDetailCriteria.getPeriodTo());
		}
		if(demandDetailCriteria.getDetailsId() !=null && 
				!demandDetailCriteria.getDetailsId().isEmpty()){
			addAndClause(demandDetailQuery);
			demandDetailQuery.append("demanddetail.id IN (" +getIdQueryForStrings(demandDetailCriteria.getDetailsId()));
		}
		addOrderByClause(demandDetailQuery, BASE_DEMAND_DETAIL_QUERY_ORDER_BY_CLAUSE);
		addPagingClause(demandDetailQuery, preparedStatementValues);
		log.info("the query String for demand detail: " + demandDetailQuery.toString());
		return demandDetailQuery.toString();
	}
	//query builder for update mis(updating consumer code)
	public String getDemandUpdateMisQuery(DemandUpdateMisRequest demandRequest){

		return DEMAND_UPDATE_CONSUMERCODE_QUERY+getIdQueryForStrings(demandRequest.getId());
	}

	private static void addOrderByClause(StringBuilder demandQueryBuilder,String columnName) {
		demandQueryBuilder.append(" ORDER BY " + columnName);
	}

	private static void addPagingClause(StringBuilder demandQueryBuilder, List<Object> preparedStatementValues) {
		demandQueryBuilder.append(" LIMIT ?");
		preparedStatementValues.add(500);
		demandQueryBuilder.append(" OFFSET ?");
		preparedStatementValues.add(0);
	}

	private static boolean addAndClause(StringBuilder queryString) {
		queryString.append(" AND ");
		return true;
	}
	
	private static String getIdQueryForStrings(Set<String> idList) {

		StringBuilder query = new StringBuilder();
		if (!idList.isEmpty()) {

			String[] list = idList.toArray(new String[idList.size()]);
			query.append("'"+list[0]+"'");
			for (int i = 1; i < idList.size(); i++) {
				query.append("," + "'"+list[i]+"'");
			}
		}
		return query.append(")").toString();
	}
}