package org.egov.egf.master.persistence.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.common.persistence.repository.JdbcRepository;
import org.egov.egf.master.domain.model.FiscalPeriod;
import org.egov.egf.master.domain.model.FiscalPeriodSearch;
import org.egov.egf.master.persistence.entity.FiscalPeriodEntity;
import org.egov.egf.master.persistence.entity.FiscalPeriodSearchEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FiscalPeriodJdbcRepository extends JdbcRepository {
	private static final Logger LOG = LoggerFactory.getLogger(FiscalPeriodJdbcRepository.class);

	static {
		LOG.debug("init fiscalPeriod");
		init(FiscalPeriodEntity.class);
		LOG.debug("end init fiscalPeriod");
	}

	public FiscalPeriodJdbcRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
	}

	public FiscalPeriodEntity create(FiscalPeriodEntity entity) {
		super.create(entity);
		return entity;
	}

	public FiscalPeriodEntity update(FiscalPeriodEntity entity) {
		super.update(entity);
		return entity;

	}

	public Pagination<FiscalPeriod> search(FiscalPeriodSearch domain) {
		FiscalPeriodSearchEntity fiscalPeriodSearchEntity = new FiscalPeriodSearchEntity();
		fiscalPeriodSearchEntity.toEntity(domain);

		String searchQuery = "select :selectfields from :tablename :condition  :orderby   ";

		Map<String, Object> paramValues = new HashMap<>();
		StringBuffer params = new StringBuffer();

		if (fiscalPeriodSearchEntity.getSortBy() != null && !fiscalPeriodSearchEntity.getSortBy().isEmpty()) {
			validateSortByOrder(fiscalPeriodSearchEntity.getSortBy());
			validateEntityFieldName(fiscalPeriodSearchEntity.getSortBy(), FiscalPeriodEntity.class);
		}

		String orderBy = "order by name";
		if (fiscalPeriodSearchEntity.getSortBy() != null && !fiscalPeriodSearchEntity.getSortBy().isEmpty()) {
			orderBy = "order by " + fiscalPeriodSearchEntity.getSortBy();
		}

		searchQuery = searchQuery.replace(":tablename", FiscalPeriodEntity.TABLE_NAME);

		searchQuery = searchQuery.replace(":selectfields", " * ");

		// implement jdbc specfic search
		if (fiscalPeriodSearchEntity.getTenantId() != null) {
                    if (params.length() > 0) {
                        params.append(" and ");
                    }
                    params.append("tenantId =:tenantId");
                    paramValues.put("tenantId", fiscalPeriodSearchEntity.getTenantId());
                }
		if (fiscalPeriodSearchEntity.getId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("id =:id");
			paramValues.put("id", fiscalPeriodSearchEntity.getId());
		}
		if (fiscalPeriodSearchEntity.getIds() != null) {
                          if (params.length() > 0) {
                                  params.append(" and ");
                          }
                          params.append("id in(:ids) ");
                          paramValues.put("ids", new ArrayList<String>(Arrays.asList(fiscalPeriodSearchEntity.getIds().split(","))));
                }
		if (fiscalPeriodSearchEntity.getName() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("name =:name");
			paramValues.put("name", fiscalPeriodSearchEntity.getName());
		}
		if (fiscalPeriodSearchEntity.getFinancialYearId() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("financialYearId =:financialYear");
			paramValues.put("financialYear", fiscalPeriodSearchEntity.getFinancialYearId());
		}
		if (fiscalPeriodSearchEntity.getStartingDate() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("startingDate =:startingDate");
			paramValues.put("startingDate", fiscalPeriodSearchEntity.getStartingDate());
		}
		if (fiscalPeriodSearchEntity.getEndingDate() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("endingDate =:endingDate");
			paramValues.put("endingDate", fiscalPeriodSearchEntity.getEndingDate());
		}
		if (fiscalPeriodSearchEntity.getActive() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("active =:active");
			paramValues.put("active", fiscalPeriodSearchEntity.getActive());
		}
		if (fiscalPeriodSearchEntity.getIsActiveForPosting() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("isActiveForPosting =:isActiveForPosting");
			paramValues.put("isActiveForPosting", fiscalPeriodSearchEntity.getIsActiveForPosting());
		}
		if (fiscalPeriodSearchEntity.getIsClosed() != null) {
			if (params.length() > 0) {
				params.append(" and ");
			}
			params.append("isClosed =:isClosed");
			paramValues.put("isClosed", fiscalPeriodSearchEntity.getIsClosed());
		}

		Pagination<FiscalPeriod> page = new Pagination<>();
		if (fiscalPeriodSearchEntity.getOffset() != null) {
			page.setOffset(fiscalPeriodSearchEntity.getOffset());
		}
		if (fiscalPeriodSearchEntity.getPageSize() != null) {
			page.setPageSize(fiscalPeriodSearchEntity.getPageSize());
		}

		
		if (params.length() > 0) {
		
		searchQuery = searchQuery.replace(":condition", " where " +
		params.toString());
		
		} else 
		
		searchQuery = searchQuery.replace(":condition", "");

		searchQuery = searchQuery.replace(":orderby", orderBy);

		page = (Pagination<FiscalPeriod>) getPagination(searchQuery, page, paramValues);
		searchQuery = searchQuery + " :pagination";

		searchQuery = searchQuery.replace(":pagination",
				"limit " + page.getPageSize() + " offset " + page.getOffset() * page.getPageSize());

		BeanPropertyRowMapper row = new BeanPropertyRowMapper(FiscalPeriodEntity.class);

		List<FiscalPeriodEntity> fiscalPeriodEntities = namedParameterJdbcTemplate.query(searchQuery.toString(),
				paramValues, row);

		page.setTotalResults(fiscalPeriodEntities.size());

		List<FiscalPeriod> fiscalperiods = new ArrayList<>();
		for (FiscalPeriodEntity fiscalPeriodEntity : fiscalPeriodEntities) {

			fiscalperiods.add(fiscalPeriodEntity.toDomain());
		}
		page.setPagedData(fiscalperiods);

		return page;
	}

	public FiscalPeriodEntity findById(FiscalPeriodEntity entity) {
		List<String> list = allIdentitiferFields.get(entity.getClass().getSimpleName());

		Map<String, Object> paramValues = new HashMap<>();

		for (String s : list) {
			paramValues.put(s, getValue(getField(entity, s), entity));
		}

		List<FiscalPeriodEntity> fiscalperiods = namedParameterJdbcTemplate.query(
				getByIdQuery.get(entity.getClass().getSimpleName()).toString(), paramValues,
				new BeanPropertyRowMapper(FiscalPeriodEntity.class));
		if (fiscalperiods.isEmpty()) {
			return null;
		} else {
			return fiscalperiods.get(0);
		}

	}

}