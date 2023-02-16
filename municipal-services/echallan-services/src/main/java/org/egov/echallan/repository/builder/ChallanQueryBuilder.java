package org.egov.echallan.repository.builder;

import lombok.extern.slf4j.Slf4j;

import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.SearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Slf4j
@Component
public class ChallanQueryBuilder {

    private ChallanConfiguration config;

    @Autowired
    public ChallanQueryBuilder(ChallanConfiguration config) {
        this.config = config;
    }

    private static final String INNER_JOIN_STRING = " INNER JOIN ";

    private static final String QUERY = "SELECT challan.*,chaladdr.*,challan.id as challan_id,challan.tenantid as challan_tenantId,challan.lastModifiedTime as " +
            "challan_lastModifiedTime,challan.createdBy as challan_createdBy,challan.lastModifiedBy as challan_lastModifiedBy,challan.createdTime as " +
            "challan_createdTime,chaladdr.id as chaladdr_id," +
            "challan.accountId as uuid,challan.description as description  FROM eg_echallan challan"
            +INNER_JOIN_STRING
            +"eg_challan_address chaladdr ON chaladdr.echallanid = challan.id";

    private static final String COUNT_QUERY = "SELECT COUNT(challan.id) " +
            "FROM eg_echallan challan"
            +INNER_JOIN_STRING
            +"eg_challan_address chaladdr ON chaladdr.echallanid = challan.id";

      private final String paginationWrapper = "SELECT * FROM " +
              "(SELECT *, DENSE_RANK() OVER (ORDER BY challan_lastModifiedTime DESC , challan_id) offset_ FROM " +
              "({})" +
              " result) result_offset " +
              "WHERE offset_ > ? AND offset_ <= ?";

      public static final String FILESTOREID_UPDATE_SQL = "UPDATE eg_echallan SET filestoreid=? WHERE id=?";
      
      public static final String CANCEL_RECEIPT_UPDATE_SQL = "UPDATE eg_echallan SET applicationStatus='ACTIVE' WHERE challanNo=? and businessService=?";

      public static final String CHALLAN_COUNT_QUERY = "SELECT applicationstatus, count(*)  FROM eg_echallan WHERE tenantid ";
      
      public static final String TOTAL_COLLECTION_QUERY = "SELECT sum(amountpaid) FROM egbs_billdetail_v1 INNER JOIN egcl_paymentdetail ON egbs_billdetail_v1.billid=egcl_paymentdetail.billid INNER JOIN eg_echallan ON consumercode=challanno WHERE eg_echallan.tenantid=? AND eg_echallan.applicationstatus='PAID' AND egcl_paymentdetail.createdtime>? ";
      
      public static final String TOTAL_SERVICES_QUERY = "SELECT count(distinct(businessservice)) FROM eg_echallan WHERE tenantid=? AND createdtime>? ";



    public String getChallanSearchQuery(SearchCriteria criteria, List<Object> preparedStmtList, boolean isCountQuery) {
        StringBuilder builder;

        if(isCountQuery)
        {
            builder = new StringBuilder(COUNT_QUERY);
        }
        else
        {
            builder = new StringBuilder(QUERY);
        }

        addBusinessServiceClause(criteria,preparedStmtList,builder);


        if(criteria.getAccountId()!=null){
            addClauseIfRequired(preparedStmtList,builder);
            builder.append(" challan.accountid = ? ");
            preparedStmtList.add(criteria.getAccountId());

            List<String> ownerIds = criteria.getUserIds();
            if(!CollectionUtils.isEmpty(ownerIds)) {
                builder.append(" OR (challan.accountid IN (").append(createQuery(ownerIds)).append(")");
                addToPreparedStatement(preparedStmtList,ownerIds);
                addBusinessServiceClause(criteria,preparedStmtList,builder);
            }
        }
        else {

            if (criteria.getTenantId() != null) {
                addClauseIfRequired(preparedStmtList, builder);
                builder.append(" challan.tenantid=? ");
                preparedStmtList.add(criteria.getTenantId());
            }
            List<String> ids = criteria.getIds();
            if (!CollectionUtils.isEmpty(ids)) {
                addClauseIfRequired(preparedStmtList, builder);
                builder.append(" challan.id IN (").append(createQuery(ids)).append(")");
                addToPreparedStatement(preparedStmtList, ids);
            }

            List<String> ownerIds = criteria.getUserIds();
            if (!CollectionUtils.isEmpty(ownerIds)) {
                addClauseIfRequired(preparedStmtList, builder);
                builder.append(" challan.accountid IN (").append(createQuery(ownerIds)).append(")");
                addToPreparedStatement(preparedStmtList, ownerIds);
                //addClauseIfRequired(preparedStmtList, builder);
            }

            if (criteria.getChallanNo() != null) {
                addClauseIfRequired(preparedStmtList, builder);
                builder.append("  challan.challanno = ? ");
                preparedStmtList.add(criteria.getChallanNo());
            }
            if (criteria.getStatus() != null) {
                List<String> status = Arrays.asList(criteria.getStatus().split(","));
                addClauseIfRequired(preparedStmtList, builder);
                builder.append(" challan.applicationstatus IN (").append(createQuery(status)).append(")");
                addToPreparedStatement(preparedStmtList, status);
            }

            if (criteria.getReceiptNumber() != null) {
                List<String> receiptNumbers = Arrays.asList(criteria.getReceiptNumber().split(","));
                addClauseIfRequired(preparedStmtList, builder);
                builder.append(" challan.receiptnumber IN (").append(createQuery(receiptNumbers)).append(")");
                addToPreparedStatement(preparedStmtList, receiptNumbers);
            }


        }

        if(isCountQuery)
        {
            return builder.toString();
        }
        else
        {
            return addPaginationWrapper(builder.toString(),preparedStmtList,criteria);
        }

    }

