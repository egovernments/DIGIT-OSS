package org.egov.egf.master.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.persistence.entity.ChartOfAccountEntity;
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
public class ChartOfAccountJdbcRepositoryTest {
	
	private ChartOfAccountJdbcRepository chartOfAccountJdbcRepository;
	
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Autowired
        private ChartOfAccountDetailJdbcRepository chartOfAccountDetailJdbcRepository;

	private static final String GL_CODE="glcode";

	private static final String BUDGET_CHECK_REQUIRED="budgetCheckRequired";

	private static final String DEFAULT="default";

	private static final String DESCRIPTION="description";

	private static final String FUNCTIONAL_REQUIRED="functionRequired";

	private static final String MAJOR_CODE="majorCode";

	@Before
	public void setUp() throws Exception {
		chartOfAccountJdbcRepository = new ChartOfAccountJdbcRepository(namedParameterJdbcTemplate,chartOfAccountDetailJdbcRepository);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql" })
	@Sql(scripts = { "/sql/insertChartOfAccountData.sql" })
	public void testCreate() {
		ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
		ChartOfAccountEntity actualResult =chartOfAccountJdbcRepository.create(chartOfAccountEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_chartofaccount",
				new ChartOfAccountResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get(GL_CODE)).isEqualTo(actualResult.getGlcode());
		assertThat(row.get(BUDGET_CHECK_REQUIRED)).isEqualTo(actualResult.getBudgetCheckRequired());
	}
	
	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql", "/sql/insertChartOfAccountData.sql" })
	public void testUpdate() {
		ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
		ChartOfAccountEntity actualResult =chartOfAccountJdbcRepository.update(chartOfAccountEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_chartofaccount",
				new ChartOfAccountResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get(GL_CODE)).isEqualTo(actualResult.getGlcode());
	}
	
	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql", "/sql/insertChartOfAccountData.sql" })
	public void testSearch() {
		Pagination<ChartOfAccount> page = (Pagination<ChartOfAccount>) chartOfAccountJdbcRepository.search(getChartOfAccountSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getGlcode()).isEqualTo(GL_CODE);
		assertThat(page.getPagedData().get(0).getBudgetCheckRequired()).isEqualTo(true);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearChartOfAccount.sql", "/sql/insertChartOfAccountData.sql" })
	public void testFindById() {
		ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
		ChartOfAccountEntity actualResult =chartOfAccountJdbcRepository.findById(chartOfAccountEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_chartofaccount",
				new ChartOfAccountResultExtractor());
		assertThat(result.get(0).get("id")).isEqualTo("2");
		assertThat(result.get(0).get("name")).isEqualTo("name");
		assertThat(result.get(0).get(GL_CODE)).isEqualTo(GL_CODE);
	}
	
/*	@Test
	public void testFindByAccountCodePurposeId() {
		ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
		ChartOfAccountEntity actualResult =chartOfAccountJdbcRepository.findByAccountCodePurposeId(chartOfAccountEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_chartofaccount",
				new ChartOfAccountResultExtractor());
		assertThat(result.get(0).get("id")).isEqualTo("2");
		assertThat(result.get(0).get("name")).isEqualTo("name");
		assertThat(result.get(0).get("glcode")).isEqualTo("glcode");
	}*/
	
	private ChartOfAccountEntity getChartOfAccountEntity() {
		ChartOfAccountEntity chartOfAccountEntity = new ChartOfAccountEntity();
		ChartOfAccount chartOfAccount = getChartOfAccountDomain();
		chartOfAccountEntity.setId(chartOfAccount.getId());
		chartOfAccountEntity.setGlcode(chartOfAccount.getGlcode());
		chartOfAccountEntity.setName(chartOfAccount.getName());
		chartOfAccountEntity.setDescription(chartOfAccount.getDescription());
		chartOfAccountEntity.setIsActiveForPosting(chartOfAccount.getIsActiveForPosting());
		chartOfAccountEntity.setType(chartOfAccount.getType());
		chartOfAccountEntity.setClassification(chartOfAccount.getClassification());
		chartOfAccountEntity.setFunctionRequired(chartOfAccount.getFunctionRequired());
		chartOfAccountEntity.setBudgetCheckRequired(chartOfAccount.getBudgetCheckRequired());
		chartOfAccountEntity.setTenantId(DEFAULT);
		chartOfAccountEntity.setCreatedBy("1");
		chartOfAccountEntity.setLastModifiedBy("1");
		return chartOfAccountEntity;
	}
	
	private ChartOfAccount getChartOfAccountDomain() {
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id("B")
				.glcode(GL_CODE).name("name")
				.description(DESCRIPTION).isActiveForPosting(true)
				.type('B').classification((long) 123456).functionRequired(true)
				.budgetCheckRequired(true).build();
		chartOfAccount.setTenantId(DEFAULT);
		return chartOfAccount;
	}
	
	class ChartOfAccountResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put(GL_CODE, resultSet.getString(GL_CODE));
						put("name", resultSet.getString("name"));
						put("accountCodePurposeId", resultSet.getString("accountCodePurposeId"));
						put(DESCRIPTION, resultSet.getString(DESCRIPTION));
						put("isActiveForPosting", resultSet.getBoolean("isActiveForPosting"));
						put("parentId", resultSet.getString("parentId"));
						put("type", resultSet.getString("type"));
						put(FUNCTIONAL_REQUIRED, resultSet.getString(FUNCTIONAL_REQUIRED));
						put(BUDGET_CHECK_REQUIRED, resultSet.getString(BUDGET_CHECK_REQUIRED));
						put(MAJOR_CODE, resultSet.getString(MAJOR_CODE));
						put("isSubLedger", resultSet.getString("isSubLedger"));
						put(FUNCTIONAL_REQUIRED, resultSet.getBoolean(FUNCTIONAL_REQUIRED));
						put(BUDGET_CHECK_REQUIRED, resultSet.getBoolean(BUDGET_CHECK_REQUIRED));
						put(MAJOR_CODE, resultSet.getString(MAJOR_CODE));
					}
				};

