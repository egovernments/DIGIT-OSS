package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.BudgetGroup;
import org.egov.egf.master.domain.model.BudgetGroupSearch;
import org.egov.egf.master.persistence.entity.BudgetGroupEntity;
import org.egov.egf.master.persistence.entity.BudgetGroupSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class BudgetGroupJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(BudgetGroupJdbcRepository.class);

	static {
		LOG.debug("init budgetGroup");
		init(BudgetGroupEntity.class);
		LOG.debug("end init budgetGroup");
	}

	public BudgetGroupJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public BudgetGroupEntity create(BudgetGroupEntity entity) {
		super.create(entity);
		return entity;
	}

	public BudgetGroupEntity update(BudgetGroupEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<BudgetGroup> search(BudgetGroupSearch domain) {
		BudgetGroupSearchEntity budgetGroupSearchEntity = new BudgetGroupSearchEntity();
		budgetGroupSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (budgetGroupSearchEntity.getSortBy() != null && !budgetGroupSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(budgetGroupSearchEntity.getSortBy());
			validateEntityFieldName(budgetGroupSearchEntity.getSortBy(), BudgetGroupEntity.class);
		}

		String orderBy = "order by name";
		if (budgetGroupSearchEntity.getSortBy() != null && !budgetGroupSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + budgetGroupSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", BudgetGroupEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (budgetGroupSearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", budgetGroupSearchEntity.getTenantId());
                }
		if (budgetGroupSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", budgetGroupSearchEntity.getId());
		}
	        if (budgetGroupSearchEntity.getIds() != null) {
	                if (params.length() > 0) {
	                        params.append(" and ");
	                }
	                params.append("id in(:ids) ");
	                paramValues.put("ids", new ArrayList<String>(Arrays.asList(budgetGroupSearchEntity.getIds().split(","))));
	        }
		if (budgetGroupSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", budgetGroupSearchEntity.getName());
		}
		if (budgetGroupSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", budgetGroupSearchEntity.getDescription());
		}
		if (budgetGroupSearchEntity.getMajorCodeId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("majorCode =:majorCode");
			paramValues.put("majorCode", budgetGroupSearchEntity.getMajorCodeId());
		}
		if (budgetGroupSearchEntity.getMaxCodeId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("maxCode =:maxCode");
			paramValues.put("maxCode", budgetGroupSearchEntity.getMaxCodeId());
		}
		if (budgetGroupSearchEntity.getMinCodeId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("minCode =:minCode");
			paramValues.put("minCode", budgetGroupSearchEntity.getMinCodeId());
		}
		if (budgetGroupSearchEntity.getAccountType() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("accountType =:accountType");
			paramValues.put("accountType", budgetGroupSearchEntity.getAccountType().toString());
		}
		if (budgetGroupSearchEntity.getBudgetingType() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("budgetingType =:budgetingType");
			paramValues.put("budgetingType", budgetGroupSearchEntity.getBudgetingType().toString());
		}
		if (budgetGroupSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", budgetGroupSearchEntity.getActive());
		}

		Pagination<BudgetGroup> page = new Pagination<>();
		if (budgetGroupSearchEntity.getOffset() != null) {
			page.setOffset(budgetGroupSearchEntity.getOffset());
		}
		if (budgetGroupSearchEntity.getPageSize() != null) {
			page.setPageSize(budgetGroupSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<BudgetGroup>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(BudgetGroupEntity.class);

		List<BudgetGroupEntity> budgetGroupEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(budgetGroupEntities.size());

		List<BudgetGroup> budgetgroups = new ArrayList<>();
		for (BudgetGroupEntity budgetGroupEntity : budgetGroupEntities) {

			budgetgroups.add(budgetGroupEntity.toDomain());
		}
		page.setPagedData(budgetgroups);

		return page;
	}

	public BudgetGroupEntity findById(BudgetGroupEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<BudgetGroupEntity> budgetgroups = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(BudgetGroupEntity.class));
		if (budgetgroups.isEmpty()) {
			return null;
		} else {
			return budgetgroups.get(0);
		}

	}

}