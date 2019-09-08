package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.persistence.entity.FundEntity;
import org.egov.egf.master.persistence.entity.FundSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FundJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(FundJdbcRepository.class);

	static {
		LOG.debug("init fund");
		init(FundEntity.class);
		LOG.debug("end init fund");
	}

	public FundJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public FundEntity create(FundEntity entity) {
		super.create(entity);
		return entity;
	}

	public FundEntity update(FundEntity entity) {
		super.update(entity);
		return entity;

	}
	public boolean delete(FundEntity entity,String reason) {
		super.delete(entity, reason);
		return true;

	}

	public Pagination<Fund> search(FundSearch domain) {
		FundSearchEntity fundSearchEntity = new FundSearchEntity();
		fundSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (fundSearchEntity.getSortBy() != null && !fundSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(fundSearchEntity.getSortBy());
			validateEntityFieldName(fundSearchEntity.getSortBy(), FundEntity.class);
		}

		String orderBy = "order by name";
		if (fundSearchEntity.getSortBy() != null && !fundSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + fundSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", FundEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (fundSearchEntity.getTenantId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("tenantId =:tenantId");
			paramValues.put("tenantId", fundSearchEntity.getTenantId());
		}
		if (fundSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", fundSearchEntity.getId());
		}
		if (fundSearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", fundSearchEntity.getCode());
		}
		if (fundSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", fundSearchEntity.getName());
		}
		if (fundSearchEntity.getIdentifier() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", fundSearchEntity.getIdentifier());
		}
		if (fundSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", fundSearchEntity.getActive());
		}
		if (fundSearchEntity.getLevel() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("type =:type");
			paramValues.put("type", fundSearchEntity.getLevel());
		}

		Pagination<Fund> page = new Pagination<>();
		if (fundSearchEntity.getOffset() != null) {
			page.setOffset(fundSearchEntity.getOffset());
		}
		if (fundSearchEntity.getPageSize() != null) {
			page.setPageSize(fundSearchEntity.getPageSize());
		}

		if (params.length() > 0) {

			searchQuery = searchQuery.replace(":condition", " where " + params.toString());

		} else

			searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<Fund>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(FundEntity.class);

		List<FundEntity> fundEntities = namedParameterJdbcTemplate.query(searchQuery.toString(), paramValues, row);

		page.setTotalResults(fundEntities.size());

		List<Fund> funds = new ArrayList<>();
		for (FundEntity fundEntity : fundEntities) {

			funds.add(fundEntity.toDomain());
		}
		page.setPagedData(funds);

		return page;
	}

	public FundEntity findById(FundEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<FundEntity> funds = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(FundEntity.class));
		if (funds.isEmpty()) {
			return null;
		} else {
			return funds.get(0);
		}

	}

}