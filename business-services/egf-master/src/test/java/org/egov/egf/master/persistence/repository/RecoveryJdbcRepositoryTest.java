package org.egov.egf.master.persistence.repository;

import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.persistence.entity.RecoveryEntity;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Ignore
public class RecoveryJdbcRepositoryTest {

	private RecoveryJdbcRepository recoveryJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		recoveryJdbcRepository = new RecoveryJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearRecovery.sql" })
	public void test_create() {

		RecoveryEntity recovery = RecoveryEntity.builder().id("2374257").code("code").name("name").active(true)
				.mode('M').accountNumber("30492234547").flat(100.00).ifscCode("ifsccode").chartOfAccountId("1").remittanceMode('M').remitted("test").build();
		recovery.setTenantId("default");
		RecoveryEntity actualResult = recoveryJdbcRepository.create(recovery);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_recovery",
				new RecoveryResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());

	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearRecovery.sql" })
	public void test_create_with_tenantId_null() {

		RecoveryEntity recovery = RecoveryEntity.builder().id("2374257").code("code").name("name").active(true)
				.mode('M').accountNumber("30492234547").flat(100.00).ifscCode("ifsccode").chartOfAccountId("1").remittanceMode('M').remitted("test").build();
		recoveryJdbcRepository.create(recovery);

	}

	@Test
	@Sql(scripts = { "/sql/clearRecovery.sql", "/sql/insertRecoveryData.sql" })
	public void test_update() {

		RecoveryEntity recovery = RecoveryEntity.builder().id("2374257").code("code").name("name").active(true)
				.mode('M').accountNumber("30492234547").flat(100.00).ifscCode("ifsccode").chartOfAccountId("1").remittanceMode('M').remitted("test").build();
		recovery.setTenantId("default");
		RecoveryEntity actualResult = recoveryJdbcRepository.update(recovery);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_recovery",
				new RecoveryResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());

	}

	@Test
	@Sql(scripts = { "/sql/clearRecovery.sql", "/sql/insertRecoveryData.sql" })
	public void test_search() {

		Pagination<Recovery> page = (Pagination<Recovery>) recoveryJdbcRepository.search(getRecoverySearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearRecovery.sql", "/sql/insertRecoveryData.sql" })
	public void test_find_by_id() {

		RecoveryEntity recoveryEntity = RecoveryEntity.builder().id("2374257").build();
		recoveryEntity.setTenantId("default");
		RecoveryEntity result = recoveryJdbcRepository.findById(recoveryEntity);
		assertThat(result.getId()).isEqualTo("2374257");
		assertThat(result.getName()).isEqualTo("name");
		assertThat(result.getCode()).isEqualTo("code");

	}

	@Test
	@Sql(scripts = { "/sql/clearRecovery.sql", "/sql/insertRecoveryData.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		RecoveryEntity recoveryEntity = RecoveryEntity.builder().id("5").build();
		recoveryEntity.setTenantId("default");
		RecoveryEntity result = recoveryJdbcRepository.findById(recoveryEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearRecovery.sql", "/sql/insertRecoveryData.sql" })
	public void test_search_invalid_sort_option() {

		RecoverySearch search = getRecoverySearch();
		search.setSortBy("desc");
		recoveryJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearRecovery.sql", "/sql/insertRecoveryData.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		RecoverySearch search = getRecoverySearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<Recovery> page = (Pagination<Recovery>) recoveryJdbcRepository.search(getRecoverySearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	class RecoveryResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("name", resultSet.getString("name"));
						put("code", resultSet.getString("code"));
						put("active", resultSet.getBoolean("active"));
						put("createdBy", resultSet.getString("createdBy"));
						put("createdDate", resultSet.getString("createdDate"));
						put("lastModifiedBy", resultSet.getString("lastModifiedBy"));
						put("lastModifiedDate", resultSet.getString("lastModifiedDate"));
					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private RecoverySearch getRecoverySearch() {
		RecoverySearch recoverySearch = new RecoverySearch();
		recoverySearch.setName("name");
		recoverySearch.setCode("code");
		recoverySearch.setPageSize(500);
		recoverySearch.setOffset(0);
		recoverySearch.setSortBy("name desc");
		return recoverySearch;
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
}