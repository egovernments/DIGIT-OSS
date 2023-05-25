package org.egov.wf.repository;


import org.egov.wf.repository.querybuilder.EscalationQueryBuilder;
import org.egov.wf.web.models.EscalationSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
public class EscalationRepository {



    private JdbcTemplate jdbcTemplate;

    private EscalationQueryBuilder queryBuilder;

    @Autowired
    public EscalationRepository(JdbcTemplate jdbcTemplate, EscalationQueryBuilder queryBuilder) {
        this.jdbcTemplate = jdbcTemplate;
        this.queryBuilder = queryBuilder;
    }


    /**
     * Fetches uuids that haas to be escalated
     * @param criteria
     * @return
     */
    public List<String> getBusinessIds(EscalationSearchCriteria criteria){

        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getEscalationQuery(criteria, preparedStmtList);
        List<String> businessIds = jdbcTemplate.query(query, preparedStmtList.toArray(),  new SingleColumnRowMapper<>(String.class));
        return  businessIds;

    }


}
