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
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankSearch;
import org.egov.egf.master.persistence.entity.BankEntity;
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
public class BankJdbcRepositoryTest {

	private BankJdbcRepository bankJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		bankJdbcRepository = new BankJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql" })
	public void testCreate() {
		BankEntity bankEntity = getBankEntity();
		BankEntity actualResult = bankJdbcRepository.create(bankEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_bank",
				new BankResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());
	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void testUpdate() {
		BankEntity bankEntity = getBankEntity();
		BankEntity actualResult = bankJdbcRepository.update(bankEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_bank",
				new BankResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());
	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void testSearch() {
		Pagination<Bank> page = (Pagination<Bank>) bankJdbcRepository.search(getBankSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void testFindById() {
		BankEntity bankEntity = BankEntity.builder().id("2").build();
		bankEntity.setTenantId("default");
		BankEntity result = bankJdbcRepository.findById(bankEntity);
		assertThat(result.getId()).isEqualTo("2");
		assertThat(result.getName()).isEqualTo("name");
		assertThat(result.getCode()).isEqualTo("code");
	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearBank.sql" })
	public void test_create_with_tenantId_null() {

		BankEntity bank = BankEntity.builder().code("code").name("name").active(true).build();
		bankJdbcRepository.create(bank);

	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void test_search_with_no_parameter() {

		Pagination<Bank> page = (Pagination<Bank>) bankJdbcRepository.search(new BankSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		BankEntity bankEntity = BankEntity.builder().id("5").build();
		bankEntity.setTenantId("default");
		BankEntity result = bankJdbcRepository.findById(bankEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void test_search_invalid_sort_option() {

		BankSearch search = getBankSearch();
		search.setSortBy("desc");
		bankJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/insertBank.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		BankSearch search = getBankSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<Bank> page = (Pagination<Bank>) bankJdbcRepository.search(getBankSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	class BankResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("code", resultSet.getString("code"));
						put("name", resultSet.getString("name"));
						put("description", resultSet.getString("description"));
						put("active", resultSet.getBoolean("active"));
						put("type", resultSet.getString("type"));
					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private BankEntity getBankEntity() {
		BankEntity bankEntity = new BankEntity();
		Bank bank = getBankDomain();
		bankEntity.setId(bank.getId());
		bankEntity.setCode(bank.getCode());
		bankEntity.setName(bank.getName());
		bankEntity.setDescription(bank.getDescription());
		bankEntity.setType(bank.getType());
		bankEntity.setActive(bank.getActive());
		bankEntity.setTenantId(bank.getTenantId());
		return bankEntity;
	}

	private Bank getBankDomain() {
		Bank bank = new Bank();
		bank.setId("134235");
		bank.setCode("code");
		bank.setName("name");
		bank.setDescription("description");
		bank.setType("type");
		bank.setActive(true);
		bank.setTenantId("default");
		return bank;
	}

	private BankSearch getBankSearch() {
		BankSearch bankSearch = new BankSearch();
		bankSearch.setName("name");
		bankSearch.setCode("code");
		bankSearch.setPageSize(500);
		bankSearch.setOffset(0);
		bankSearch.setSortBy("name desc");
		return bankSearch;
	}
}