package org.egov.egf.master.persistence.repository;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.FinancialConfiguration;
import org.egov.egf.master.domain.model.FinancialConfigurationSearch;
import org.egov.egf.master.persistence.entity.FinancialConfigurationEntity;
import org.egov.egf.master.persistence.entity.FinancialConfigurationSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FinancialConfigurationJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(FinancialConfigurationJdbcRepository.class);

    static {
        LOG.debug("init financialConfiguration");
        init(FinancialConfigurationEntity.class);
        LOG.debug("end init financialConfiguration");
    }

    public FinancialConfigurationJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public FinancialConfigurationEntity create(FinancialConfigurationEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public FinancialConfigurationEntity update(FinancialConfigurationEntity entity) {
        super.update(entity);
        return entity;

    }

    public Pagination<FinancialConfiguration> search(FinancialConfigurationSearch domain) {
        FinancialConfigurationSearchEntity financialConfigurationSearchEntity = new FinancialConfigurationSearchEntity();
        financialConfigurationSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (financialConfigurationSearchEntity.getSortBy() != null
                && !financialConfigurationSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(financialConfigurationSearchEntity.getSortBy());
            validateEntityFieldName(financialConfigurationSearchEntity.getSortBy(), FinancialConfigurationEntity.class);
        }

        String orderBy = "order by name";
        if (financialConfigurationSearchEntity.getSortBy() != null
                && !financialConfigurationSearchEntity.getSortBy().isEmpty()) {
            orderBy = "order by " + financialConfigurationSearchEntity.getSortBy();
        }

        searchQuery = searchQuery.replace(":tablename", FinancialConfigurationEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (financialConfigurationSearchEntity.getTenantId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", financialConfigurationSearchEntity.getTenantId());
        }
        if (financialConfigurationSearchEntity.getId() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("id =:id");
            paramValues.put("id", financialConfigurationSearchEntity.getId());
        }
        if (financialConfigurationSearchEntity.getIds() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("id in(:ids) ");
            paramValues.put("ids", new ArrayList<String>(Arrays.asList(financialConfigurationSearchEntity.getIds().split(","))));
        }
        if (financialConfigurationSearchEntity.getName() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("name =:name");
            paramValues.put("name", financialConfigurationSearchEntity.getName());
        }
        if (financialConfigurationSearchEntity.getDescription() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("description =:description");
            paramValues.put("description", financialConfigurationSearchEntity.getDescription());
        }

        if (financialConfigurationSearchEntity.getModule() != null) {
            if (params.length() > 0) {
                params.append(" and ");
            }
            params.append("module =:module");
            paramValues.put("module", financialConfigurationSearchEntity.getModule());
        }

        Pagination<FinancialConfiguration> page = new Pagination<>();
        if (financialConfigurationSearchEntity.getOffset() != null) {
            page.setOffset(financialConfigurationSearchEntity.getOffset());
        }
        if (financialConfigurationSearchEntity.getPageSize() != null) {
            page.setPageSize(financialConfigurationSearchEntity.getPageSize());
        }

        if (params.length() > 0) {

            searchQuery = searchQuery.replace(":condition", " where " +
                    params.toString());

        } else

            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<FinancialConfiguration>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(FinancialConfigurationEntity.class);

        List<FinancialConfigurationEntity> financialConfigurationEntities = namedParameterJdbcTemplate
                .query(searchQuery.toString(), paramValues, row);

        page.setTotalResults(financialConfigurationEntities.size());

        List<FinancialConfiguration> financialconfigurations = new ArrayList<>();
        for (FinancialConfigurationEntity financialConfigurationEntity : financialConfigurationEntities) {

            financialconfigurations.add(financialConfigurationEntity.toDomain());
        }
        page.setPagedData(financialconfigurations);

        return page;
    }

    public FinancialConfigurationEntity findById(FinancialConfigurationEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list) {
            paramValues.put(s, getValue(getField(entity, s), entity));
        }

        List<FinancialConfigurationEntity> financialconfigurations = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(FinancialConfigurationEntity.class));
        if (financialconfigurations.isEmpty()) {
            return null;
        } else {
            return financialconfigurations.get(0);
        }

    }

}