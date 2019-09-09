package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.FinancialYear;
import org.egov.egf.master.domain.model.FinancialYearSearch;
import org.egov.egf.master.persistence.entity.FinancialYearEntity;
import org.egov.egf.master.persistence.entity.FinancialYearSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;

@Service
public class FinancialYearJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(FinancialYearJdbcRepository.class);

	static {
		LOG.debug("init financialYear");
		init(FinancialYearEntity.class);
		LOG.debug("end init financialYear");
	}

	public FinancialYearEntity create(FinancialYearEntity entity) {
		super.create(entity);
		return entity;
	}

	public FinancialYearEntity update(FinancialYearEntity entity) {
		super.update(entity);
		return entity;
	}

	public Pagination<FinancialYear> search(FinancialYearSearch domain) {
		FinancialYearSearchEntity financialYearSearchEntity = new FinancialYearSearchEntity();
		financialYearSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		searchQuery = searchQuery.replace(":tablename", FinancialYearEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		if (financialYearSearchEntity.getSortBy() != null && !financialYearSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(financialYearSearchEntity.getSortBy());
			validateEntityFieldName(financialYearSearchEntity.getSortBy(), FinancialYearEntity.class);
		}

		String orderBy = "order by finYearRange asc";
		if (financialYearSearchEntity.getSortBy() != null && !financialYearSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + financialYearSearchEntity.getSortBy();
		}

		// implement jdbc specfic search
		if (financialYearSearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", financialYearSearchEntity.getTenantId());
                }
		if (financialYearSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", financialYearSearchEntity.getId());
		}
		if (financialYearSearchEntity.getFinYearRange() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("finYearRange =:finYearRange");
			paramValues.put("finYearRange", financialYearSearchEntity.getFinYearRange());
		}
		if (financialYearSearchEntity.getStartingDate() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("startingDate =:startingDate");
			paramValues.put("startingDate", financialYearSearchEntity.getStartingDate());
		}
		if (financialYearSearchEntity.getEndingDate() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("endingDate =:endingDate");
			paramValues.put("endingDate", financialYearSearchEntity.getEndingDate());
		}
		if (financialYearSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", financialYearSearchEntity.getActive());
		}
		if (financialYearSearchEntity.getIsActiveForPosting() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("isActiveForPosting =:isActiveForPosting");
			paramValues.put("isActiveForPosting", financialYearSearchEntity.getIsActiveForPosting());
		}
		if (financialYearSearchEntity.getIsClosed() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("isClosed =:isClosed");
			paramValues.put("isClosed", financialYearSearchEntity.getIsClosed());
		}
		if (financialYearSearchEntity.getTransferClosingBalance() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("transferClosingBalance =:transferClosingBalance");
			paramValues.put("transferClosingBalance", financialYearSearchEntity.getTransferClosingBalance());
		}
		if (financialYearSearchEntity.getAsOnDate() != null) {
		    if (params.length() > 0) {
		        params.append(" and ");
		    }
		    params.append("startingDate <=:asOnDate and endingDate >= :asOnDate");
		    paramValues.put("asOnDate", financialYearSearchEntity.getAsOnDate());
		}

		Pagination<FinancialYear> page = new Pagination<>();
		if (financialYearSearchEntity.getOffset() != null) {
			page.setOffset(financialYearSearchEntity.getOffset());
		}
		if (financialYearSearchEntity.getPageSize() != null) {
			page.setPageSize(financialYearSearchEntity.getPageSize());
		}

		if (params.length() > 0) {

			searchQuery = searchQuery.replace(":condition", " where " + params.toString());

		} else {
			searchQuery = searchQuery.replace(":condition", "");
		}

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<FinancialYear>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(FinancialYearEntity.class);

		List<FinancialYearEntity> financialYearEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(financialYearEntities.size());

		List<FinancialYear> financialyears = new ArrayList<>();
		for (FinancialYearEntity financialYearEntity : financialYearEntities) {

			financialyears.add(financialYearEntity.toDomain());
		}
		page.setPagedData(financialyears);

		return page;
	}

	public FinancialYearEntity findById(FinancialYearEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());
		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<FinancialYearEntity> financialyears = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(FinancialYearEntity.class));
		if (financialyears.isEmpty()) {
			return null;
		} else {
			return financialyears.get(0);
		}

	}

}