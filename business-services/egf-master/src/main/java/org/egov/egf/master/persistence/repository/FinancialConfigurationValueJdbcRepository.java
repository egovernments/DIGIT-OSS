package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.FinancialConfigurationValue;
import org.egov.egf.master.domain.model.FinancialConfigurationValueSearch;
import org.egov.egf.master.persistence.entity.FinancialConfigurationValueEntity;
import org.egov.egf.master.persistence.entity.FinancialConfigurationValueSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FinancialConfigurationValueJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(FinancialConfigurationValueJdbcRepository.class);

    static {
        LOG.debug("init financialConfigurationValue");
        init(FinancialConfigurationValueEntity.class);
        LOG.debug("end init financialConfigurationValue");
    }

    public FinancialConfigurationValueJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public FinancialConfigurationValueEntity create(FinancialConfigurationValueEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public FinancialConfigurationValueEntity update(FinancialConfigurationValueEntity entity) {
        super.update(entity);
        return entity;

    }

    public Pagination<FinancialConfigurationValue> search(FinancialConfigurationValueSearch domain) {
        FinancialConfigurationValueSearchEntity financialConfigurationValueSearchEntity = new FinancialConfigurationValueSearchEntity();
        financialConfigurationValueSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (financialConfigurationValueSearchEntity.getSortBy() != null
                && !financialConfigurationValueSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(financialConfigurationValueSearchEntity.getSortBy());
            validateEntityFieldName(financialConfigurationValueSearchEntity.getSortBy(),
                    FinancialConfigurationValueEntity.class);
        }

        String orderBy = "order by id";
        if (financialConfigurationValueSearchEntity.getSortBy() != null
                && !financialConfigurationValueSearchEntity.getSortBy().isEmpty()) {
            orderBy = "order by " + financialConfigurationValueSearchEntity.getSortBy();
        }

        searchQuery = searchQuery.replace(":tablename", FinancialConfigurationValueEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (financialConfigurationValueSearchEntity.getTenantId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", financialConfigurationValueSearchEntity.getTenantId());
        }
        if (financialConfigurationValueSearchEntity.getId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("id =:id");
            paramValues.put("id", financialConfigurationValueSearchEntity.getId());
        }
        if (financialConfigurationValueSearchEntity.getFinancialConfigurationId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("financialConfigurationId =:financialConfiguration");
            paramValues.put("financialConfiguration",
                    financialConfigurationValueSearchEntity.getFinancialConfigurationId());
        }
        if (financialConfigurationValueSearchEntity.getValue() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("value =:value");
            paramValues.put("value", financialConfigurationValueSearchEntity.getValue());
        }
        if (financialConfigurationValueSearchEntity.getEffectiveFrom() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("effectiveFrom =:effectiveFrom");
            paramValues.put("effectiveFrom", financialConfigurationValueSearchEntity.getEffectiveFrom());
        }

        Pagination<FinancialConfigurationValue> page = new Pagination<>();
        if (financialConfigurationValueSearchEntity.getOffset() != null) {
            page.setOffset(financialConfigurationValueSearchEntity.getOffset());
        }
        if (financialConfigurationValueSearchEntity.getPageSize() != null) {
            page.setPageSize(financialConfigurationValueSearchEntity.getPageSize());
        }

        if (params.length() > 0) {

            searchQuery = searchQuery.replace(":condition", " where " + params.toString());

        } else
            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<FinancialConfigurationValue>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(FinancialConfigurationValueEntity.class);

        List<FinancialConfigurationValueEntity> financialConfigurationValueEntities = namedParameterJdbcTemplate
                .query(searchQuery.toString(), paramValues, row);

        page.setTotalResults(financialConfigurationValueEntities.size());

        List<FinancialConfigurationValue> financialconfigurationvalues = new ArrayList<>();
        for (FinancialConfigurationValueEntity financialConfigurationValueEntity : financialConfigurationValueEntities) {

            financialconfigurationvalues.add(financialConfigurationValueEntity.toDomain());
        }
        page.setPagedData(financialconfigurationvalues);

        return page;

    }

    public FinancialConfigurationValueEntity findById(FinancialConfigurationValueEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list) {
            paramValues.put(s, getValue(getField(entity, s), entity));
        }

        List<FinancialConfigurationValueEntity> financialconfigurationvalues = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(FinancialConfigurationValueEntity.class));
        if (financialconfigurationvalues.isEmpty()) {
            return null;
        } else {
            return financialconfigurationvalues.get(0);
        }

    }

}