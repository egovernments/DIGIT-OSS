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
import org.egov.egf.master.domain.enums.BankAccountType;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.persistence.entity.BankAccountEntity;
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
public class BankAccountJdbcRepositoryTest {

	private BankAccountJdbcRepository bankAccountJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		bankAccountJdbcRepository = new BankAccountJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql" })
	public void testCreate() {
		BankAccountEntity bankAccountEntity = getBankAccountEntity();
		BankAccountEntity actualResult = bankAccountJdbcRepository.create(bankAccountEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_bankaccount",
				new BankAccountResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("accountNumber")).isEqualTo(actualResult.getAccountNumber());
	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void testUpdate() {
		BankAccountEntity bankAccountEntity = getBankAccountEntity();
		BankAccountEntity actualResult = bankAccountJdbcRepository.update(bankAccountEntity);
		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_bankaccount",
				new BankAccountResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("accountNumber")).isEqualTo(actualResult.getAccountNumber());
	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void testSearch() {
		Pagination<BankAccount> page = (Pagination<BankAccount>) bankAccountJdbcRepository
				.search(getBankAccountSearch());
		assertThat(page.getPagedData().get(0).getAccountNumber()).isEqualTo("1");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void testFindById() {
		BankAccountEntity bankAccountEntity = BankAccountEntity.builder().id("1").build();
		bankAccountEntity.setTenantId("default");
		BankAccountEntity result = bankAccountJdbcRepository.findById(bankAccountEntity);
		assertThat(result.getId()).isEqualTo("1");
	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearBankAccount.sql" })
	public void test_create_with_tenantId_null() {

		BankAccountEntity bankAccount = BankAccountEntity.builder().accountNumber("001").active(true).build();
		bankAccountJdbcRepository.create(bankAccount);

	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void test_search_with_no_parameter() {

		Pagination<BankAccount> page = (Pagination<BankAccount>) bankAccountJdbcRepository
				.search(new BankAccountSearch());
		assertThat(page.getPagedData().get(0).getAccountNumber()).isEqualTo("1");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		BankAccountEntity bankAccountEntity = BankAccountEntity.builder().id("5").build();
		bankAccountEntity.setTenantId("default");
		BankAccountEntity result = bankAccountJdbcRepository.findById(bankAccountEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void test_search_invalid_sort_option() {

		BankAccountSearch search = getBankAccountSearch();
		search.setSortBy("desc");
		bankAccountJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearBankAccount.sql", "/sql/insertBankAccount.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		BankAccountSearch search = getBankAccountSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<BankAccount> page = (Pagination<BankAccount>) bankAccountJdbcRepository
				.search(getBankAccountSearch());
		assertThat(page.getPagedData().get(0).getAccountNumber()).isEqualTo("1");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	class BankAccountResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
		@Override
		public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
			List<Map<String, Object>> rows = new ArrayList<>();
			while (resultSet.next()) {
				Map<String, Object> row = new HashMap<String, Object>() {
					{
						put("id", resultSet.getString("id"));
						put("accountNumber", resultSet.getString("accountNumber"));
						put("bankBranchId", resultSet.getString("bankBranchId"));
						put("coa", resultSet.getString("chartOfAccountId"));
						put("fund", resultSet.getBoolean("fundId"));
						put("tenantId", resultSet.getBoolean("tenantId"));

					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private BankAccountEntity getBankAccountEntity() {
		BankAccountEntity bankAccountEntity = new BankAccountEntity();
		BankAccount bankAccount = getBankAccountDomain();
		bankAccountEntity.setId(bankAccount.getId());
		bankAccountEntity.setBankBranchId(bankAccount.getBankBranch().getId());
		bankAccountEntity.setAccountNumber(bankAccount.getAccountNumber());
		bankAccountEntity.setActive(bankAccount.getActive());
		bankAccountEntity.setChartOfAccountId(bankAccount.getChartOfAccount().getId());
		bankAccountEntity.setFundId(bankAccount.getFund().getId());
		bankAccountEntity.setActive(bankAccount.getActive());
		bankAccountEntity.setTenantId(bankAccount.getTenantId());
		bankAccountEntity.setAccountType(bankAccount.getAccountType());
		bankAccountEntity.setDescription(bankAccount.getDescription());
		bankAccountEntity.setPayTo(bankAccount.getPayTo());
		bankAccountEntity.setType(bankAccount.getType().toString());
		return bankAccountEntity;
	}

	private BankAccount getBankAccountDomain() {
		BankAccount bankAccount = new BankAccount();
		bankAccount.setId("1");
		bankAccount.setBankBranch(getBankBranch());
		bankAccount.setAccountNumber("1");
		bankAccount.setChartOfAccount(getCOA());
		bankAccount.setFund(getFund());
		bankAccount.setActive(true);
		bankAccount.setTenantId("default");
		bankAccount.setAccountType("Payment");
		bankAccount.setDescription("bank account");
		bankAccount.setPayTo("abc");
		bankAccount.setType(BankAccountType.PAYMENTS);
		return bankAccount;
	}

	private BankBranch getBankBranch() {
		return BankBranch.builder().id("1").code("branch").name("branch").active(true).bank(getBank()).build();
	}

	private Bank getBank() {
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

	private ChartOfAccount getCOA() {
		return ChartOfAccount.builder().id("1").glcode("101010").build();

	}

	private Fund getFund() {
		return Fund.builder().id("1").code("fund").name("fund").build();
	}

	private BankAccountSearch getBankAccountSearch() {
		BankAccountSearch bankAccountSearch = new BankAccountSearch();
		bankAccountSearch.setAccountNumber("1");
		bankAccountSearch.setType(BankAccountType.PAYMENTS);
		bankAccountSearch.setPageSize(500);
		bankAccountSearch.setOffset(0);
		bankAccountSearch.setSortBy("id desc");
		return bankAccountSearch;
	}

}