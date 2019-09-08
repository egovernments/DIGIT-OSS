package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.persistence.entity.AccountDetailTypeEntity;
import org.egov.egf.master.persistence.entity.AccountDetailTypeSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailTypeJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(AccountDetailTypeJdbcRepository.class);

	static {
		LOG.debug("init accountDetailType");
		init(AccountDetailTypeEntity.class);
		LOG.debug("end init accountDetailType");
	}

	public AccountDetailTypeJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public AccountDetailTypeEntity create(AccountDetailTypeEntity entity) {
		super.create(entity);
		return entity;
	}

	public AccountDetailTypeEntity update(AccountDetailTypeEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<AccountDetailType> search(AccountDetailTypeSearch domain) {
		AccountDetailTypeSearchEntity accountDetailTypeSearchEntity = new AccountDetailTypeSearchEntity();
		accountDetailTypeSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (accountDetailTypeSearchEntity.getSortBy() != null && !accountDetailTypeSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(accountDetailTypeSearchEntity.getSortBy());
			validateEntityFieldName(accountDetailTypeSearchEntity.getSortBy(), AccountDetailTypeEntity.class);
		}

		String orderBy = "order by name";
		if (accountDetailTypeSearchEntity.getSortBy() != null && !accountDetailTypeSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + accountDetailTypeSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", AccountDetailTypeEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (accountDetailTypeSearchEntity.getTenantId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("tenantId =:tenantId");
			paramValues.put("tenantId", accountDetailTypeSearchEntity.getTenantId());
		}
		if (accountDetailTypeSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", accountDetailTypeSearchEntity.getId());
		}
		if (accountDetailTypeSearchEntity.getIds() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id in(:ids) ");
			paramValues.put("ids",
					new ArrayList<String>(Arrays.asList(accountDetailTypeSearchEntity.getIds().split(","))));
		}
		if (accountDetailTypeSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", accountDetailTypeSearchEntity.getName());
		}
		if (accountDetailTypeSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", accountDetailTypeSearchEntity.getDescription());
		}
		if (accountDetailTypeSearchEntity.getTablename() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("tableName =:tableName");
			paramValues.put("tableName", accountDetailTypeSearchEntity.getTablename());
		}
		if (accountDetailTypeSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", accountDetailTypeSearchEntity.getActive());
		}
		if (accountDetailTypeSearchEntity.getFullyQualifiedName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("fullyQualifiedName =:fullyQualifiedName");
			paramValues.put("fullyQualifiedName", accountDetailTypeSearchEntity.getFullyQualifiedName());
		}

		Pagination<AccountDetailType> page = new Pagination<>();
		if (accountDetailTypeSearchEntity.getOffset() != null) {
			page.setOffset(accountDetailTypeSearchEntity.getOffset());
		}
		if (accountDetailTypeSearchEntity.getPageSize() != null) {
			page.setPageSize(accountDetailTypeSearchEntity.getPageSize());
		}

		if (params.length() > 0) {

			searchQuery = searchQuery.replace(":condition", " where " + params.toString());

		} else

			searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<AccountDetailType>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(AccountDetailTypeEntity.class);

		List<AccountDetailTypeEntity> accountDetailTypeEntities = namedParameterJdbcTemplate
				.query(searchQuery.toString(), paramValues, row);

		page.setTotalResults(accountDetailTypeEntities.size());

		List<AccountDetailType> accountdetailtypes = new ArrayList<>();
		for (AccountDetailTypeEntity accountDetailTypeEntity : accountDetailTypeEntities) {

			accountdetailtypes.add(accountDetailTypeEntity.toDomain());
		}
		page.setPagedData(accountdetailtypes);

		return page;
	}

	public AccountDetailTypeEntity findById(AccountDetailTypeEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<AccountDetailTypeEntity> accountdetailtypes = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(AccountDetailTypeEntity.class));
		if (accountdetailtypes.isEmpty()) {
			return null;
		} else {
			return accountdetailtypes.get(0);
		}

	}

}