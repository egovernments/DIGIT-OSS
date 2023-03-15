package org.egov.egf.master.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNull;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.persistence.entity.AccountCodePurposeEntity;
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

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Ignore
public class AccountCodePurposeJdbcRepositoryTest {

	private AccountCodePurposeJdbcRepository accountCodePurposeJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		accountCodePurposeJdbcRepository = new AccountCodePurposeJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql" })
	public void test_create() {

		AccountCodePurposeEntity accountCodePurpose = AccountCodePurposeEntity.builder().id("1").name("name").build();
		accountCodePurpose.setTenantId("default");
		AccountCodePurposeEntity actualResult = accountCodePurposeJdbcRepository.create(accountCodePurpose);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountCodePurpose",
				new AccountCodePurposeResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());

	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql" })
	public void test_create_with_tenantId_null() {

		AccountCodePurposeEntity accountCodePurpose = AccountCodePurposeEntity.builder().name("name").build();
		accountCodePurposeJdbcRepository.create(accountCodePurpose);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_update() {

		AccountCodePurposeEntity accountCodePurpose = AccountCodePurposeEntity.builder().id("1").name("nameU").build();
		accountCodePurpose.setTenantId("default");
		AccountCodePurposeEntity actualResult = accountCodePurposeJdbcRepository.update(accountCodePurpose);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountCodePurpose",
				new AccountCodePurposeResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_search() {

		Pagination<AccountCodePurpose> page = (Pagination<AccountCodePurpose>) accountCodePurposeJdbcRepository
				.search(getAccountCodePurposeSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_search_with_no_parameter() {

		Pagination<AccountCodePurpose> page = (Pagination<AccountCodePurpose>) accountCodePurposeJdbcRepository
				.search(new AccountCodePurposeSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_find_by_id() {

		AccountCodePurposeEntity accountCodePurposeEntity = AccountCodePurposeEntity.builder().id("1").build();
		accountCodePurposeEntity.setTenantId("default");
		AccountCodePurposeEntity result = accountCodePurposeJdbcRepository.findById(accountCodePurposeEntity);
		assertThat(result.getId()).isEqualTo("1");
		assertThat(result.getName()).isEqualTo("name");

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		AccountCodePurposeEntity accountCodePurposeEntity = AccountCodePurposeEntity.builder().id("5").build();
		accountCodePurposeEntity.setTenantId("default");
		AccountCodePurposeEntity result = accountCodePurposeJdbcRepository.findById(accountCodePurposeEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_search_invalid_sort_option() {

		AccountCodePurposeSearch search = getAccountCodePurposeSearch();
		search.setSortBy("desc");
		accountCodePurposeJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountCodePurpose.sql", "/sql/insertAccountCodePurposeData.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		AccountCodePurposeSearch search = getAccountCodePurposeSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<AccountCodePurpose> page = (Pagination<AccountCodePurpose>) accountCodePurposeJdbcRepository
				.search(getAccountCodePurposeSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");

	}

	class AccountCodePurposeResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("name", resultSet.getString("name"));
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

	private AccountCodePurposeSearch getAccountCodePurposeSearch() {
		AccountCodePurposeSearch accountCodePurposeSearch = new AccountCodePurposeSearch();
		accountCodePurposeSearch.setId("1");
		accountCodePurposeSearch.setName("name");
		accountCodePurposeSearch.setPageSize(500);
		accountCodePurposeSearch.setOffset(0);
		accountCodePurposeSearch.setSortBy("name desc");
		return accountCodePurposeSearch;
	}

}