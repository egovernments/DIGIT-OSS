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
import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;
import org.egov.egf.master.persistence.entity.FunctionEntity;
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
public class FunctionJdbcRepositoryTest {

	private FunctionJdbcRepository functionJdbcRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Before
	public void setUp() throws Exception {
		functionJdbcRepository = new FunctionJdbcRepository(namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql" })
	public void test_create() {

		FunctionEntity function = FunctionEntity.builder().id("46353532").code("code").name("name").active(true)
				.level(1).parentId("1").build();
		function.setTenantId("default");
		FunctionEntity actualResult = functionJdbcRepository.create(function);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_function",
				new FunctionResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());
		assertThat(row.get("parentId")).isEqualTo(actualResult.getParentId());

	}

	@Test(expected = DataIntegrityViolationException.class)
	@Sql(scripts = { "/sql/clearFunction.sql" })
	public void test_create_with_tenantId_null() {

		FunctionEntity function = FunctionEntity.builder().code("code").name("name").active(true).level(1).parentId("1")
				.level(1).build();
		functionJdbcRepository.create(function);

	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_update() {

		FunctionEntity function = FunctionEntity.builder().code("codeU").name("nameU").active(true).id("2").level(1)
				.build();
		function.setTenantId("default");
		FunctionEntity actualResult = functionJdbcRepository.update(function);

		List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_function",
				new FunctionResultExtractor());
		Map<String, Object> row = result.get(0);
		assertThat(row.get("id")).isEqualTo(actualResult.getId());
		assertThat(row.get("name")).isEqualTo(actualResult.getName());
		assertThat(row.get("code")).isEqualTo(actualResult.getCode());

	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_search() {

		Pagination<Function> page = (Pagination<Function>) functionJdbcRepository.search(getFunctionSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_search_with_no_parameter() {

		Pagination<Function> page = (Pagination<Function>) functionJdbcRepository.search(new FunctionSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_find_by_id() {

		FunctionEntity functionEntity = FunctionEntity.builder().id("2").build();
		functionEntity.setTenantId("default");
		FunctionEntity result = functionJdbcRepository.findById(functionEntity);
		assertThat(result.getId()).isEqualTo("2");
		assertThat(result.getName()).isEqualTo("name");
		assertThat(result.getCode()).isEqualTo("code");

	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_find_by_invalid_id_should_return_null() {

		FunctionEntity functionEntity = FunctionEntity.builder().id("5").build();
		functionEntity.setTenantId("default");
		FunctionEntity result = functionJdbcRepository.findById(functionEntity);
		assertNull(result);

	}

	@Test(expected = InvalidDataException.class)
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_search_invalid_sort_option() {

		FunctionSearch search = getFunctionSearch();
		search.setSortBy("desc");
		functionJdbcRepository.search(search);

	}

	@Test
	@Sql(scripts = { "/sql/clearFunction.sql", "/sql/insertFunctionData.sql" })
	public void test_search_without_pagesize_offset_sortby() {

		FunctionSearch search = getFunctionSearch();
		search.setSortBy(null);
		search.setPageSize(null);
		search.setOffset(null);
		Pagination<Function> page = (Pagination<Function>) functionJdbcRepository.search(getFunctionSearch());
		assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
		assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
		assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

	}

	class FunctionResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
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
						put("parentId", resultSet.getString("parentId"));

					}
				};

				rows.add(row);
			}
			return rows;
		}
	}

	private FunctionSearch getFunctionSearch() {
		FunctionSearch functionSearch = new FunctionSearch();
		functionSearch.setId("2");
		functionSearch.setName("name");
		functionSearch.setCode("code");
		functionSearch.setActive(true);
		functionSearch.setLevel(1);
		functionSearch.setParentId(parentFunction());
		functionSearch.setPageSize(500);
		functionSearch.setOffset(0);
		functionSearch.setSortBy("name desc");
		return functionSearch;
	}

	private Function parentFunction() {
		Function function = Function.builder().name("parent").code("001").level(0).active(true).id("1").build();
		function.setTenantId("default");
		return function;
	}
}