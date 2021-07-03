package org.egov.demand.repository.querybuilder;

import java.util.Collection;
import java.util.List;

import org.egov.demand.model.BillSearchCriteria;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class BillQueryBuilder {
	
	public static final String REPLACE_STRING = "{replace}";
	
	public static final String BILL_STATUS_UPDATE_QUERY = "UPDATE egbs_bill_v1 SET status=? WHERE status='ACTIVE' ";
	
	public static final String BILL_STATUS_UPDATE_BATCH_QUERY = "UPDATE egbs_bill_v1 SET status=? WHERE id = ?";
	
	public static final String INSERT_BILL_QUERY = "INSERT into egbs_bill_v1 "
			+"(id, tenantid, payername, payeraddress, payeremail, isactive, iscancelled, createdby, createddate, lastmodifiedby, lastmodifieddate, mobilenumber, status, additionaldetails)"
			+"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	
	public static final String INSERT_BILLDETAILS_QUERY = "INSERT into egbs_billdetail_v1 "
			+"(id, tenantid, billid, demandid, fromperiod, toperiod, businessservice, billno, billdate, consumercode, consumertype, billdescription, displaymessage, "
			+ "minimumamount, totalamount, callbackforapportioning, partpaymentallowed, collectionmodesnotallowed, "
			+ "createdby, createddate, lastmodifiedby, lastmodifieddate, isadvanceallowed, expirydate,additionaldetails)"
			+"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	
	public static final String INSERT_BILLACCOUNTDETAILS_QUERY = "INSERT into egbs_billaccountdetail_v1 "
			+"(id, tenantid, billdetail, demanddetailid, orderno, amount, adjustedamount, isactualdemand, purpose, "
			+ "createdby, createddate, lastmodifiedby, lastmodifieddate, taxheadcode)"
			+"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	
	
	
	public static final String BILL_MAX_QUERY = "WITH billresult AS ({replace}) SELECT * FROM billresult "
			+ " INNER JOIN (SELECT bd_consumercode, max(b_createddate) as maxdate FROM billresult GROUP BY bd_consumercode) as uniqbill"
			+ " ON uniqbill.bd_consumercode=billresult.bd_consumercode AND uniqbill.maxdate=billresult.b_createddate ";
	
	public static final String BILL_BASE_QUERY = "SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid,"
			+ " b.payername AS b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS b_fileStoreId,"
			+ " b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby, b.status as b_status,"
			+ " b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby, b.lastmodifieddate AS b_lastmodifieddate,"
			+ " bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS bd_tenantid,bd.businessservice AS bd_businessservice,"
			+ " bd.demandid,bd.fromperiod,bd.toperiod,"
			+ " bd.billno AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS bd_consumertype,"
			+ " bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage, bd.minimumamount AS bd_minimumamount,"
			+ " bd.totalamount AS bd_totalamount, bd.callbackforapportioning AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate,"
			+ " bd.partpaymentallowed AS bd_partpaymentallowed, bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS bd_collectionmodesnotallowed,"
			+ " ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail, ad.glcode AS ad_glcode,"
			+ " ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription,"
			+ " ad.amount AS ad_amount, ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode, ad.demanddetailid,"
			+ " ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose,"
			+ " b.additionaldetails as b_additionaldetails,  bd.additionaldetails as bd_additionaldetails "
			+ " FROM egbs_bill_v1 b"
			+ " LEFT OUTER JOIN egbs_billdetail_v1 bd ON b.id = bd.billid AND b.tenantid = bd.tenantid"
			+ " LEFT OUTER JOIN egbs_billaccountdetail_v1 ad ON bd.id = ad.billdetail AND bd.tenantid = ad.tenantid";
	
	public String getBillQuery(BillSearchCriteria billSearchCriteria, List<Object> preparedStatementValues){
		
		StringBuilder billQuery = new StringBuilder(BILL_BASE_QUERY);
		String tenantId = billSearchCriteria.getTenantId();
		String[] tenantIdChunks = tenantId.split("\\.");
		if(tenantIdChunks.length == 1){
			billQuery.append(" WHERE b.tenantid LIKE ? ");
			preparedStatementValues.add(billSearchCriteria.getTenantId() + '%');
		}else{
			billQuery.append(" WHERE b.tenantid = ? ");
			preparedStatementValues.add(billSearchCriteria.getTenantId());
		}
		addWhereClause(billQuery, preparedStatementValues, billSearchCriteria);
		StringBuilder maxQuery = addPagingClause(billQuery, preparedStatementValues, billSearchCriteria);
		
		return maxQuery.toString();
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void addWhereClause(final StringBuilder selectQuery, final List preparedStatementValues,
			final BillSearchCriteria searchBill) {
		
		if(!CollectionUtils.isEmpty(searchBill.getBillId())){
			selectQuery.append(" AND b.id in (");
			appendListToQuery(searchBill.getBillId(), preparedStatementValues, selectQuery);
		}

		if (searchBill.getStatus() != null) {
			selectQuery.append(" AND b.status = ?");
			preparedStatementValues.add(searchBill.getStatus().toString());
		}	

		if (searchBill.getEmail() != null) {
			selectQuery.append(" AND b.payeremail = ?");
			preparedStatementValues.add(searchBill.getEmail());
		}

		if (searchBill.getMobileNumber()!= null) {
			selectQuery.append(" AND b.mobileNumber = ?");
			preparedStatementValues.add(searchBill.getMobileNumber());
		}

		if (searchBill.getService() != null) {
			selectQuery.append(" AND bd.businessservice = ?");
			preparedStatementValues.add(searchBill.getService());
		}
		
		if (searchBill.getBillNumber() != null) {
			selectQuery.append(" AND bd.billno = ?");
			preparedStatementValues.add(searchBill.getBillNumber());
		}

		if (!CollectionUtils.isEmpty(searchBill.getConsumerCode())) {
			selectQuery.append(" AND bd.consumercode IN (");
			appendListToQuery(searchBill.getConsumerCode(), preparedStatementValues, selectQuery);
		}
	}
	
	@SuppressWarnings({"rawtypes" })
	private StringBuilder addPagingClause(final StringBuilder selectQuery, final List preparedStatementValues,
			final BillSearchCriteria searchBillCriteria) {
		
		StringBuilder maxQuery = new StringBuilder(BILL_MAX_QUERY.replace(REPLACE_STRING, selectQuery));

		if (searchBillCriteria.isOrderBy())
			maxQuery.append(" ORDER BY billresult.bd_consumercode ");

//		maxQuery.append(" LIMIT ?");
//		long pageSize = Integer.parseInt(applicationProperties.getCommonSearchDefaultLimit());
//		if (searchBillCriteria.getSize() != null)
//			pageSize = searchBillCriteria.getSize();
//		preparedStatementValues.add(pageSize); // Set limit to pageSize
//
//		// handle offset here
//		maxQuery.append(" OFFSET ?");
//		long pageNumber = 0; // Default pageNo is zero meaning first page
//		if (searchBillCriteria.getOffset() != null)
//			pageNumber = searchBillCriteria.getOffset() - 1;
//		preparedStatementValues.add(pageNumber * pageSize); // Set offset to
//															// pageNo * pageSize
		return maxQuery;
	}
	
	/**
	 * Bill expire query builder
	 * 
	 * @param billIds
	 * @param preparedStmtList
	 */
	public String getBillStatusUpdateQuery(List<String> consumerCodes, List<Object> preparedStmtList) {

		StringBuilder builder = new StringBuilder(BILL_STATUS_UPDATE_QUERY);

		if (!CollectionUtils.isEmpty(consumerCodes)) {

			builder.append(" AND id IN ( SELECT billid from egbs_billdetail_v1 where consumercode IN (");
			appendListToQuery(consumerCodes, preparedStmtList, builder);
			builder.append(")");
		}
		return builder.toString();
	}
	
	public String getBillStatusUpdateBatchQuery() {
		
		return BILL_STATUS_UPDATE_BATCH_QUERY;
	}
	/**
	 * @param billIds
	 * @param preparedStmtList
	 * @param query
	 */
	private void appendListToQuery(Collection<String> values, List<Object> preparedStmtList, StringBuilder query) {
		int length = values.size();
		String[] valueArray = values.toArray(new String[length]);

		for (int i = 0; i < length; i++) {
			query.append(" ?");
			if (i != length - 1)
				query.append(",");
			preparedStmtList.add(valueArray[i]);
		}
		query.append(")");
	}
}
