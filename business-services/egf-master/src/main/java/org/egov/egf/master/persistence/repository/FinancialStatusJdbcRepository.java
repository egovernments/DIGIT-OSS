package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.FinancialStatus;
import org.egov.egf.master.domain.model.FinancialStatusSearch;
import org.egov.egf.master.persistence.entity.FinancialStatusEntity;
import org.egov.egf.master.persistence.entity.FinancialStatusSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FinancialStatusJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(FinancialStatusJdbcRepository.class);

	static {
		LOG.debug("init financialStatus");
		init(FinancialStatusEntity.class);
		LOG.debug("end init financialStatus");
	}

	public FinancialStatusJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public FinancialStatusEntity create(FinancialStatusEntity entity) {

		entity.setId(UUID.randomUUID().toString().replace("-", ""));
		super.create(entity);
		return entity;
	}

	public FinancialStatusEntity update(FinancialStatusEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<FinancialStatus> search(FinancialStatusSearch domain) {
		FinancialStatusSearchEntity financialStatusSearchEntity = new FinancialStatusSearchEntity();
		financialStatusSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (financialStatusSearchEntity.getSortBy() != null && !financialStatusSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(financialStatusSearchEntity.getSortBy());
			validateEntityFieldName(financialStatusSearchEntity.getSortBy(), FinancialStatusEntity.class);
		}

		String orderBy = "order by name";
		if (financialStatusSearchEntity.getSortBy() != null && !financialStatusSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + financialStatusSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", FinancialStatusEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (financialStatusSearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", financialStatusSearchEntity.getTenantId());
                }
		if (financialStatusSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", financialStatusSearchEntity.getId());
		}
		if (financialStatusSearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(financialStatusSearchEntity.getIds().split(","))));
                }
		if (financialStatusSearchEntity.getModuleType() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("moduleType =:moduleType");
			paramValues.put("moduleType", financialStatusSearchEntity.getModuleType());
		}
		if (financialStatusSearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", financialStatusSearchEntity.getCode());
		}
		if (financialStatusSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", financialStatusSearchEntity.getDescription());
		}

		Pagination<FinancialStatus> page = new Pagination<>();
		if (financialStatusSearchEntity.getOffset() != null) {
			page.setOffset(financialStatusSearchEntity.getOffset());
		}
		if (financialStatusSearchEntity.getPageSize() != null) {
			page.setPageSize(financialStatusSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<FinancialStatus>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(FinancialStatusEntity.class);

		List<FinancialStatusEntity> financialStatusEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(financialStatusEntities.size());

		List<FinancialStatus> financialstatuses = new ArrayList<>();
		for (FinancialStatusEntity financialStatusEntity : financialStatusEntities) {

			financialstatuses.add(financialStatusEntity.toDomain());
		}
		page.setPagedData(financialstatuses);

		return page;
	}

	public FinancialStatusEntity findById(FinancialStatusEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<FinancialStatusEntity> financialstatuses = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(FinancialStatusEntity.class));
		if (financialstatuses.isEmpty()) {
			return null;
		} else {
			return financialstatuses.get(0);
		}

	}

}