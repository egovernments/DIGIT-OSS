package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.persistence.entity.AccountDetailKeyEntity;
import org.egov.egf.master.persistence.entity.AccountDetailKeySearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailKeyJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(AccountDetailKeyJdbcRepository.class);

	static {
		LOG.debug("init accountDetailKey");
		init(AccountDetailKeyEntity.class);
		LOG.debug("end init accountDetailKey");
	}

	public AccountDetailKeyJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public AccountDetailKeyEntity create(AccountDetailKeyEntity entity) {
		super.create(entity);
		return entity;
	}

	public AccountDetailKeyEntity update(AccountDetailKeyEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<AccountDetailKey> search(AccountDetailKeySearch domain) {
		AccountDetailKeySearchEntity accountDetailKeySearchEntity = new AccountDetailKeySearchEntity();
		accountDetailKeySearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		 StringBuffer params = new StringBuffer();

		if (accountDetailKeySearchEntity.getSortBy() != null && !accountDetailKeySearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(accountDetailKeySearchEntity.getSortBy());
			validateEntityFieldName(accountDetailKeySearchEntity.getSortBy(), AccountDetailKeyEntity.class);
		}

		String orderBy = "order by key";
		if (accountDetailKeySearchEntity.getSortBy() != null && !accountDetailKeySearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + accountDetailKeySearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", AccountDetailKeyEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
                if (accountDetailKeySearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", accountDetailKeySearchEntity.getTenantId());
                }
		if (accountDetailKeySearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", accountDetailKeySearchEntity.getId());
		}
		if (accountDetailKeySearchEntity.getIds() != null) {
                    if (params.length() > 0) {
                            params.append(" and ");
                    }
                    params.append("id in(:ids) ");
                    paramValues.put("ids", new ArrayList<String>(Arrays.asList(accountDetailKeySearchEntity.getIds().split(","))));
                }
		if (accountDetailKeySearchEntity.getKey() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("key =:key");
			paramValues.put("key", accountDetailKeySearchEntity.getKey());
		}
		if (accountDetailKeySearchEntity.getAccountDetailTypeId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("accountDetailTypeId =:accountDetailType");
			paramValues.put("accountDetailType", accountDetailKeySearchEntity.getAccountDetailTypeId());
		}

		Pagination<AccountDetailKey> page = new Pagination<>();
		if (accountDetailKeySearchEntity.getOffset() != null) {
			page.setOffset(accountDetailKeySearchEntity.getOffset());
		}
		if (accountDetailKeySearchEntity.getPageSize() != null) {
			page.setPageSize(accountDetailKeySearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<AccountDetailKey>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(AccountDetailKeyEntity.class);

		List<AccountDetailKeyEntity> accountDetailKeyEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(accountDetailKeyEntities.size());

		List<AccountDetailKey> accountdetailkeys = new ArrayList<>();
		for (AccountDetailKeyEntity accountDetailKeyEntity : accountDetailKeyEntities) {

			accountdetailkeys.add(accountDetailKeyEntity.toDomain());
		}
		page.setPagedData(accountdetailkeys);

		return page;
	}

	public AccountDetailKeyEntity findById(AccountDetailKeyEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<AccountDetailKeyEntity> accountdetailkeys = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(AccountDetailKeyEntity.class));
		if (accountdetailkeys.isEmpty()) {
			return null;
		} else {
			return accountdetailkeys.get(0);
		}

	}

}