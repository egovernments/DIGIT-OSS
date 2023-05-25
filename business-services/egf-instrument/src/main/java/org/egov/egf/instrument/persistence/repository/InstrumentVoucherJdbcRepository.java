package org.egov.egf.instrument.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.domain.model.InstrumentVoucherSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherEntity;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class InstrumentVoucherJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(InstrumentVoucherJdbcRepository.class);

    static {
        LOG.debug("init instrumentVoucher");
        init(InstrumentVoucherEntity.class);
        LOG.debug("end init instrumentVoucher");
    }

    public InstrumentVoucherJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    @Override
    public void delete(final String tenantId, final String instrumentId) {
        super.delete(InstrumentVoucherEntity.TABLE_NAME, tenantId, "instrumentId", instrumentId);
    }

    public InstrumentVoucherEntity create(InstrumentVoucherEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public InstrumentVoucherEntity update(InstrumentVoucherEntity entity) {
        super.update(entity);
        return entity;

    }

    public Pagination<InstrumentVoucher> search(InstrumentVoucherSearch domain) {
        InstrumentVoucherSearchEntity instrumentVoucherSearchEntity = new InstrumentVoucherSearchEntity();
        instrumentVoucherSearchEntity.toEntity(domain);

        String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

        Map<String, Object> paramValues = new HashMap<>();
        StringBuffer params = new StringBuffer();

        if (instrumentVoucherSearchEntity.getSortBy() != null && !instrumentVoucherSearchEntity.getSortBy().isEmpty()) {
            validateSortByOrder(instrumentVoucherSearchEntity.getSortBy());
            validateEntityFieldName(instrumentVoucherSearchEntity.getSortBy(), InstrumentVoucherEntity.class);
        }

        String orderBy = "order by id";
        if (instrumentVoucherSearchEntity.getSortBy() != null && !instrumentVoucherSearchEntity.getSortBy().isEmpty())
            orderBy = "order by " + instrumentVoucherSearchEntity.getSortBy();

        searchQuery = searchQuery.replace(":tablename", InstrumentVoucherEntity.TABLE_NAME);

        searchQuery = searchQuery.replace(":selectfields", " * ");

        // implement jdbc specfic search
        if (instrumentVoucherSearchEntity.getTenantId() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("tenantId =:tenantId");
            paramValues.put("tenantId", instrumentVoucherSearchEntity.getTenantId());
        }

        if (instrumentVoucherSearchEntity.getInstruments() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("instrumentId in (:instruments)");
            paramValues.put("instruments",
                    new ArrayList<String>(Arrays.asList(instrumentVoucherSearchEntity.getInstruments().split(","))));
        }

        if (instrumentVoucherSearchEntity.getReceiptIds() != null) {
            if (params.length() > 0)
                params.append(" and ");
            params.append("receiptHeaderId in (:receiptIds)");
            paramValues.put("receiptIds",
                    new ArrayList<String>(Arrays.asList(instrumentVoucherSearchEntity.getReceiptIds().split(","))));
        }

        Pagination<InstrumentVoucher> page = new Pagination<>();
        if (instrumentVoucherSearchEntity.getOffset() != null)
            page.setOffset(instrumentVoucherSearchEntity.getOffset());
        if (instrumentVoucherSearchEntity.getPageSize() != null)
            page.setPageSize(instrumentVoucherSearchEntity.getPageSize());

        if (params.length() > 0)
            searchQuery = searchQuery.replace(":condition", " where " + params.toString());
        else

            searchQuery = searchQuery.replace(":condition", "");

        searchQuery = searchQuery.replace(":orderby", orderBy);

        page = (Pagination<InstrumentVoucher>) getPagination(searchQuery, page, paramValues);
        searchQuery = searchQuery + " :pagination";

        searchQuery = searchQuery.replace(":pagination",
                "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

        BeanPropertyRowMapper row = new BeanPropertyRowMapper(InstrumentVoucherEntity.class);

        List<InstrumentVoucherEntity> instrumentVoucherEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
                paramValues, row);

        page.setTotalResults(instrumentVoucherEntities.size());

        List<InstrumentVoucher> instrumentVouchers = new ArrayList<>();
        for (InstrumentVoucherEntity instrumentVoucherEntity : instrumentVoucherEntities) {
            instrumentVouchers.add(instrumentVoucherEntity.toDomain());
        }
        page.setPagedData(instrumentVouchers);

        return page;
    }

    public InstrumentVoucherEntity findById(InstrumentVoucherEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list)
            paramValues.put(s, getValue(getField(entity, s), entity));

        List<InstrumentVoucherEntity> instrumentvouchers = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(InstrumentVoucherEntity.class));
        if (instrumentvouchers.isEmpty())
            return null;
        else
            return instrumentvouchers.get(0);

    }

}