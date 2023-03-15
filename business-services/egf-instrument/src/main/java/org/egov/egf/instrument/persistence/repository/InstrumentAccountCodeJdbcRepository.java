package org.egov.egf.instrument.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentAccountCodeEntity;
import org.egov.egf.instrument.persistence.entity.InstrumentAccountCodeSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class InstrumentAccountCodeJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(InstrumentAccountCodeJdbcRepository.class);

    static {
        LOG.debug("init instrumentAccountCode");
        init(InstrumentAccountCodeEntity.class);
        LOG.debug("end init instrumentAccountCode");
    }

    public InstrumentAccountCodeJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }

    public InstrumentAccountCodeEntity create(InstrumentAccountCodeEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public InstrumentAccountCodeEntity update(InstrumentAccountCodeEntity entity) {
        super.update(entity);
        return entity;

    }

    public InstrumentAccountCodeEntity delete(InstrumentAccountCodeEntity entity) {
        super.delete(InstrumentAccountCodeEntity.TABLE_NAME, entity.getId());
        return entity;
    }

    public Pagination<InstrumentAccountCode> search(InstrumentAccountCodeSearch domain) {
        InstrumentAccountCodeSearchEntity instrumentAccountCodeSearchEntity = new InstrumentAccountCodeSearchEntity();
        instrumentAccountCodeSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (instrumentAccountCodeSearchEntity.getSortBy() != null
                && !instrumentAccountCodeSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(instrumentAccountCodeSearchEntity.getSortBy());
            validateEntityFieldName(instrumentAccountCodeSearchEntity.getSortBy(), InstrumentAccountCodeEntity.class);
        }

        String orderBy = "order by id";
        if (instrumentAccountCodeSearchEntity.getSortBy() != null
                && !instrumentAccountCodeSearchEntity.getSortBy().isEmpty())
            orderBy = "order by " + instrumentAccountCodeSearchEntity.getSortBy();

        searchQuery = searchQuery.replace(":tablename", InstrumentAccountCodeEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (instrumentAccountCodeSearchEntity.getTenantId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", instrumentAccountCodeSearchEntity.getTenantId());
        }
        if (instrumentAccountCodeSearchEntity.getId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id =:id");
            paramValues.put("id", instrumentAccountCodeSearchEntity.getId());
        }
        if (instrumentAccountCodeSearchEntity.getInstrumentTypeId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("instrumentTypeId =:instrumentType");
            paramValues.put("instrumentType", instrumentAccountCodeSearchEntity.getInstrumentTypeId());
        }
        if (instrumentAccountCodeSearchEntity.getAccountCodeId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("accountCodeId =:accountCode");
            paramValues.put("accountCode", instrumentAccountCodeSearchEntity.getAccountCodeId());
        }
        if (instrumentAccountCodeSearchEntity.getIds() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id in (:ids)");
            paramValues.put("ids", instrumentAccountCodeSearchEntity.getIds());
        }

        Pagination<InstrumentAccountCode> page = new Pagination<>();
        if (instrumentAccountCodeSearchEntity.getOffset() != null)
            page.setOffset(instrumentAccountCodeSearchEntity.getOffset());
        if (instrumentAccountCodeSearchEntity.getPageSize() != null)
            page.setPageSize(instrumentAccountCodeSearchEntity.getPageSize());

        if (params.length() > 0)
            searchQuery = searchQuery.replace(":condition", " where " + params.toString());
        else

            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<InstrumentAccountCode>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(InstrumentAccountCodeEntity.class);

        List<InstrumentAccountCodeEntity> instrumentAccountCodeEntities = namedParameterJdbcTemplate
                .query(searchQuery.toString(), paramValues, row);

        page.setTotalResults(instrumentAccountCodeEntities.size());

        List<InstrumentAccountCode> instrumentaccountcodes = new ArrayList<>();
        for (InstrumentAccountCodeEntity instrumentAccountCodeEntity : instrumentAccountCodeEntities)
            instrumentaccountcodes.add(instrumentAccountCodeEntity.toDomain());
        page.setPagedData(instrumentaccountcodes);

        return page;
    }

    public InstrumentAccountCodeEntity findById(InstrumentAccountCodeEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list)
            paramValues.put(s, getValue(getField(entity, s), entity));

        List<InstrumentAccountCodeEntity> instrumentaccountcodes = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(InstrumentAccountCodeEntity.class));
        if (instrumentaccountcodes.isEmpty())
            return null;
        else
            return instrumentaccountcodes.get(0);

    }

}