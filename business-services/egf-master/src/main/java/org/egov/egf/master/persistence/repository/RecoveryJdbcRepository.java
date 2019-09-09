package org.egov.egf.master.persistence.repository;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.persistence.entity.FundEntity;
import org.egov.egf.master.persistence.entity.RecoveryEntity;
import org.egov.egf.master.persistence.entity.RecoverySearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class RecoveryJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(RecoveryJdbcRepository.class);

    static {
        LOG.debug("init recovery");
        init(RecoveryEntity.class);
        LOG.debug("end init recovery");
    }

    public RecoveryJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public RecoveryEntity create(RecoveryEntity entity) {
        super.create(entity);
        return entity;
    }

    public RecoveryEntity update(RecoveryEntity entity) {
        super.update(entity);
        return entity;

    }

    public Pagination<Recovery> search(RecoverySearch domain) {
        RecoverySearchEntity recoverySearchEntity = new RecoverySearchEntity();
        recoverySearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (recoverySearchEntity.getSortBy() != null && !recoverySearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(recoverySearchEntity.getSortBy());
            validateEntityFieldName(recoverySearchEntity.getSortBy(), RecoveryEntity.class);
        }

        String orderBy = "order by name";
        if (recoverySearchEntity.getSortBy() != null && !recoverySearchEntity.getSortBy().isEmpty()) {
            orderBy = "order by " + recoverySearchEntity.getSortBy();
        }

        searchQuery = searchQuery.replace(":tablename", RecoveryEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (recoverySearchEntity.getTenantId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", recoverySearchEntity.getTenantId());
        }
        if (recoverySearchEntity.getId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("id =:id");
            paramValues.put("id", recoverySearchEntity.getId());
        }
        if (recoverySearchEntity.getCode() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("code =:code");
            paramValues.put("code", recoverySearchEntity.getCode());
        }
        if (recoverySearchEntity.getName() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("name =:name");
            paramValues.put("name", recoverySearchEntity.getName());
        }
        if (recoverySearchEntity.getActive() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("active =:active");
            paramValues.put("active", recoverySearchEntity.getActive());
        }

        Pagination<Recovery> page = new Pagination<>();
        if (recoverySearchEntity.getOffset() != null) {
            page.setOffset(recoverySearchEntity.getOffset());
        }
        if (recoverySearchEntity.getPageSize() != null) {
            page.setPageSize(recoverySearchEntity.getPageSize());
        }


        if (params.length() > 0) {

            searchQuery = searchQuery.replace(":condition", " where " +
                    params.toString());

        } else

            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<Recovery>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(RecoveryEntity.class);

        List<RecoveryEntity> recoveryEntities = namedParameterJdbcTemplate.query(searchQuery.toString(), paramValues, row);

        page.setTotalResults(recoveryEntities.size());

        List<Recovery> recoveries = new ArrayList<>();
        for (RecoveryEntity recoveryEntity : recoveryEntities) {

            recoveries.add(recoveryEntity.toDomain());
        }
        page.setPagedData(recoveries);

        return page;
    }

    public RecoveryEntity findById(RecoveryEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list) {
            paramValues.put(s, getValue(getField(entity, s), entity));
        }

        List<RecoveryEntity> recovery = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(RecoveryEntity.class));
        if (recovery.isEmpty()) {
            return null;
        } else {
            return recovery.get(0);
        }

    }

}