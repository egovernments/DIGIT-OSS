package org.egov.egf.instrument.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.instrument.domain.model.DishonorReason;
import org.egov.egf.instrument.domain.model.DishonorReasonSearch;
import org.egov.egf.instrument.persistence.entity.DishonorReasonEntity;
import org.egov.egf.instrument.persistence.entity.DishonorReasonSearchEntity;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DishonorReasonJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(DishonorReasonJdbcRepository.class);

    static {
        LOG.debug("init dishonorrReason");
        init(DishonorReasonEntity.class);
        LOG.debug("end init dishonorrReason");
    }

    public DishonorReasonJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }

    public DishonorReasonEntity create(DishonorReasonEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public DishonorReasonEntity update(DishonorReasonEntity entity) {
        super.update(entity);
        return entity;

    }

    public DishonorReasonEntity delete(DishonorReasonEntity entity) {
        super.delete(DishonorReasonEntity.TABLE_NAME, entity.getId());
        return entity;
    }
    
    @Override
    public void delete(final String tenantId, final String instrumentId) {
        super.delete(DishonorReasonEntity.TABLE_NAME, tenantId, "instrumentid", instrumentId);
    }

    public Pagination<DishonorReason> search(DishonorReasonSearch domain) {
    	DishonorReasonSearchEntity dishonorReasonSearchEntity = new DishonorReasonSearchEntity();
    	dishonorReasonSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (dishonorReasonSearchEntity.getSortBy() != null && !dishonorReasonSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(dishonorReasonSearchEntity.getSortBy());
            validateEntityFieldName(dishonorReasonSearchEntity.getSortBy(), DishonorReasonEntity.class);
        }

        String orderBy = "order by id";
        if (dishonorReasonSearchEntity.getSortBy() != null && !dishonorReasonSearchEntity.getSortBy().isEmpty())
            orderBy = "order by " + dishonorReasonSearchEntity.getSortBy();

        searchQuery = searchQuery.replace(":tablename", DishonorReasonEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (dishonorReasonSearchEntity.getTenantId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", dishonorReasonSearchEntity.getTenantId());
        }
        if (dishonorReasonSearchEntity.getId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id =:id");
            paramValues.put("id", dishonorReasonSearchEntity.getId());
        }
        if (dishonorReasonSearchEntity.getReason() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("reason =:reason");
            paramValues.put("reason", dishonorReasonSearchEntity.getReason());
        }
        if (dishonorReasonSearchEntity.getRemarks() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("remarks =:remarks");
            paramValues.put("remarks", dishonorReasonSearchEntity.getRemarks());
        }
        if (dishonorReasonSearchEntity.getIds() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("id in (:ids)");
            paramValues.put("ids", dishonorReasonSearchEntity.getIds());
        }
        if (dishonorReasonSearchEntity.getInstrumentid() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("instrumentid in (:instrumentids)");
            paramValues.put("instrumentids", new ArrayList<String>(Arrays.asList(dishonorReasonSearchEntity.getInstrumentid().split(","))));
        }

        Pagination<DishonorReason> page = new Pagination<>();
        if (dishonorReasonSearchEntity.getOffset() != null)
            page.setOffset(dishonorReasonSearchEntity.getOffset());
        if (dishonorReasonSearchEntity.getPageSize() != null)
            page.setPageSize(dishonorReasonSearchEntity.getPageSize());

        if (params.length() > 0)
            searchQuery = searchQuery.replace(":condition", " where " + params.toString());
        else

            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<DishonorReason>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(DishonorReasonEntity.class);

        List<DishonorReasonEntity> dishonorReasonEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
                paramValues, row);

        page.setTotalResults(dishonorReasonEntities.size());

        List<DishonorReason> dishonorreasons = new ArrayList<>();
        for (DishonorReasonEntity dishonorReasonEntity : dishonorReasonEntities)
        	dishonorreasons.add(dishonorReasonEntity.toDomain());
        page.setPagedData(dishonorreasons);

        return page;
    }

    public DishonorReasonEntity findById(DishonorReasonEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list)
            paramValues.put(s, getValue(getField(entity, s), entity));

        List<DishonorReasonEntity> dishonorreasons = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(DishonorReasonEntity.class));
        if (dishonorreasons.isEmpty())
            return null;
        else
            return dishonorreasons.get(0);

    }

}