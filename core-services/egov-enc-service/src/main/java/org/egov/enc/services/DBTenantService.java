package org.egov.enc.services;

import org.egov.enc.models.Tenant;
import org.egov.enc.repository.DBTenantRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@ConditionalOnProperty(name = "tenant.service", havingValue = "DBTenantService")
@Service
public class DBTenantService implements TenantService {
    private final DBTenantRepository dbTenantRepository;

    public DBTenantService(DBTenantRepository dbTenantRepository) {
        this.dbTenantRepository = dbTenantRepository;

    }

    @Override
    public List<String> getTenantIds() {
        return dbTenantRepository.fetchTenants()
                .stream().map(Tenant::getTenantId)
                .collect(Collectors.toList());
    }
}
