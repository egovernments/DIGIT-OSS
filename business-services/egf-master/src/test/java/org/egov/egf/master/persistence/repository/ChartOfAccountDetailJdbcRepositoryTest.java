package org.egov.egf.master.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.persistence.entity.ChartOfAccountDetailEntity;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Ignore
public class ChartOfAccountDetailJdbcRepositoryTest {

	private ChartOfAccountDetailJdbcRepository chartOfAccountDetailJdbcRepository;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Autowired
        private AccountDetailTypeJdbcRepository accountDetailTypeJdbcRepository;

	@Before
	public void setUp() throws Exception {
		chartOfAccountDetailJdbcRepository = new ChartOfAccountDetailJdbcRepository(
				namedParameterJdbcTemplate,accountDetailTypeJdbcRepository);
	}

	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql" })
	@Sql(scripts = { "/sql/insertChartOfAccountData.sql" })
	@Sql(scripts = { "/sql/clearAccountDetailType.sql" })
	@Sql(scripts = { "/sql/insertAccountDetailType.sql" })
	@Sql(scripts = { "/sql/clearChartOfAccountDetail.sql" })
	@Sql(scripts = { "/sql/insertChartOfAccountDetail.sql" })
	public void testCreate() {
		ChartOfAccountDetailEntity chartOfAccountDetailEntity = getChartOfAccountDetailEntity();
		ChartOfAccountDetailEntity actualResult = chartOfAccountDetailJdbcRepository
				.create(chartOfAccountDetailEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query(
				"SELECT * FROM egf_chartofaccountdetail",
				new ChartOfAccountDetailResultExtractor());
		assertThat(result.get(0).get("id")).isEqualTo("1");
		assertThat(result.get(0).get("chartofaccountid")).isEqualTo("1");
		assertThat(result.get(0).get("accountdetailtypeid")).isEqualTo("1");
	
	}

	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql" })
	@Sql(scripts = { "/sql/insertChartOfAccountData.sql" })
	@Sql(scripts = { "/sql/clearAccountDetailType.sql" })
	@Sql(scripts = { "/sql/insertAccountDetailType.sql" })
	@Sql(scripts = { "/sql/clearChartOfAccountDetail.sql",
			"/sql/insertChartOfAccountDetail.sql" })
	public void testUpdate() {
		ChartOfAccountDetailEntity chartOfAccountDetailEntity = getChartOfAccountDetailEntity();
		ChartOfAccountDetailEntity actualResult = chartOfAccountDetailJdbcRepository
				.update(chartOfAccountDetailEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query(
				"SELECT * FROM egf_chartofaccountdetail order by id asc",
				new ChartOfAccountDetailResultExtractor());
		assertThat(result.get(0).get("id")).isEqualTo("1");
		assertThat(result.get(0).get("chartofaccountid")).isEqualTo("1");
		assertThat(result.get(0).get("accountdetailtypeid")).isEqualTo("1");
	
	}

	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql" })
	@Sql(scripts = { "/sql/insertChartOfAccountData.sql" })
	@Sql(scripts = { "/sql/clearAccountDetailType.sql" })
	@Sql(scripts = { "/sql/insertAccountDetailType.sql" })
	@Sql(scripts = { "/sql/clearChartOfAccountDetail.sql",
			"/sql/insertChartOfAccountDetail.sql" })
	public void testSearch() {
		Pagination<ChartOfAccountDetail> page = (Pagination<ChartOfAccountDetail>) chartOfAccountDetailJdbcRepository
				.search(getChartOfAccountDetailSearch());
		assertThat(page.getPagedData().get(0).getId()).isEqualTo("1");
		assertThat(page.getPagedData().get(0).getChartOfAccount().getId()).isEqualTo("1");
		assertThat(page.getPagedData().get(0).getAccountDetailType().getId()).isEqualTo("1");
	}

	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql" })
	@Sql(scripts = { "/sql/insertChartOfAccountData.sql" })
	@Sql(scripts = { "/sql/clearAccountDetailType.sql" })
	@Sql(scripts = { "/sql/insertAccountDetailType.sql" })
	@Sql(scripts = { "/sql/clearChartOfAccountDetail.sql",
			"/sql/insertChartOfAccountDetail.sql" })
	public void testFindById() {
		ChartOfAccountDetailEntity chartOfAccountDetailEntity = getChartOfAccountDetailEntity();
		ChartOfAccountDetailEntity actualResult = chartOfAccountDetailJdbcRepository
				.findById(chartOfAccountDetailEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query(
				"SELECT * FROM egf_chartofaccountdetail",
				new ChartOfAccountDetailResultExtractor());
		assertThat(result.get(0).get("id")).isEqualTo("1");
		assertThat(result.get(0).get("chartofaccountid")).isEqualTo("1");
		assertThat(result.get(0).get("accountdetailtypeid")).isEqualTo("1");
	}

	class ChartOfAccountDetailResultExtractor implements
			ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet)
				throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("chartofaccountid", resultSet.getString("chartofaccountid"));
						put("accountdetailtypeid", resultSet.getString("accountdetailtypeid"));
						put("createdby", resultSet.getString("createdby"));
						put("createddate", resultSet.getString("createddate"));
						put("lastmodifiedby", resultSet.getBoolean("lastmodifiedby"));
						put("lastmodifieddate", resultSet.getString("lastmodifieddate"));
						put("version", resultSet.getString("version"));
						put("tenantid", resultSet.getString("tenantid"));
					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private ChartOfAccountDetailEntity getChartOfAccountDetailEntity() {
		ChartOfAccountDetailEntity chartOfAccountDetailEntity = new ChartOfAccountDetailEntity();
		ChartOfAccountDetail chartOfAccountDetail = getChartOfAccountDetailDomain();
		chartOfAccountDetailEntity.setId(chartOfAccountDetail.getId());
		chartOfAccountDetailEntity.setChartOfAccountId(chartOfAccountDetail.getChartOfAccount().getId());
		chartOfAccountDetailEntity.setAccountDetailTypeId(chartOfAccountDetail.getAccountDetailType().getId());
		chartOfAccountDetailEntity.setTenantId("default");
		return chartOfAccountDetailEntity;
	}

	private ChartOfAccountDetail getChartOfAccountDetailDomain() {
		ChartOfAccountDetail chartOfAccountDetail = ChartOfAccountDetail
				.builder().id("14632342").accountDetailType(getAccountDetailType()).chartOfAccount(getChartOfAccount()).build();
		chartOfAccountDetail.setChartOfAccount(getChartOfAccount());
		chartOfAccountDetail.setAccountDetailType(getAccountDetailType());
		chartOfAccountDetail.setTenantId("default");
		return chartOfAccountDetail;
	}

	private ChartOfAccount getChartOfAccount() {
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id("1")
				.glcode("glcode").name("name").description("description")
				.isActiveForPosting(true).type('A')
				.classification((long) 123456).functionRequired(true)
				.budgetCheckRequired(true).build();
		chartOfAccount.setTenantId("default");
		return chartOfAccount;
	}

	private AccountDetailType getAccountDetailType() {
		AccountDetailType accountDetailType = AccountDetailType.builder()
				.id("1").name("name").description("description").active(true)
				.build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}

	private ChartOfAccountDetailSearch getChartOfAccountDetailSearch() {
		ChartOfAccountDetailSearch chartOfAccountDetailSearch = new ChartOfAccountDetailSearch();
		chartOfAccountDetailSearch.setId("1");
		chartOfAccountDetailSearch.setPageSize(500);
		chartOfAccountDetailSearch.setOffset(0);
		chartOfAccountDetailSearch.setSortBy("id asc");
		chartOfAccountDetailSearch.setTenantId("default");
		return chartOfAccountDetailSearch;
	}
}