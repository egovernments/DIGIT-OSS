package org.egov.report.repository;

import java.util.Date;
import java.util.List;
import java.util.Map;
import org.egov.report.repository.builder.ReportQueryBuilder;
import org.egov.swagger.model.ReportDefinition;
import org.egov.swagger.model.ReportRequest;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ReportRepository {
  
  @Autowired
  private JdbcTemplate jdbcTemplate;
  
  @Autowired
  private ReportQueryBuilder reportQueryBuilder;
  
  @Value("${max.sql.execution.time.millisec:45000}")
  private Long maxExecutionTime;
  
  public static final Logger LOGGER = LoggerFactory.getLogger(ReportRepository.class);
  
  public List<Map<String, Object>> getData(ReportRequest reportRequest, ReportDefinition reportDefinition,String authToken) {
    Long userId = reportRequest.getRequestInfo().getUserInfo() == null ? null : reportRequest.getRequestInfo().getUserInfo().getId();
    String query = reportQueryBuilder.buildQuery(reportRequest.getSearchParams(),reportRequest.getTenantId(),reportDefinition,authToken, userId);
    Long startTime = new Date().getTime();
    List<Map<String, Object>> maps = null;
    LOGGER.info("final query:"+query);
    try {
    maps = jdbcTemplate.queryForList(query);
    } catch(Exception e){
      LOGGER.info("Query Execution Failed: ",e);
      throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.toString(), e.getMessage());
    }
    Long endTime = new Date().getTime();
    Long totalExecutionTime = endTime-startTime;
    LOGGER.info("total query execution time taken in millisecount:"+totalExecutionTime);
    if(endTime-startTime>maxExecutionTime)
      LOGGER.error("Sql query is taking time query:"+query);
    return maps;
  }

}