    private void addBusinessServiceClause(SearchCriteria criteria,List<Object> preparedStmtList,StringBuilder builder){
    	if(criteria.getBusinessService()!=null) {
    	List<String> businessServices = Arrays.asList(criteria.getBusinessService().split(","));
            addClauseIfRequired(preparedStmtList, builder);
            builder.append(" challan.businessservice IN (").append(createQuery(businessServices)).append(")");
            addToPreparedStatement(preparedStmtList, businessServices);
    }
    }

    private String createQuery(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for( int i = 0; i< length; i++){
            builder.append(" ?");
            if(i != length -1) builder.append(",");
        }
        return builder.toString();
    }

    private void addToPreparedStatement(List<Object> preparedStmtList,List<String> ids)
    {
        ids.forEach(id ->{ preparedStmtList.add(id);});
    }


    private String addPaginationWrapper(String query,List<Object> preparedStmtList,
                                      SearchCriteria criteria){
        int limit = config.getDefaultLimit();
        int offset = config.getDefaultOffset();
        String finalQuery = paginationWrapper.replace("{}",query);

        if(criteria.getLimit()!=null && criteria.getLimit()<=config.getMaxSearchLimit())
            limit = criteria.getLimit();

        if(criteria.getLimit()!=null && criteria.getLimit()>config.getMaxSearchLimit())
            limit = config.getMaxSearchLimit();

        if(criteria.getOffset()!=null)
            offset = criteria.getOffset();

        preparedStmtList.add(offset);
        preparedStmtList.add(limit+offset);

       return finalQuery;
    }


    private static void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND");
        }
    }

    public String getChallanCountQuery(String tenantId, List <Object> preparedStmtList ) {
        StringBuilder builder = new StringBuilder(CHALLAN_COUNT_QUERY);
        if(tenantId.equalsIgnoreCase(config.stateLevelTenantId)){
            builder.append("LIKE ? ");
            preparedStmtList.add(tenantId+"%");
        }
        else{
            builder.append("= ? ");
            preparedStmtList.add(tenantId);
        }
        builder.append("GROUP BY applicationstatus");
        return builder.toString();
    }


	public String getTotalCollectionQuery(String tenantId, List<Object> preparedStmtListTotalCollection) {
		
		StringBuilder query = new StringBuilder("");
		query.append(TOTAL_COLLECTION_QUERY);
		
		preparedStmtListTotalCollection.add(tenantId);
		
		// In order to get data of last 12 months, the months variables is pre-configured in application properties
    	int months = Integer.valueOf(config.getNumberOfMonths()) ;

    	Calendar calendar = Calendar.getInstance();

    	// To subtract 12 months from current time, we are adding -12 to the calendar instance, as subtract function is not in-built
    	calendar.add(Calendar.MONTH, -1*months);

    	// Converting the timestamp to milliseconds and adding it to prepared statement list
    	preparedStmtListTotalCollection.add(calendar.getTimeInMillis());
		
		return query.toString();
	}


	public String getTotalServicesQuery(String tenantId, List<Object> preparedStmtListTotalServices) {
		
		StringBuilder query = new StringBuilder("");
		query.append(TOTAL_SERVICES_QUERY);
		
		preparedStmtListTotalServices.add(tenantId);
		
		// In order to get data of last 12 months, the months variables is pre-configured in application properties
    	int months = Integer.valueOf(config.getNumberOfMonths()) ;

    	Calendar calendar = Calendar.getInstance();

    	// To subtract 12 months from current time, we are adding -12 to the calendar instance, as subtract function is not in-built
    	calendar.add(Calendar.MONTH, -1*months);

    	// Converting the timestamp to milliseconds and adding it to prepared statement list
    	preparedStmtListTotalServices.add(calendar.getTimeInMillis());
		
		return query.toString();
		
	}





}