				rows.add(row);
			}
			return rows;
		}
	}
	
	private ChartOfAccountSearch getChartOfAccountSearch() {
		ChartOfAccountSearch chartOfAccountSearch = new ChartOfAccountSearch();
		chartOfAccountSearch.setId("2");
		//chartOfAccountSearch.setGlcode("glcode");
		chartOfAccountSearch.setName("name");
		chartOfAccountSearch.setDescription(DESCRIPTION);
		chartOfAccountSearch.setIsActiveForPosting(true);
		chartOfAccountSearch.setType(Character.valueOf('B'));
		chartOfAccountSearch.setClassification(123456l);
		chartOfAccountSearch.setBudgetCheckRequired(true);
		chartOfAccountSearch.setIsSubLedger(true);
		chartOfAccountSearch.setMajorCode(MAJOR_CODE);
		chartOfAccountSearch.setFunctionRequired(true);
		chartOfAccountSearch.setAccountCodePurpose(getAccountCodePurpose());
		chartOfAccountSearch.setParentId(getParent());
		chartOfAccountSearch.setPageSize(500);
		chartOfAccountSearch.setOffset(0);
		chartOfAccountSearch.setSortBy("name desc");
		chartOfAccountSearch.setTenantId(DEFAULT);
		return chartOfAccountSearch;
	}
	
	private ChartOfAccount getParent(){
		return ChartOfAccount.builder().id("1").glcode(GL_CODE).name("name")
				.isActiveForPosting(true).type(Character.valueOf('B')).classification(123456l)
				.isSubLedger(true).accountCodePurpose(getAccountCodePurpose()).budgetCheckRequired(true)
				.majorCode(MAJOR_CODE).functionRequired(true).build();
	}
	
	private AccountCodePurpose getAccountCodePurpose(){
		return AccountCodePurpose.builder().id("P").name("accountpurpose").build();
	}
}