package digit.repository.querybuilder;

import digit.config.Configuration;
import digit.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Component
public class ServiceQueryBuilder {

    @Autowired
    private Configuration config;

    private static final String SELECT = " SELECT ";
    private static final String INNER_JOIN = " INNER JOIN ";
    private static final String LEFT_JOIN  =  " LEFT OUTER JOIN ";
    private static final String AND_QUERY = " AND ";

    private static final String IDS_WRAPPER_QUERY = " SELECT id FROM ({HELPER_TABLE}) temp ";
    private final String ORDERBY_CREATEDTIME = " ORDER BY service.createdtime DESC ";

    public String getServiceIdsQuery(ServiceSearchRequest serviceSearchRequest, List<Object> preparedStmtList) {
        ServiceCriteria criteria = serviceSearchRequest.getServiceCriteria();

        StringBuilder query = new StringBuilder(SELECT + " DISTINCT(service.id), service.createdtime ");
        query.append(" FROM eg_service service ");

        if(!ObjectUtils.isEmpty(criteria.getTenantId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.tenantid = ? ");
            preparedStmtList.add(criteria.getTenantId());
        }

        if(!CollectionUtils.isEmpty(criteria.getIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.id IN ( ").append(createQuery(criteria.getIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getIds());
        }

        if(!CollectionUtils.isEmpty(criteria.getServiceDefIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.servicedefid IN ( ").append(createQuery(criteria.getServiceDefIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getServiceDefIds());
        }

        if(!CollectionUtils.isEmpty(criteria.getReferenceIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.referenceid IN ( ").append(createQuery(criteria.getReferenceIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getReferenceIds());
        }

        if(!ObjectUtils.isEmpty(criteria.getAccountId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.accountid = ? ");
            preparedStmtList.add(criteria.getAccountId());
        }

        if(!ObjectUtils.isEmpty(criteria.getClientId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.clientid = ? ");
            preparedStmtList.add(criteria.getClientId());
        }

        // order services based on their createdtime in latest first manner
        query.append(ORDERBY_CREATEDTIME);

        if(ObjectUtils.isEmpty(serviceSearchRequest.getPagination()))
            prepareDefaultPaginationObject(serviceSearchRequest);

        // Pagination to limit results
        addPagination(query, preparedStmtList, serviceSearchRequest.getPagination());

        return IDS_WRAPPER_QUERY.replace("{HELPER_TABLE}", query.toString());
    }

    private void addClauseIfRequired(StringBuilder query, List<Object> preparedStmtList){
        if(preparedStmtList.isEmpty()){
            query.append(" WHERE ");
        }else{
            query.append(" AND ");
        }
    }

    private String createQuery(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for (int i = 0; i < length; i++) {
            builder.append(" ?");
            if (i != length - 1)
                builder.append(",");
        }
        return builder.toString();
    }

    private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
        ids.forEach(id -> {
            preparedStmtList.add(id);
        });
    }

    private void prepareDefaultPaginationObject(ServiceSearchRequest serviceSearchRequest) {
        Pagination pagination = new Pagination();
        pagination.setOffset(config.getDefaultOffset());
        pagination.setLimit(config.getDefaultLimit());
        serviceSearchRequest.setPagination(pagination);
    }

    private void addPagination(StringBuilder query, List<Object> preparedStmtList, Pagination pagination) {

        // Append offset
        query.append(" OFFSET ? ");
        preparedStmtList.add(ObjectUtils.isEmpty(pagination.getOffset()) ? config.getDefaultOffset() : pagination.getOffset());

        // Append limit
        query.append(" LIMIT ? ");
        preparedStmtList.add(ObjectUtils.isEmpty(pagination.getLimit()) ? config.getDefaultLimit() : pagination.getLimit());
    }


    public String getServiceSearchQuery(ServiceCriteria criteria, List<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder("SELECT service.id, service.tenantid,  service.servicedefid, service.referenceid, service.createdby, service.lastmodifiedby, service.createdtime, service.lastmodifiedtime, service.additionaldetails, service.accountid, service.clientid, "
                + "attribute_value.id as attribute_value_id, attribute_value.referenceid as attribute_value_referenceid, attribute_value.attributecode as attribute_value_attributecode, attribute_value.value as attribute_value_value, attribute_value.createdby as attribute_value_createdby, attribute_value.lastmodifiedby as attribute_value_lastmodifiedby, attribute_value.createdtime as attribute_value_createdtime, attribute_value.lastmodifiedtime as attribute_value_lastmodifiedtime, attribute_value.additionaldetails as attribute_value_additionaldetails "
                + "FROM eg_service as service "
                + "INNER JOIN eg_service_attribute_value as attribute_value ON "
                + "service.id=attribute_value.referenceid ");

        if(!ObjectUtils.isEmpty(criteria.getTenantId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.tenantid = ? ");
            preparedStmtList.add(criteria.getTenantId());
        }

        if(!CollectionUtils.isEmpty(criteria.getIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" service.id IN ( ").append(createQuery(criteria.getIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getIds());
        }


        return query.toString();
    }
}
