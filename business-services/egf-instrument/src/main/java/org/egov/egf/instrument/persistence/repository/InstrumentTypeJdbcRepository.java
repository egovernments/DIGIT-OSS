package org.egov.egf.instrument.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentTypeEntity;
import org.egov.egf.instrument.persistence.entity.InstrumentTypeSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class InstrumentTypeJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(InstrumentTypeJdbcRepository.class);

    static {
        LOG.debug("init instrumentType");
        init(InstrumentTypeEntity.class);
        LOG.debug("end init instrumentType");
    }

    public InstrumentTypeJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }

    public InstrumentTypeEntity create(InstrumentTypeEntity entity) {

        // entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public InstrumentTypeEntity update(InstrumentTypeEntity entity) {
        super.update(entity);
        return entity;

    }

    public InstrumentTypeEntity delete(InstrumentTypeEntity entity) {
        super.delete(InstrumentTypeEntity.TABLE_NAME, entity.getId());
        return entity;
    }

    public Pagination<InstrumentType> search(InstrumentTypeSearch domain) {
        InstrumentTypeSearchEntity instrumentTypeSearchEntity = new InstrumentTypeSearchEntity();
        instrumentTypeSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (instrumentTypeSearchEntity.getSortBy() != null && !instrumentTypeSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(instrumentTypeSearchEntity.getSortBy());
            validateEntityFieldName(instrumentTypeSearchEntity.getSortBy(), InstrumentTypeEntity.class);
        }

        String orderBy = "order by id";
        if (instrumentTypeSearchEntity.getSortBy() != null && !instrumentTypeSearchEntity.getSortBy().isEmpty())
            orderBy = "order by " + instrumentTypeSearchEntity.getSortBy();

        searchQuery = searchQuery.replace(":tablename", InstrumentTypeEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (instrumentTypeSearchEntity.getTenantId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", instrumentTypeSearchEntity.getTenantId());
        }
        if (instrumentTypeSearchEntity.getId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id =:id");
            paramValues.put("id", instrumentTypeSearchEntity.getId());
        }
        if (instrumentTypeSearchEntity.getName() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("name =:name");
            paramValues.put("name", instrumentTypeSearchEntity.getName());
        }
        if (instrumentTypeSearchEntity.getDescription() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("description =:description");
            paramValues.put("description", instrumentTypeSearchEntity.getDescription());
        }
        if (instrumentTypeSearchEntity.getActive() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("active =:active");
            paramValues.put("active", instrumentTypeSearchEntity.getActive());
        }

        if (instrumentTypeSearchEntity.getIds() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id in (:ids)");
            paramValues.put("ids", instrumentTypeSearchEntity.getIds());
        }

        Pagination<InstrumentType> page = new Pagination<>();
        if (instrumentTypeSearchEntity.getOffset() != null)
            page.setOffset(instrumentTypeSearchEntity.getOffset());
        if (instrumentTypeSearchEntity.getPageSize() != null)
            page.setPageSize(instrumentTypeSearchEntity.getPageSize());

        if (params.length() > 0)
            searchQuery = searchQuery.replace(":condition", " where " + params.toString());
        else
            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<InstrumentType>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(InstrumentTypeEntity.class);

        /*
         * searchQuery= "select * from egf_instrumenttype egf_instrumenttype, egf_instrumenttypeproperty properties where " +
         * "egf_instrumenttype.name=properties.instrumentTypeId";
         */

        List<InstrumentTypeEntity> instrumentTypeEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
                paramValues, row);

        page.setTotalResults(instrumentTypeEntities.size());

        List<InstrumentType> instrumenttypes = new ArrayList<>();
        for (InstrumentTypeEntity instrumentTypeEntity : instrumentTypeEntities)
            instrumenttypes.add(instrumentTypeEntity.toDomain());
        page.setPagedData(instrumenttypes);

        return page;
    }

    public InstrumentTypeEntity findById(InstrumentTypeEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list)
            paramValues.put(s, getValue(getField(entity, s), entity));

        List<InstrumentTypeEntity> instrumenttypes = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(InstrumentTypeEntity.class));
        if (instrumenttypes.isEmpty())
            return null;
        else
            return instrumenttypes.get(0);

    }

}