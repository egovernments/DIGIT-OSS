package org.egov.nationaldashboardingest.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.nationaldashboardingest.repository.querybuilder.NSSQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class IngestDataRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private NSSQueryBuilder queryBuilder;

    public Boolean findIfRecordExists(List<String> keyDataToSearch) {
        List<Object> preparedStmtList = new ArrayList<>();
        String sql = queryBuilder.getNSSSearchQuery(keyDataToSearch, preparedStmtList);
        log.info("Verification query: " + sql);
        Boolean recordsFound = jdbcTemplate.queryForObject(sql, preparedStmtList.toArray(), Boolean.class);
        return recordsFound;
    }
}
