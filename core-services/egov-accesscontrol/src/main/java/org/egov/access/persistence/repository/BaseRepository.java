package org.egov.access.persistence.repository;


import lombok.extern.slf4j.Slf4j;
import org.egov.access.persistence.repository.querybuilder.BaseQueryBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class BaseRepository {

    private JdbcTemplate jdbcTemplate;

    public BaseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Object> run(BaseQueryBuilder queryBuilder, RowMapper rowMapper) {
        String query = queryBuilder.build();
        log.debug("Query : " + query);
        return jdbcTemplate.query(query, rowMapper);
    }
}
