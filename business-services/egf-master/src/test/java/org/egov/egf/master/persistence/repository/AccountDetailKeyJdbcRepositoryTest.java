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
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.persistence.entity.AccountDetailKeyEntity;
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
public class AccountDetailKeyJdbcRepositoryTest {

	private AccountDetailKeyJdbcRepository accountDetailKeyJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		accountDetailKeyJdbcRepository = new AccountDetailKeyJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql" })
	public void test_create() {

		AccountDetailKeyEntity accountDetailKey = AccountDetailKeyEntity.builder().id("1").key("1")
				.accountDetailTypeId(getAccountDetailType().getId()).build();
		accountDetailKey.setTenantId("default");
		AccountDetailKeyEntity actualResult = accountDetailKeyJdbcRepository.create(accountDetailKey);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountDetailKey",
				new AccountDetailKeyResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("key")).isEqualTo(actualResult.getKey());

	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql" })
	public void test_create_with_tenantId_null() {

		AccountDetailKeyEntity accountDetailKey = AccountDetailKeyEntity.builder().id("1").key("1")
				.accountDetailTypeId(getAccountDetailType().getId()).build();
		accountDetailKeyJdbcRepository.create(accountDetailKey);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_update() {

		AccountDetailKeyEntity accountDetailKey = AccountDetailKeyEntity.builder().id("1").key("1")
				.accountDetailTypeId(getAccountDetailType().getId()).build();
		accountDetailKey.setTenantId("default");
		AccountDetailKeyEntity actualResult = accountDetailKeyJdbcRepository.update(accountDetailKey);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountDetailKey",
				new AccountDetailKeyResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("key")).isEqualTo(actualResult.getKey());
		assertThat(row.get("accountDetailTypeId")).isEqualTo(actualResult.getAccountDetailTypeId());

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_search() {

		Pagination<AccountDetailKey> page = (Pagination<AccountDetailKey>) accountDetailKeyJdbcRepository
				.search(getAccountDetailKeySearch());
		assertThat(page.getPagedData().get(0).getKey()).isEqualTo("1");

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_search_with_no_parameter() {

		Pagination<AccountDetailKey> page = (Pagination<AccountDetailKey>) accountDetailKeyJdbcRepository
				.search(new AccountDetailKeySearch());
		assertThat(page.getPagedData().get(0).getKey()).isEqualTo("1");
		assertThat(page.getPagedData().get(0).getAccountDetailType().getId()).isEqualTo(getAccountDetailType().getId());

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_find_by_id() {

		AccountDetailKeyEntity accountDetailKeyEntity = AccountDetailKeyEntity.builder().id("1").build();
		accountDetailKeyEntity.setTenantId("default");
		AccountDetailKeyEntity result = accountDetailKeyJdbcRepository.findById(accountDetailKeyEntity);
		assertThat(result.getId()).isEqualTo("1");
		assertThat(result.getKey()).isEqualTo("1");

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		AccountDetailKeyEntity accountDetailKeyEntity = AccountDetailKeyEntity.builder().id("5").build();
		accountDetailKeyEntity.setTenantId("default");
		AccountDetailKeyEntity result = accountDetailKeyJdbcRepository.findById(accountDetailKeyEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_search_invalid_sort_option() {

		AccountDetailKeySearch search = getAccountDetailKeySearch();
		search.setSortBy("desc");
		accountDetailKeyJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailKey.sql", "/sql/insertAccountDetailKey.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		AccountDetailKeySearch search = getAccountDetailKeySearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<AccountDetailKey> page = (Pagination<AccountDetailKey>) accountDetailKeyJdbcRepository
				.search(getAccountDetailKeySearch());
		assertThat(page.getPagedData().get(0).getKey()).isEqualTo("1");

	}

	class AccountDetailKeyResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("key", resultSet.getString("key"));
						put("accountDetailTypeId", resultSet.getString("accountDetailTypeId"));
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

	private AccountDetailKeySearch getAccountDetailKeySearch() {
		AccountDetailKeySearch accountDetailKeySearch = new AccountDetailKeySearch();
		accountDetailKeySearch.setId("1");
		accountDetailKeySearch.setKey("1");
		accountDetailKeySearch.setAccountDetailType(getAccountDetailType());
		accountDetailKeySearch.setPageSize(500);
		accountDetailKeySearch.setOffset(0);
		accountDetailKeySearch.setSortBy("key desc");
		accountDetailKeySearch.setTenantId("default");
		return accountDetailKeySearch;
	}

	private AccountDetailType getAccountDetailType() {
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/acb").active(true).build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}
}