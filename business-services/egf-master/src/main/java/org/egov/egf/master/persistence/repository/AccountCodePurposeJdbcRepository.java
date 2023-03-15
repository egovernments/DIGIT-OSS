package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.persistence.entity.AccountCodePurposeEntity;
import org.egov.egf.master.persistence.entity.AccountCodePurposeSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AccountCodePurposeJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(AccountCodePurposeJdbcRepository.class);

	static {
		LOG.debug("init accountCodePurpose");
		init(AccountCodePurposeEntity.class);
		LOG.debug("end init accountCodePurpose");
	}

	public AccountCodePurposeJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public AccountCodePurposeEntity create(AccountCodePurposeEntity entity) {
		super.create(entity);
		return entity;
	}

	public AccountCodePurposeEntity update(AccountCodePurposeEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<AccountCodePurpose> search(AccountCodePurposeSearch domain) {
		AccountCodePurposeSearchEntity accountCodePurposeSearchEntity = new AccountCodePurposeSearchEntity();
		accountCodePurposeSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (accountCodePurposeSearchEntity.getSortBy() != null
				&& !accountCodePurposeSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(accountCodePurposeSearchEntity.getSortBy());
			validateEntityFieldName(accountCodePurposeSearchEntity.getSortBy(), AccountCodePurposeEntity.class);
		}

		String orderBy = "order by name";
		if (accountCodePurposeSearchEntity.getSortBy() != null
				&& !accountCodePurposeSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + accountCodePurposeSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", AccountCodePurposeEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
	        if (accountCodePurposeSearchEntity.getTenantId() != null) {
	              if (params.length() > 0) {
	                  params.append(" and ");
	              }
	              params.append("tenantId =:tenantId");
	              paramValues.put("tenantId", accountCodePurposeSearchEntity.getTenantId());
	        }
		if (accountCodePurposeSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", accountCodePurposeSearchEntity.getId());
		}
		if (accountCodePurposeSearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(accountCodePurposeSearchEntity.getIds().split(","))));
                }
		if (accountCodePurposeSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", accountCodePurposeSearchEntity.getName());
		}
		Pagination<AccountCodePurpose> page = new Pagination<>();
		if (accountCodePurposeSearchEntity.getOffset() != null) {
			page.setOffset(accountCodePurposeSearchEntity.getOffset());
		}
		if (accountCodePurposeSearchEntity.getPageSize() != null) {
			page.setPageSize(accountCodePurposeSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<AccountCodePurpose>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(AccountCodePurposeEntity.class);

		List<AccountCodePurposeEntity> accountCodePurposeEntities = namedParameterJdbcTemplate
				.query(searchQuery.toString(), paramValues, row);

		page.setTotalResults(accountCodePurposeEntities.size());

		List<AccountCodePurpose> accountcodepurposes = new ArrayList<>();
		for (AccountCodePurposeEntity accountCodePurposeEntity : accountCodePurposeEntities) {

			accountcodepurposes.add(accountCodePurposeEntity.toDomain());
		}
		page.setPagedData(accountcodepurposes);

		return page;
	}

	public AccountCodePurposeEntity findById(AccountCodePurposeEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<AccountCodePurposeEntity> accountcodepurposes = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(AccountCodePurposeEntity.class));
		if (accountcodepurposes.isEmpty()) {
			return null;
		} else {
			return accountcodepurposes.get(0);
		}

	}
	
	public Boolean uniqueCheck(String fieldName, AccountCodePurposeEntity accountCodePurpose) {
		return super.uniqueCheck(fieldName,accountCodePurpose);
	}

}