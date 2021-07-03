package org.egov.egf.instrument.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.persistence.entity.SurrenderReasonEntity;
import org.egov.egf.instrument.persistence.entity.SurrenderReasonSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SurrenderReasonJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(SurrenderReasonJdbcRepository.class);

    static {
        LOG.debug("init surrenderReason");
        init(SurrenderReasonEntity.class);
        LOG.debug("end init surrenderReason");
    }

    public SurrenderReasonJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }

    public SurrenderReasonEntity create(SurrenderReasonEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public SurrenderReasonEntity update(SurrenderReasonEntity entity) {
        super.update(entity);
        return entity;

    }

    public SurrenderReasonEntity delete(SurrenderReasonEntity entity) {
        super.delete(SurrenderReasonEntity.TABLE_NAME, entity.getId());
        return entity;
    }

    public Pagination<SurrenderReason> search(SurrenderReasonSearch domain) {
        SurrenderReasonSearchEntity surrenderReasonSearchEntity = new SurrenderReasonSearchEntity();
        surrenderReasonSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (surrenderReasonSearchEntity.getSortBy() != null && !surrenderReasonSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(surrenderReasonSearchEntity.getSortBy());
            validateEntityFieldName(surrenderReasonSearchEntity.getSortBy(), SurrenderReasonEntity.class);
        }

        String orderBy = "order by id";
        if (surrenderReasonSearchEntity.getSortBy() != null && !surrenderReasonSearchEntity.getSortBy().isEmpty())
            orderBy = "order by " + surrenderReasonSearchEntity.getSortBy();

        searchQuery = searchQuery.replace(":tablename", SurrenderReasonEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (surrenderReasonSearchEntity.getTenantId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", surrenderReasonSearchEntity.getTenantId());
        }
        if (surrenderReasonSearchEntity.getId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id =:id");
            paramValues.put("id", surrenderReasonSearchEntity.getId());
        }
        if (surrenderReasonSearchEntity.getName() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("name =:name");
            paramValues.put("name", surrenderReasonSearchEntity.getName());
        }
        if (surrenderReasonSearchEntity.getDescription() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("description =:description");
            paramValues.put("description", surrenderReasonSearchEntity.getDescription());
        }
        if (surrenderReasonSearchEntity.getIds() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id in (:ids)");
            paramValues.put("ids", surrenderReasonSearchEntity.getIds());
        }

        Pagination<SurrenderReason> page = new Pagination<>();
        if (surrenderReasonSearchEntity.getOffset() != null)
            page.setOffset(surrenderReasonSearchEntity.getOffset());
        if (surrenderReasonSearchEntity.getPageSize() != null)
            page.setPageSize(surrenderReasonSearchEntity.getPageSize());

        if (params.length() > 0)
            searchQuery = searchQuery.replace(":condition", " where " + params.toString());
        else

            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<SurrenderReason>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(SurrenderReasonEntity.class);

        List<SurrenderReasonEntity> surrenderReasonEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
                paramValues, row);

        page.setTotalResults(surrenderReasonEntities.size());

        List<SurrenderReason> surrenderreasons = new ArrayList<>();
        for (SurrenderReasonEntity surrenderReasonEntity : surrenderReasonEntities)
            surrenderreasons.add(surrenderReasonEntity.toDomain());
        page.setPagedData(surrenderreasons);

        return page;
    }

    public SurrenderReasonEntity findById(SurrenderReasonEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list)
            paramValues.put(s, getValue(getField(entity, s), entity));

        List<SurrenderReasonEntity> surrenderreasons = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(SurrenderReasonEntity.class));
        if (surrenderreasons.isEmpty())
            return null;
        else
            return surrenderreasons.get(0);

    }

}