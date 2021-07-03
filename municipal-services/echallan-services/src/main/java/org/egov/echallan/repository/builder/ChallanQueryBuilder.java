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


      private final String paginationWrapper = "SELECT * FROM " +
              "(SELECT *, DENSE_RANK() OVER (ORDER BY challan_lastModifiedTime DESC , challan_id) offset_ FROM " +
              "({})" +
              " result) result_offset " +
              "WHERE offset_ > ? AND offset_ <= ?";

      public static final String FILESTOREID_UPDATE_SQL = "UPDATE eg_echallan SET filestoreid=? WHERE id=?";
      
      public static final String CANCEL_RECEIPT_UPDATE_SQL = "UPDATE eg_echallan SET applicationStatus='ACTIVE' WHERE challanNo=? and businessService=?";



    public String getChallanSearchQuery(SearchCriteria criteria, List<Object> preparedStmtList) {

        StringBuilder builder = new StringBuilder(QUERY);

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
                addClauseIfRequired(preparedStmtList, builder);
                builder.append("  challan.applicationstatus = ? ");
                preparedStmtList.add(criteria.getStatus());
            }


        }

        return addPaginationWrapper(builder.toString(),preparedStmtList,criteria);
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





}
