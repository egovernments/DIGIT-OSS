package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.persistence.entity.BankBranchEntity;
import org.egov.egf.master.persistence.entity.BankBranchSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class BankBranchJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(BankBranchJdbcRepository.class);

	static {
		LOG.debug("init bankBranch");
		init(BankBranchEntity.class);
		LOG.debug("end init bankBranch");
	}

	public BankBranchJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public BankBranchEntity create(BankBranchEntity entity) {
		super.create(entity);
		return entity;
	}

	public BankBranchEntity update(BankBranchEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<BankBranch> search(BankBranchSearch domain) {
		BankBranchSearchEntity bankBranchSearchEntity = new BankBranchSearchEntity();
		bankBranchSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (bankBranchSearchEntity.getSortBy() != null && !bankBranchSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(bankBranchSearchEntity.getSortBy());
			validateEntityFieldName(bankBranchSearchEntity.getSortBy(), BankBranchEntity.class);
		}

		String orderBy = "order by name";
		if (bankBranchSearchEntity.getSortBy() != null && !bankBranchSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + bankBranchSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", BankBranchEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (bankBranchSearchEntity.getTenantId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("tenantId =:tenantId");
			paramValues.put("tenantId", bankBranchSearchEntity.getTenantId());
		}
		if (bankBranchSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", bankBranchSearchEntity.getId());
		}
		if (bankBranchSearchEntity.getIds() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id in(:ids) ");
			paramValues.put("ids", new ArrayList<String>(Arrays.asList(bankBranchSearchEntity.getIds().split(","))));
		}
		if (bankBranchSearchEntity.getBankId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("bankId =:bank");
			paramValues.put("bank", bankBranchSearchEntity.getBankId());
		}
		if (bankBranchSearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", bankBranchSearchEntity.getCode());
		}
		if (bankBranchSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", bankBranchSearchEntity.getName());
		}
		if (bankBranchSearchEntity.getAddress() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("address =:address");
			paramValues.put("address", bankBranchSearchEntity.getAddress());
		}
		if (bankBranchSearchEntity.getAddress2() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("address2 =:address2");
			paramValues.put("address2", bankBranchSearchEntity.getAddress2());
		}
		if (bankBranchSearchEntity.getCity() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("city =:city");
			paramValues.put("city", bankBranchSearchEntity.getCity());
		}
		if (bankBranchSearchEntity.getState() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("state =:state");
			paramValues.put("state", bankBranchSearchEntity.getState());
		}
		if (bankBranchSearchEntity.getPincode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("pincode =:pincode");
			paramValues.put("pincode", bankBranchSearchEntity.getPincode());
		}
		if (bankBranchSearchEntity.getPhone() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("phone =:phone");
			paramValues.put("phone", bankBranchSearchEntity.getPhone());
		}
		if (bankBranchSearchEntity.getFax() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("fax =:fax");
			paramValues.put("fax", bankBranchSearchEntity.getFax());
		}
		if (bankBranchSearchEntity.getContactPerson() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("contactPerson =:contactPerson");
			paramValues.put("contactPerson", bankBranchSearchEntity.getContactPerson());
		}
		if (bankBranchSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", bankBranchSearchEntity.getActive());
		}
		if (bankBranchSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", bankBranchSearchEntity.getDescription());
		}
		if (bankBranchSearchEntity.getMicr() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("micr =:micr");
			paramValues.put("micr", bankBranchSearchEntity.getMicr());
		}

		Pagination<BankBranch> page = new Pagination<>();
		if (bankBranchSearchEntity.getOffset() != null) {
			page.setOffset(bankBranchSearchEntity.getOffset());
		}
		if (bankBranchSearchEntity.getPageSize() != null) {
			page.setPageSize(bankBranchSearchEntity.getPageSize());
		}

		if (params.length() > 0) {

			searchQuery = searchQuery.replace(":condition", " where " + params.toString());

		} else

			searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<BankBranch>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(BankBranchEntity.class);

		List<BankBranchEntity> bankBranchEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(bankBranchEntities.size());

		List<BankBranch> bankbranches = new ArrayList<>();
		for (BankBranchEntity bankBranchEntity : bankBranchEntities) {

			bankbranches.add(bankBranchEntity.toDomain());
		}
		page.setPagedData(bankbranches);

		return page;
	}

	public BankBranchEntity findById(BankBranchEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<BankBranchEntity> bankbranches = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(BankBranchEntity.class));
		if (bankbranches.isEmpty()) {
			return null;
		} else {
			return bankbranches.get(0);
		}

	}

}