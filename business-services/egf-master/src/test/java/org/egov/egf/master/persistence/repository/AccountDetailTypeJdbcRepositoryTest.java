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
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.persistence.entity.AccountDetailTypeEntity;
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
public class AccountDetailTypeJdbcRepositoryTest {

	private AccountDetailTypeJdbcRepository accountDetailTypeJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		accountDetailTypeJdbcRepository = new AccountDetailTypeJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql" })
	public void test_create() {

		AccountDetailTypeEntity accountDetailType = AccountDetailTypeEntity.builder().id("1").tablename("contractor")
				.description("contractor").fullyQualifiedName("abc/contractor").name("name").active(true).build();
		accountDetailType.setTenantId("default");
		AccountDetailTypeEntity actualResult = accountDetailTypeJdbcRepository.create(accountDetailType);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountDetailType",
				new AccountDetailTypeResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("tableName")).isEqualTo(actualResult.getTablename());
		assertThat(row.get("fullyQualifiedName")).isEqualTo(actualResult.getFullyQualifiedName());

	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearAccountDetailType.sql" })
	public void test_create_with_tenantId_null() {

		AccountDetailTypeEntity accountDetailType = AccountDetailTypeEntity.builder().tablename("contractor")
				.fullyQualifiedName("abc/contractor").name("name").active(true).build();
		accountDetailTypeJdbcRepository.create(accountDetailType);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_update() {

		AccountDetailTypeEntity accountDetailType = AccountDetailTypeEntity.builder().tablename("contractorU")
				.description("contractor").fullyQualifiedName("abc/contractorU").name("nameU").active(true).id("1")
				.build();
		accountDetailType.setTenantId("default");
		AccountDetailTypeEntity actualResult = accountDetailTypeJdbcRepository.update(accountDetailType);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountDetailType",
				new AccountDetailTypeResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_search() {

		Pagination<AccountDetailType> page = (Pagination<AccountDetailType>) accountDetailTypeJdbcRepository
				.search(getAccountDetailTypeSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_search_with_no_parameter() {

		Pagination<AccountDetailType> page = (Pagination<AccountDetailType>) accountDetailTypeJdbcRepository
				.search(new AccountDetailTypeSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_find_by_id() {

		AccountDetailTypeEntity accountDetailTypeEntity = AccountDetailTypeEntity.builder().id("1").build();
		accountDetailTypeEntity.setTenantId("default");
		AccountDetailTypeEntity result = accountDetailTypeJdbcRepository.findById(accountDetailTypeEntity);
		assertThat(result.getId()).isEqualTo("1");
		assertThat(result.getName()).isEqualTo("name");

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		AccountDetailTypeEntity accountDetailTypeEntity = AccountDetailTypeEntity.builder().id("5").build();
		accountDetailTypeEntity.setTenantId("default");
		AccountDetailTypeEntity result = accountDetailTypeJdbcRepository.findById(accountDetailTypeEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_search_invalid_sort_option() {

		AccountDetailTypeSearch search = getAccountDetailTypeSearch();
		search.setSortBy("desc");
		accountDetailTypeJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearAccountDetailType.sql", "/sql/insertAccountDetailType.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		AccountDetailTypeSearch search = getAccountDetailTypeSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<AccountDetailType> page = (Pagination<AccountDetailType>) accountDetailTypeJdbcRepository
				.search(getAccountDetailTypeSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	class AccountDetailTypeResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("name", resultSet.getString("name"));
						put("tableName", resultSet.getString("tableName"));
						put("active", resultSet.getBoolean("active"));
						put("fullyQualifiedName", resultSet.getString("fullyQualifiedName"));
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

	private AccountDetailTypeSearch getAccountDetailTypeSearch() {
		AccountDetailTypeSearch accountDetailTypeSearch = new AccountDetailTypeSearch();
		accountDetailTypeSearch.setId("1");
		accountDetailTypeSearch.setName("name");
		accountDetailTypeSearch.setTableName("contractor");
		accountDetailTypeSearch.setActive(true);
		accountDetailTypeSearch.setFullyQualifiedName("abc/contractor");
		accountDetailTypeSearch.setPageSize(500);
		accountDetailTypeSearch.setOffset(0);
		accountDetailTypeSearch.setSortBy("name desc");
		return accountDetailTypeSearch;
	}

}