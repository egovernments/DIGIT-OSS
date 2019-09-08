package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.persistence.entity.BankAccountEntity;
import org.egov.egf.master.persistence.entity.BankAccountSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class BankAccountJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(BankAccountJdbcRepository.class);

	static {
		LOG.debug("init bankAccount");
		init(BankAccountEntity.class);
		LOG.debug("end init bankAccount");
	}

	public BankAccountJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public BankAccountEntity create(BankAccountEntity entity) {
		super.create(entity);
		return entity;
	}

	public BankAccountEntity update(BankAccountEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<BankAccount> search(BankAccountSearch domain) {
		BankAccountSearchEntity bankAccountSearchEntity = new BankAccountSearchEntity();
		bankAccountSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (bankAccountSearchEntity.getSortBy() != null && !bankAccountSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(bankAccountSearchEntity.getSortBy());
			validateEntityFieldName(bankAccountSearchEntity.getSortBy(), BankAccountEntity.class);
		}

		String orderBy = "order by accountNumber";
		if (bankAccountSearchEntity.getSortBy() != null && !bankAccountSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + bankAccountSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", BankAccountEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (bankAccountSearchEntity.getTenantId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("tenantId =:tenantId");
			paramValues.put("tenantId", bankAccountSearchEntity.getTenantId());
		}
		if (bankAccountSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", bankAccountSearchEntity.getId());
		}
		if (bankAccountSearchEntity.getIds() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id in(:ids) ");
			paramValues.put("ids", new ArrayList<String>(Arrays.asList(bankAccountSearchEntity.getIds().split(","))));
		}
		if (bankAccountSearchEntity.getBankBranchId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("bankBranchId =:bankBranch");
			paramValues.put("bankBranch", bankAccountSearchEntity.getBankBranchId());
		}
		if (bankAccountSearchEntity.getChartOfAccountId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("chartOfAccountId =:chartOfAccount");
			paramValues.put("chartOfAccount", bankAccountSearchEntity.getChartOfAccountId());
		}
		if (bankAccountSearchEntity.getFundId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("fundId =:fund");
			paramValues.put("fund", bankAccountSearchEntity.getFundId());
		}
		if (bankAccountSearchEntity.getAccountNumber() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("accountNumber =:accountNumber");
			paramValues.put("accountNumber", bankAccountSearchEntity.getAccountNumber());
		}
		if (bankAccountSearchEntity.getAccountType() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("accountType =:accountType");
			paramValues.put("accountType", bankAccountSearchEntity.getAccountType());
		}
		if (bankAccountSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", bankAccountSearchEntity.getDescription());
		}
		if (bankAccountSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", bankAccountSearchEntity.getActive());
		}
		if (bankAccountSearchEntity.getPayTo() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("payTo =:payTo");
			paramValues.put("payTo", bankAccountSearchEntity.getPayTo());
		}
		if (bankAccountSearchEntity.getType() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("type =:type");
			paramValues.put("type", bankAccountSearchEntity.getType().toString());
		}

		Pagination<BankAccount> page = new Pagination<>();
		if (bankAccountSearchEntity.getOffset() != null) {
			page.setOffset(bankAccountSearchEntity.getOffset());
		}
		if (bankAccountSearchEntity.getPageSize() != null) {
			page.setPageSize(bankAccountSearchEntity.getPageSize());
		}

		if (params.length() > 0) {

			searchQuery = searchQuery.replace(":condition", " where " + params.toString());

		} else

			searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<BankAccount>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(BankAccountEntity.class);

		List<BankAccountEntity> bankAccountEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(bankAccountEntities.size());

		List<BankAccount> bankaccounts = new ArrayList<>();
		for (BankAccountEntity bankAccountEntity : bankAccountEntities) {

			bankaccounts.add(bankAccountEntity.toDomain());
		}
		page.setPagedData(bankaccounts);

		return page;
	}

	public BankAccountEntity findById(BankAccountEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<BankAccountEntity> bankaccounts = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(BankAccountEntity.class));
		if (bankaccounts.isEmpty()) {
			return null;
		} else {
			return bankaccounts.get(0);
		}

	}

}