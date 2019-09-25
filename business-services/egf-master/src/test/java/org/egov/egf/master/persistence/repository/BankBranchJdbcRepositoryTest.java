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
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.persistence.entity.BankBranchEntity;
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
public class BankBranchJdbcRepositoryTest {

	private BankBranchJdbcRepository bankBranchJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		bankBranchJdbcRepository = new BankBranchJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearBank.sql", "/sql/clearBankBranch.sql" })
	public void testCreate() {
		BankBranchEntity bankBranchEntity = getBankBranchEntity();
		BankBranchEntity actualResult = bankBranchJdbcRepository.create(bankBranchEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_bankbranch",
				new BankBranchResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());
	}

	@Test
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void testUpdate() {
		BankBranchEntity bankBranchEntity = getBankBranchEntity();
		BankBranchEntity actualResult = bankBranchJdbcRepository.update(bankBranchEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_bankbranch",
				new BankBranchResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());
	}

	@Test
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void testSearch() {
		Pagination<BankBranch> page = (Pagination<BankBranch>) bankBranchJdbcRepository.search(getBankBranchSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
	}

	@Test
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void testFindById() {
		BankBranchEntity bankBranchEntity = BankBranchEntity.builder().id("2").build();
		bankBranchEntity.setTenantId("default");
		BankBranchEntity result = bankBranchJdbcRepository.findById(bankBranchEntity);
		assertThat(result.getId()).isEqualTo("2");
		assertThat(result.getName()).isEqualTo("name");
		assertThat(result.getCode()).isEqualTo("code");
	}
	
	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearBankBranch.sql" })
	public void test_create_with_tenantId_null() {

		BankBranchEntity bankBranch = BankBranchEntity.builder().code("code").name("name").active(true).build();
		bankBranchJdbcRepository.create(bankBranch);

	}

@Test
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void test_search_with_no_parameter() {

		Pagination<BankBranch> page = (Pagination<BankBranch>) bankBranchJdbcRepository.search(new BankBranchSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

@Test
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		BankBranchEntity bankBranchEntity = BankBranchEntity.builder().id("5").build();
		bankBranchEntity.setTenantId("default");
		BankBranchEntity result = bankBranchJdbcRepository.findById(bankBranchEntity);
		assertNull(result);

	}
@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void test_search_invalid_sort_option() {

		BankBranchSearch search = getBankBranchSearch();
		search.setSortBy("desc");
		bankBranchJdbcRepository.search(search);

	}

@Test
	@Sql(scripts = { "/sql/clearBankBranch.sql", "/sql/insertBankBranch.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		BankBranchSearch search = getBankBranchSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<BankBranch> page = (Pagination<BankBranch>) bankBranchJdbcRepository.search(getBankBranchSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}



	class BankBranchResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
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
					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private BankBranchEntity getBankBranchEntity() {
		BankBranchEntity bankBranchEntity = new BankBranchEntity();
		BankBranch bankBranch = getBankBranchDomain();
		bankBranchEntity.setId(bankBranch.getId());
		bankBranchEntity.setBankId(bankBranch.getBank().getId());
		bankBranchEntity.setCode(bankBranch.getCode());
		bankBranchEntity.setName(bankBranch.getName());
		bankBranchEntity.setDescription(bankBranch.getDescription());
		bankBranchEntity.setAddress(getBankBranchDomain().getAddress());
		bankBranchEntity.setActive(bankBranch.getActive());
		bankBranchEntity.setTenantId(bankBranch.getTenantId());
		return bankBranchEntity;
	}

	private BankBranch getBankBranchDomain() {
		BankBranch bankBranch = new BankBranch();
		bankBranch.setId("124234");
		bankBranch.setBank(getBankDomain());
		bankBranch.setCode("code");
		bankBranch.setName("name");
		bankBranch.setAddress("address");
		bankBranch.setDescription("description");
		bankBranch.setActive(true);
		bankBranch.setTenantId("default");
		return bankBranch;
	}

	private Bank getBankDomain() {
		Bank bank = new Bank();
		bank.setId("1");
		bank.setCode("code");
		bank.setName("name");
		bank.setDescription("description");
		bank.setType("type");
		bank.setActive(true);
		bank.setTenantId("default");
		return bank;
	}

	private BankBranchSearch getBankBranchSearch() {
		BankBranchSearch bankBranchSearch = new BankBranchSearch();
		bankBranchSearch.setName("name");
		bankBranchSearch.setCode("code");
		bankBranchSearch.setPageSize(500);
		bankBranchSearch.setOffset(0);
		bankBranchSearch.setSortBy("name desc");
		return bankBranchSearch;
	}

}