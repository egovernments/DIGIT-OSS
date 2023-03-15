package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.persistence.entity.AccountEntityEntity;
import org.egov.egf.master.persistence.entity.AccountEntitySearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AccountEntityJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(AccountEntityJdbcRepository.class);

	static {
		LOG.debug("init accountEntity");
		init(AccountEntityEntity.class);
		LOG.debug("end init accountEntity");
	}

	public AccountEntityJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public AccountEntityEntity create(AccountEntityEntity entity) {
		super.create(entity);
		return entity;
	}

	public AccountEntityEntity update(AccountEntityEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<AccountEntity> search(AccountEntitySearch domain) {
		AccountEntitySearchEntity accountEntitySearchEntity = new AccountEntitySearchEntity();
		accountEntitySearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (accountEntitySearchEntity.getSortBy() != null && !accountEntitySearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(accountEntitySearchEntity.getSortBy());
			validateEntityFieldName(accountEntitySearchEntity.getSortBy(), AccountEntityEntity.class);
		}

		String orderBy = "order by name";
		if (accountEntitySearchEntity.getSortBy() != null && !accountEntitySearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + accountEntitySearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", AccountEntityEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (accountEntitySearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", accountEntitySearchEntity.getTenantId());
                }
		if (accountEntitySearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", accountEntitySearchEntity.getId());
		}
	        if (accountEntitySearchEntity.getIds() != null) {
	              if (params.length() > 0) {
	                      params.append(" and ");
	              }
	              params.append("id in(:ids) ");
	              paramValues.put("ids", new ArrayList<String>(Arrays.asList(accountEntitySearchEntity.getIds().split(","))));
	        }
		if (accountEntitySearchEntity.getAccountDetailTypeId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("accountDetailTypeId =:accountDetailType");
			paramValues.put("accountDetailType", accountEntitySearchEntity.getAccountDetailTypeId());
		}
		if (accountEntitySearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", accountEntitySearchEntity.getCode());
		}
		if (accountEntitySearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", accountEntitySearchEntity.getName());
		}
		if (accountEntitySearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", accountEntitySearchEntity.getActive());
		}
		if (accountEntitySearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", accountEntitySearchEntity.getDescription());
		}

		Pagination<AccountEntity> page = new Pagination<>();
		if (accountEntitySearchEntity.getOffset() != null) {
			page.setOffset(accountEntitySearchEntity.getOffset());
		}
		if (accountEntitySearchEntity.getPageSize() != null) {
			page.setPageSize(accountEntitySearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<AccountEntity>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(AccountEntityEntity.class);

		List<AccountEntityEntity> accountEntityEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(accountEntityEntities.size());

		List<AccountEntity> accountentities = new ArrayList<>();
		for (AccountEntityEntity accountEntityEntity : accountEntityEntities) {

			accountentities.add(accountEntityEntity.toDomain());
		}
		page.setPagedData(accountentities);

		return page;
	}

	public AccountEntityEntity findById(AccountEntityEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<AccountEntityEntity> accountentities = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(AccountEntityEntity.class));
		if (accountentities.isEmpty()) {
			return null;
		} else {
			return accountentities.get(0);
		}

	}

}