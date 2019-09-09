package org.egov.egf.instrument.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentTypeEntity;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class InstrumentTypeJdbcRepositoryTest {

    private InstrumentTypeJdbcRepository instrumentTypeJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() throws Exception {
        instrumentTypeJdbcRepository = new InstrumentTypeJdbcRepository(namedParameterJdbcTemplate, jdbcTemplate);
    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql" })
    public void test_create() {

        InstrumentTypeEntity instrumentType = InstrumentTypeEntity.builder().id("1").name("name").description("description")
                .active(true).build();
        instrumentType.setTenantId("default");
        InstrumentTypeEntity actualResult = instrumentTypeJdbcRepository.create(instrumentType);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentType",
                new InstrumentTypeResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("name")).isEqualTo(actualResult.getName());
        assertThat(row.get("description")).isEqualTo(actualResult.getDescription());
        assertThat(row.get("active")).isEqualTo(actualResult.getActive());

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_update() {

        InstrumentTypeEntity instrumentType = InstrumentTypeEntity.builder().id("1").name("name").description("description")
                .active(true).build();
        instrumentType.setTenantId("default");
        InstrumentTypeEntity actualResult = instrumentTypeJdbcRepository.update(instrumentType);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentType",
                new InstrumentTypeResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("name")).isEqualTo(actualResult.getName());
        assertThat(row.get("description")).isEqualTo(actualResult.getDescription());
        assertThat(row.get("active")).isEqualTo(actualResult.getActive());

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_delete() {

        InstrumentTypeEntity instrumentType = InstrumentTypeEntity.builder().id("1").name("name").description("description")
                .active(true).build();
        instrumentType.setTenantId("default");
        InstrumentTypeEntity actualResult = instrumentTypeJdbcRepository.delete(instrumentType);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentType",
                new InstrumentTypeResultExtractor());
        assertTrue("Result set length is zero", result.size() == 0);
    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_search() {

        Pagination<InstrumentType> page = (Pagination<InstrumentType>) instrumentTypeJdbcRepository
                .search(getInstrumentTypeSearch());
        assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getDescription()).isEqualTo("description");

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_invalid_search() {

        Pagination<InstrumentType> page = (Pagination<InstrumentType>) instrumentTypeJdbcRepository
                .search(getInstrumentTypeSearch1());
        assertThat(page.getPagedData().size()).isEqualTo(0);

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_find_by_id() {

        InstrumentTypeEntity instrumentTypeEntity = InstrumentTypeEntity.builder().id("1").build();
        instrumentTypeEntity.setTenantId("default");
        InstrumentTypeEntity result = instrumentTypeJdbcRepository.findById(instrumentTypeEntity);
        assertThat(result.getName()).isEqualTo("name");
        assertThat(result.getDescription()).isEqualTo("description");
        assertThat(result.getActive()).isEqualTo(true);

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentTypeEntity instrumentTypeEntity = InstrumentTypeEntity.builder().id("5").build();
        instrumentTypeEntity.setTenantId("default");
        InstrumentTypeEntity result = instrumentTypeJdbcRepository.findById(instrumentTypeEntity);
        assertNull(result);

    }

    @Test(expected = InvalidDataException.class)
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_search_invalid_sort_option() {

        InstrumentTypeSearch search = getInstrumentTypeSearch();
        search.setSortBy("desc");
        instrumentTypeJdbcRepository.search(search);

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttype/clearInstrumentType.sql",
            "/sql/instrumenttype/insertInstrumentTypeData.sql" })
    public void test_search_without_pagesize_offset_sortby() {

        InstrumentTypeSearch search = getInstrumentTypeSearch();
        search.setSortBy(null);
        search.setPageSize(null);
        search.setOffset(null);
        Pagination<InstrumentType> page = (Pagination<InstrumentType>) instrumentTypeJdbcRepository
                .search(getInstrumentTypeSearch());
        assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getDescription()).isEqualTo("description");

    }

    class InstrumentTypeResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put("name", resultSet.getString("name"));
                        put("description", resultSet.getString("description"));
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

    private InstrumentTypeSearch getInstrumentTypeSearch1() {
        InstrumentTypeSearch instrumentTypeSearch = new InstrumentTypeSearch();
        instrumentTypeSearch.setId("id");
        instrumentTypeSearch.setName("name");
        instrumentTypeSearch.setDescription("description");
        instrumentTypeSearch.setActive(true);
        instrumentTypeSearch.setTenantId("tenantId");
        instrumentTypeSearch.setPageSize(500);
        instrumentTypeSearch.setOffset(0);
        instrumentTypeSearch.setSortBy("name desc");
        return instrumentTypeSearch;
    }

    private InstrumentTypeSearch getInstrumentTypeSearch() {
        InstrumentTypeSearch instrumentTypeSearch = new InstrumentTypeSearch();
        instrumentTypeSearch.setId("1");
        instrumentTypeSearch.setIds("1");
        instrumentTypeSearch.setName("name");
        instrumentTypeSearch.setDescription("description");
        instrumentTypeSearch.setActive(true);
        instrumentTypeSearch.setPageSize(500);
        instrumentTypeSearch.setOffset(0);
        instrumentTypeSearch.setSortBy("name desc");
        return instrumentTypeSearch;
    }
}
