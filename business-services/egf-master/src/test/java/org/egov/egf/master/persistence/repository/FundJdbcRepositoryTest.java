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
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.persistence.entity.FundEntity;
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
public class FundJdbcRepositoryTest {

	private FundJdbcRepository fundJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		fundJdbcRepository = new FundJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearFund.sql" })
	public void test_create() {

		FundEntity fund = FundEntity.builder().id("2374257").code("code").name("name").active(true).level(1l)
				.parentId("1").identifier('F').build();
		fund.setTenantId("default");
		FundEntity actualResult = fundJdbcRepository.create(fund);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_fund",
				new FundResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());
		assertThat(row.get("parentId")).isEqualTo(actualResult.getParentId());

	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearFund.sql" })
	public void test_create_with_tenantId_null() {

		FundEntity fund = FundEntity.builder().code("code").name("name").active(true).level(1l)
				.parentId("1").identifier('F').build();
		fundJdbcRepository.create(fund);

	}

	@Test
	@Sql(scripts = { "/sql/clearFund.sql", "/sql/insertFundData.sql" })
	public void test_update() {

		FundEntity fund = FundEntity.builder().code("codeU").name("nameU").active(true).level(1l)
				.identifier('F').id("2").build();
		fund.setTenantId("default");
		FundEntity actualResult = fundJdbcRepository.update(fund);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_fund",
				new FundResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());

	}

	@Test
	@Sql(scripts = { "/sql/clearFund.sql", "/sql/insertFundData.sql" })
	public void test_search() {

		Pagination<Fund> page = (Pagination<Fund>) fundJdbcRepository.search(getFundSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearFund.sql", "/sql/insertFundData.sql" })
	public void test_find_by_id() {

		FundEntity fundEntity = FundEntity.builder().id("2").build();
		fundEntity.setTenantId("default");
		FundEntity result = fundJdbcRepository.findById(fundEntity);
		assertThat(result.getId()).isEqualTo("2");
		assertThat(result.getName()).isEqualTo("name");
		assertThat(result.getCode()).isEqualTo("code");

	}

	@Test
	@Sql(scripts = { "/sql/clearFund.sql", "/sql/insertFundData.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		FundEntity fundEntity = FundEntity.builder().id("5").build();
		fundEntity.setTenantId("default");
		FundEntity result = fundJdbcRepository.findById(fundEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearFund.sql", "/sql/insertFundData.sql" })
	public void test_search_invalid_sort_option() {

		FundSearch search = getFundSearch();
		search.setSortBy("desc");
		fundJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearFund.sql", "/sql/insertFundData.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		FundSearch search = getFundSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<Fund> page = (Pagination<Fund>) fundJdbcRepository.search(getFundSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	class FundResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
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
						put("level", resultSet.getLong("level"));
						put("createdBy", resultSet.getString("createdBy"));
						put("createdDate", resultSet.getString("createdDate"));
						put("lastModifiedBy", resultSet.getString("lastModifiedBy"));
						put("lastModifiedDate", resultSet.getString("lastModifiedDate"));
						put("identifier", resultSet.getString("identifier"));
						put("parentId", resultSet.getString("parentId"));

					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private FundSearch getFundSearch() {
		FundSearch fundSearch = new FundSearch();
		fundSearch.setName("name");
		fundSearch.setCode("code");
		fundSearch.setPageSize(500);
		fundSearch.setOffset(0);
		fundSearch.setSortBy("name desc");
		return fundSearch;
	}
}