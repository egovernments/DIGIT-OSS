package org.egov.enc.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.enc.models.Tenant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@ConditionalOnProperty(name = "tenant.service", havingValue = "DBTenantService")
@Repository
public class DBTenantRepository {
    private final JdbcTemplate jdbcTemplate;

    private static final String selectTenantsQuery = "SELECT * FROM eg_tenants";
    @Autowired
    public DBTenantRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Tenant> fetchTenants() {
        return jdbcTemplate.query(selectTenantsQuery, new BeanPropertyRowMapper<>(Tenant.class));
    }
}
