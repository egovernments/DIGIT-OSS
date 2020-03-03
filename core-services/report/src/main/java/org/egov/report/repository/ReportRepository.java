package org.egov.report.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.report.repository.builder.ReportQueryBuilder;
import org.egov.swagger.model.*;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import javax.annotation.*;
import java.util.*;

@Slf4j
@Repository
public class ReportRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private ReportQueryBuilder reportQueryBuilder;

    @Value("${max.sql.execution.time.millisec:45000}")
    private Long maxExecutionTime;

    @Value(("${report.query.timeout}"))
    public int queryExecutionTimeout;

    @PostConstruct
    private void init(){
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(this.jdbcTemplate);
        jdbcTemplate.setQueryTimeout(queryExecutionTimeout);
    }

    private Map<String, Object>  getQueryParameters(ReportRequest reportRequest) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        Long userId = reportRequest.getRequestInfo().getUserInfo() == null ? null : reportRequest.getRequestInfo().getUserInfo().getId();

        parameters.put("tenantId", reportRequest.getTenantId());
        parameters.put("userId",  userId);
        parameters.put("currentTime",  System.currentTimeMillis());

        for (SearchParam param :reportRequest.getSearchParams()) {
            parameters.put(param.getName(), param.getInput());
        }

        return parameters;
    }

    public String getQuery(ReportRequest reportRequest, ReportDefinition reportDefinition, String authToken) {
        Map<String, Object> parameters = getQueryParameters(reportRequest);
        String originalQuery = reportDefinition.getQuery();
        String query = originalQuery;
        Long userId = reportRequest.getRequestInfo().getUserInfo() == null ? null : reportRequest.getRequestInfo().getUserInfo().getId();

        for (SearchColumn param: reportDefinition.getSearchParams()){
            String value = "";
            if (parameters.containsKey(param.getName())) {
                value = param.getSearchClause();
            }

            query = query.replaceAll("\\$_" + param.getName(), value.replace("$","\\$"));
            log.info(query);
        }

        reportDefinition.setQuery(query);

        query = reportQueryBuilder.buildQuery(reportRequest.getSearchParams(), reportRequest.getTenantId(), reportDefinition, authToken, userId);
        return query;
    }

    public List<Map<String, Object>> getData(ReportRequest reportRequest, ReportDefinition reportDefinition, String authToken) throws CustomException {

        Long startTime = new Date().getTime();
        List<Map<String, Object>> maps = null;

        String query = getQuery(reportRequest, reportDefinition, authToken);
        Map<String, Object> parameters = getQueryParameters(reportRequest);

        MapSqlParameterSource params =  new MapSqlParameterSource(parameters);
        log.info("final query:" + query);
        try {

            maps = namedParameterJdbcTemplate.queryForList(query, params);
        } catch (DataAccessResourceFailureException ex) {
            log.info("Query Execution Failed Due To Timeout: ", ex);
            PSQLException cause = (PSQLException) ex.getCause();
            if (cause != null && cause.getSQLState().equals("57014")) {
                throw new CustomException("QUERY_EXECUTION_TIMEOUT", "Query failed, as it took more than: "+ (queryExecutionTimeout) + " seconds to execute");
            } else {
                throw ex;
            }
        } catch (Exception e) {
            log.info("Query Execution Failed: ", e);
            throw e;
        }

        Long endTime = new Date().getTime();
        Long totalExecutionTime = endTime - startTime;
        log.info("total query execution time taken in millisecount:" + totalExecutionTime);
        if (endTime - startTime > maxExecutionTime)
            log.error("Sql query is taking time query:" + query);
        return maps;
    }

}
