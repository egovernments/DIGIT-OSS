package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.Functionary;
import org.egov.egf.master.domain.model.FunctionarySearch;
import org.egov.egf.master.persistence.entity.FunctionaryEntity;
import org.egov.egf.master.persistence.entity.FunctionarySearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FunctionaryJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(FunctionaryJdbcRepository.class);

	static {
		LOG.debug("init functionary");
		init(FunctionaryEntity.class);
		LOG.debug("end init functionary");
	}

	public FunctionaryJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public FunctionaryEntity create(FunctionaryEntity entity) {
		super.create(entity);
		return entity;
	}

	public FunctionaryEntity update(FunctionaryEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<Functionary> search(FunctionarySearch domain) {
		FunctionarySearchEntity functionarySearchEntity = new FunctionarySearchEntity();
		functionarySearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (functionarySearchEntity.getSortBy() != null && !functionarySearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(functionarySearchEntity.getSortBy());
			validateEntityFieldName(functionarySearchEntity.getSortBy(), FunctionaryEntity.class);
		}

		String orderBy = "order by name";
		if (functionarySearchEntity.getSortBy() != null && !functionarySearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + functionarySearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", FunctionaryEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (functionarySearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", functionarySearchEntity.getTenantId());
                }
		if (functionarySearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", functionarySearchEntity.getId());
		}
		if (functionarySearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(functionarySearchEntity.getIds().split(","))));
                }
		if (functionarySearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", functionarySearchEntity.getCode());
		}
		if (functionarySearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", functionarySearchEntity.getName());
		}
		if (functionarySearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", functionarySearchEntity.getActive());
		}

		Pagination<Functionary> page = new Pagination<>();
		if (functionarySearchEntity.getOffset() != null) {
			page.setOffset(functionarySearchEntity.getOffset());
		}
		if (functionarySearchEntity.getPageSize() != null) {
			page.setPageSize(functionarySearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<Functionary>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(FunctionaryEntity.class);

		List<FunctionaryEntity> functionaryEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(functionaryEntities.size());

		List<Functionary> functionaries = new ArrayList<>();
		for (FunctionaryEntity functionaryEntity : functionaryEntities) {

			functionaries.add(functionaryEntity.toDomain());
		}
		page.setPagedData(functionaries);

		return page;
	}

	public FunctionaryEntity findById(FunctionaryEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<FunctionaryEntity> functionaries = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(FunctionaryEntity.class));
		if (functionaries.isEmpty()) {
			return null;
		} else {
			return functionaries.get(0);
		}

	}

}