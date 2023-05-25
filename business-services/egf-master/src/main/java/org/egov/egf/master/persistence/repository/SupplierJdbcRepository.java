package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.Supplier;
import org.egov.egf.master.domain.model.SupplierSearch;
import org.egov.egf.master.persistence.entity.SupplierEntity;
import org.egov.egf.master.persistence.entity.SupplierSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SupplierJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(SupplierJdbcRepository.class);

	static {
		LOG.debug("init supplier");
		init(SupplierEntity.class);
		LOG.debug("end init supplier");
	}

	public SupplierJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public SupplierEntity create(SupplierEntity entity) {
		super.create(entity);
		return entity;
	}

	public SupplierEntity update(SupplierEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<Supplier> search(SupplierSearch domain) {
		SupplierSearchEntity supplierSearchEntity = new SupplierSearchEntity();
		supplierSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		 StringBuffer params = new StringBuffer();

		if (supplierSearchEntity.getSortBy() != null && !supplierSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(supplierSearchEntity.getSortBy());
			validateEntityFieldName(supplierSearchEntity.getSortBy(), SupplierEntity.class);
		}

		String orderBy = "order by name";
		if (supplierSearchEntity.getSortBy() != null && !supplierSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + supplierSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", SupplierEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
	        if (supplierSearchEntity.getTenantId() != null) {
	                if (params.length() > 0) {
	                    params.append(" and ");
	                }
	                params.append("tenantId =:tenantId");
	                paramValues.put("tenantId", supplierSearchEntity.getTenantId());
	        }
		if (supplierSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", supplierSearchEntity.getId());
		}
		if (supplierSearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(supplierSearchEntity.getIds().split(","))));
                }
		if (supplierSearchEntity.getCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("code =:code");
			paramValues.put("code", supplierSearchEntity.getCode());
		}
		if (supplierSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", supplierSearchEntity.getName());
		}
		if (supplierSearchEntity.getAddress() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("address =:address");
			paramValues.put("address", supplierSearchEntity.getAddress());
		}
		if (supplierSearchEntity.getMobile() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("mobile =:mobile");
			paramValues.put("mobile", supplierSearchEntity.getMobile());
		}
		if (supplierSearchEntity.getEmail() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("email =:email");
			paramValues.put("email", supplierSearchEntity.getEmail());
		}
		if (supplierSearchEntity.getDescription() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("description =:description");
			paramValues.put("description", supplierSearchEntity.getDescription());
		}
		if (supplierSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", supplierSearchEntity.getActive());
		}
		if (supplierSearchEntity.getPanNo() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("panNo =:panNo");
			paramValues.put("panNo", supplierSearchEntity.getPanNo());
		}
		if (supplierSearchEntity.getTinNo() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("tinNo =:tinNo");
			paramValues.put("tinNo", supplierSearchEntity.getTinNo());
		}
		if (supplierSearchEntity.getRegistationNo() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("registationNo =:registationNo");
			paramValues.put("registationNo", supplierSearchEntity.getRegistationNo());
		}
		if (supplierSearchEntity.getBankAccountId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("bankAccountId =:bankAccount");
			paramValues.put("bankAccount", supplierSearchEntity.getBankAccountId());
		}
		if (supplierSearchEntity.getIfscCode() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("ifscCode =:ifscCode");
			paramValues.put("ifscCode", supplierSearchEntity.getIfscCode());
		}
		if (supplierSearchEntity.getBankId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("bankId =:bank");
			paramValues.put("bank", supplierSearchEntity.getBankId());
		}

		Pagination<Supplier> page = new Pagination<>();
		if (supplierSearchEntity.getOffset() != null) {
			page.setOffset(supplierSearchEntity.getOffset());
		}
		if (supplierSearchEntity.getPageSize() != null) {
			page.setPageSize(supplierSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<Supplier>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(SupplierEntity.class);

		List<SupplierEntity> supplierEntities = namedParameterJdbcTemplate.query(searchQuery.toString(), paramValues,
				row);

		page.setTotalResults(supplierEntities.size());

		List<Supplier> suppliers = new ArrayList<>();
		for (SupplierEntity supplierEntity : supplierEntities) {

			suppliers.add(supplierEntity.toDomain());
		}
		page.setPagedData(suppliers);

		return page;
	}

	public SupplierEntity findById(SupplierEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<SupplierEntity> suppliers = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(SupplierEntity.class));
		if (suppliers.isEmpty()) {
			return null;
		} else {
			return suppliers.get(0);
		}

	}

}