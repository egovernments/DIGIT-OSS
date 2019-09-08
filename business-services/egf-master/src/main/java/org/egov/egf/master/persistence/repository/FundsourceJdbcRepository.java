package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.Fundsource;
import org.egov.egf.master.domain.model.FundsourceSearch;
import org.egov.egf.master.persistence.entity.FundsourceEntity;
import org.egov.egf.master.persistence.entity.FundsourceSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FundsourceJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(FundsourceJdbcRepository.class);

	static {
		LOG.debug("init fundsource");
		init(FundsourceEntity.class);
		LOG.debug("end init fundsource");
	}

	public FundsourceJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public FundsourceEntity create(FundsourceEntity entity) {
		super.create(entity);
		return entity;
	}

	public FundsourceEntity update(FundsourceEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<Fundsource> search(FundsourceSearch domain) {
		FundsourceSearchEntity fundsourceSearchEntity = new FundsourceSearchEntity();
		fundsourceSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (fundsourceSearchEntity.getSortBy() != null && !fundsourceSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(fundsourceSearchEntity.getSortBy());
			validateEntityFieldName(fundsourceSearchEntity.getSortBy(), FundsourceEntity.class);
		}

		String orderBy = "order by name";
		if (fundsourceSearchEntity.getSortBy() != null && !fundsourceSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + fundsourceSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", FundsourceEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
	        if (fundsourceSearchEntity.getTenantId() != null) {
	            if (params.length() > 0) {
	                params.append(" and ");
	            }
	            params.append("tenantId =:tenantId");
	            paramValues.put("tenantId", fundsourceSearchEntity.getTenantId());
	        }
		if (fundsourceSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", fundsourceSearchEntity.getId());
		}
		if (fundsourceSearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(fundsourceSearchEntity.getIds().split(","))));
                }
		if (fundsourceSearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", fundsourceSearchEntity.getCode());
		}
		if (fundsourceSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", fundsourceSearchEntity.getName());
		}
		if (fundsourceSearchEntity.getType() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("type =:type");
			paramValues.put("type", fundsourceSearchEntity.getType());
		}
		if (fundsourceSearchEntity.getParentId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("parentId =:fundSource");
			paramValues.put("fundSource", fundsourceSearchEntity.getParentId());
		}
		if (fundsourceSearchEntity.getLlevel() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("llevel =:llevel");
			paramValues.put("llevel", fundsourceSearchEntity.getLlevel());
		}
		if (fundsourceSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", fundsourceSearchEntity.getActive());
		}
		if (fundsourceSearchEntity.getIsParent() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("isParent =:isParent");
			paramValues.put("isParent", fundsourceSearchEntity.getIsParent());
		}

		Pagination<Fundsource> page = new Pagination<>();
		if (fundsourceSearchEntity.getOffset() != null) {
			page.setOffset(fundsourceSearchEntity.getOffset());
		}
		if (fundsourceSearchEntity.getPageSize() != null) {
			page.setPageSize(fundsourceSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<Fundsource>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(FundsourceEntity.class);

		List<FundsourceEntity> fundsourceEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(fundsourceEntities.size());

		List<Fundsource> fundsources = new ArrayList<>();
		for (FundsourceEntity fundsourceEntity : fundsourceEntities) {

			fundsources.add(fundsourceEntity.toDomain());
		}
		page.setPagedData(fundsources);

		return page;
	}

	public FundsourceEntity findById(FundsourceEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<FundsourceEntity> fundsources = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(FundsourceEntity.class));
		if (fundsources.isEmpty()) {
			return null;
		} else {
			return fundsources.get(0);
		}

	}

}