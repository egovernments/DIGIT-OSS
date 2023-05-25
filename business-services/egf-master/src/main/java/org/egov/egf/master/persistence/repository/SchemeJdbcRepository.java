package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SchemeSearch;
import org.egov.egf.master.persistence.entity.SchemeEntity;
import org.egov.egf.master.persistence.entity.SchemeSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SchemeJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(SchemeJdbcRepository.class);

	static {
		LOG.debug("init scheme");
		init(SchemeEntity.class);
		LOG.debug("end init scheme");
	}

	public SchemeJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public SchemeEntity create(SchemeEntity entity) {
		super.create(entity);
		return entity;
	}

	public SchemeEntity update(SchemeEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<Scheme> search(SchemeSearch domain) {
		SchemeSearchEntity schemeSearchEntity = new SchemeSearchEntity();
		schemeSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (schemeSearchEntity.getSortBy() != null && !schemeSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(schemeSearchEntity.getSortBy());
			validateEntityFieldName(schemeSearchEntity.getSortBy(), SchemeEntity.class);
		}

		String orderBy = "order by name";
		if (schemeSearchEntity.getSortBy() != null && !schemeSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + schemeSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", SchemeEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
	        if (schemeSearchEntity.getTenantId() != null) {
                          if (params.length() > 0) {
                              params.append(" and ");
                          }
                          params.append("tenantId =:tenantId");
                          paramValues.put("tenantId", schemeSearchEntity.getTenantId());
                }
		if (schemeSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", schemeSearchEntity.getId());
		}
		if (schemeSearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(schemeSearchEntity.getIds().split(","))));
                }
		if (schemeSearchEntity.getFundId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("fundId =:fund");
			paramValues.put("fund", schemeSearchEntity.getFundId());
		}
		if (schemeSearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", schemeSearchEntity.getCode());
		}
		if (schemeSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", schemeSearchEntity.getName());
		}
		if (schemeSearchEntity.getValidFrom() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("validFrom =:validFrom");
			paramValues.put("validFrom", schemeSearchEntity.getValidFrom());
		}
		if (schemeSearchEntity.getValidTo() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("validTo =:validTo");
			paramValues.put("validTo", schemeSearchEntity.getValidTo());
		}
		if (schemeSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", schemeSearchEntity.getActive());
		}
		if (schemeSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", schemeSearchEntity.getDescription());
		}
		if (schemeSearchEntity.getBoundary() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("boundary =:boundary");
			paramValues.put("boundary", schemeSearchEntity.getBoundary());
		}

		Pagination<Scheme> page = new Pagination<>();
		if (schemeSearchEntity.getOffset() != null) {
			page.setOffset(schemeSearchEntity.getOffset());
		}
		if (schemeSearchEntity.getPageSize() != null) {
			page.setPageSize(schemeSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<Scheme>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(SchemeEntity.class);

		List<SchemeEntity> schemeEntities = namedParameterJdbcTemplate.query(searchQuery.toString(), paramValues, row);

		page.setTotalResults(schemeEntities.size());

		List<Scheme> schemes = new ArrayList<>();
		for (SchemeEntity schemeEntity : schemeEntities) {

			schemes.add(schemeEntity.toDomain());
		}
		page.setPagedData(schemes);

		return page;
	}

	public SchemeEntity findById(SchemeEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<SchemeEntity> schemes = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(SchemeEntity.class));
		if (schemes.isEmpty()) {
			return null;
		} else {
			return schemes.get(0);
		}

	}

}