package org.egov.egf.instrument.persistence.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.instrument.persistence.entity.InstrumentTypePropertyEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class InstrumentTypePropertyJdbcRepository extends JdbcRepository {
    private static final Logger LOG = LoggerFactory.getLogger(InstrumentTypePropertyJdbcRepository.class);

    static {
        LOG.debug("init instrumentTypeProperty");
        init(InstrumentTypePropertyEntity.class);
        LOG.debug("end init instrumentTypeProperty");
    }

    public InstrumentTypePropertyJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public InstrumentTypePropertyEntity create(InstrumentTypePropertyEntity entity) {

        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        super.create(entity);
        return entity;
    }

    public InstrumentTypePropertyEntity update(InstrumentTypePropertyEntity entity) {
        super.update(entity);
        return entity;

    }

    /*
     * public Pagination<InstrumentTypeProperty> search(InstrumentTypeProperty domain) { InstrumentTypePropertyEntity
     * instrumentTypePropertySearchEntity = new InstrumentTypePropertyEntity();
     * instrumentTypePropertySearchEntity.toEntity(domain); String searchQuery =
     * "select :selectfields from :tablename :condition  :orderby   "; Map<String, Object> paramValues = new HashMap<>();
     * StringBuffer params = new StringBuffer(); if (instrumentTypePropertySearchEntity.getSortBy() != null &&
     * !instrumentTypePropertySearchEntity.getSortBy().isEmpty()) {
     * validateSortByOrder(instrumentTypePropertySearchEntity.getSortBy());
     * validateEntityFieldName(instrumentTypePropertySearchEntity.getSortBy(), InstrumentTypePropertyEntity.class); } String
     * orderBy = "order by id"; if (instrumentTypePropertySearchEntity.getSortBy() != null &&
     * !instrumentTypePropertySearchEntity.getSortBy().isEmpty()) orderBy = "order by " +
     * instrumentTypePropertySearchEntity.getSortBy(); searchQuery = searchQuery.replace(":tablename",
     * InstrumentTypePropertyEntity.TABLE_NAME); searchQuery = searchQuery.replace(":selectfields", " * "); // implement jdbc
     * specfic search if (instrumentTypePropertySearchEntity.getTransactionTypeId() != null) { if (params.length() > 0)
     * params.append(" and "); params.append( "transactionType =:transactionType"); paramValues.put("transactionType",
     * instrumentTypePropertySearchEntity.getTransactionTypeId()); } if
     * (instrumentTypePropertySearchEntity.getReconciledOncreate() != null) { if (params.length() > 0) params.append(" and ");
     * params.append( "reconciledOncreate =:reconciledOncreate"); paramValues.put("reconciledOncreate",
     * instrumentTypePropertySearchEntity.getReconciledOncreate()); } if (instrumentTypePropertySearchEntity.getStatusOnCreateId()
     * != null) { if (params.length() > 0) params.append(" and "); params.append( "statusOnCreate =:statusOnCreate");
     * paramValues.put("statusOnCreate", instrumentTypePropertySearchEntity.getStatusOnCreateId()); } if
     * (instrumentTypePropertySearchEntity.getStatusOnUpdateId() != null) { if (params.length() > 0) params.append(" and ");
     * params.append( "statusOnUpdate =:statusOnUpdate"); paramValues.put("statusOnUpdate",
     * instrumentTypePropertySearchEntity.getStatusOnUpdateId()); } if
     * (instrumentTypePropertySearchEntity.getStatusOnReconcileId() != null) { if (params.length() > 0) params.append(" and ");
     * params.append( "statusOnReconcile =:statusOnReconcile"); paramValues.put("statusOnReconcile",
     * instrumentTypePropertySearchEntity.getStatusOnReconcileId()); } Pagination<InstrumentTypeProperty> page = new
     * Pagination<>(); if (instrumentTypePropertySearchEntity.getOffset() != null)
     * page.setOffset(instrumentTypePropertySearchEntity.getOffset()); if (instrumentTypePropertySearchEntity.getPageSize() !=
     * null) page.setPageSize(instrumentTypePropertySearchEntity.getPageSize()); if (params.length() > 0) { searchQuery =
     * searchQuery.replace(":condition", " where " + params.toString()); } else { searchQuery = searchQuery.replace(":condition",
     * ""); } searchQuery = searchQuery.replace(":orderby", orderBy); page = (Pagination<InstrumentTypeProperty>)
     * getPagination(searchQuery, page, paramValues); searchQuery = searchQuery + " :pagination"; searchQuery =
     * searchQuery.replace(":pagination", "limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());
     * BeanPropertyRowMapper row = new BeanPropertyRowMapper(InstrumentTypePropertyEntity.class);
     * List<InstrumentTypePropertyEntity> instrumentTypePropertyEntities = namedParameterJdbcTemplate
     * .query(searchQuery.toString(), paramValues, row); page.setTotalResults(instrumentTypePropertyEntities.size());
     * List<InstrumentTypeProperty> instrumenttypeproperties = new ArrayList<>(); for (InstrumentTypePropertyEntity
     * instrumentTypePropertyEntity : instrumentTypePropertyEntities) {
     * instrumenttypeproperties.add(instrumentTypePropertyEntity.toDomain()); } page.setPagedData(instrumenttypeproperties);
     * return page; }
     */

    public InstrumentTypePropertyEntity findById(InstrumentTypePropertyEntity entity) {
        List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

        Map<String, Object> paramValues = new HashMap<>();

        for (String s : list)
            paramValues.put(s, getValue(getField(entity, s), entity));

        List<InstrumentTypePropertyEntity> instrumenttypeproperties = namedParameterJdbcTemplate.query(
                getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
                new BeanPropertyRowMapper(InstrumentTypePropertyEntity.class));
        if (instrumenttypeproperties.isEmpty())
            return null;
        else
            return instrumenttypeproperties.get(0);

    }

}