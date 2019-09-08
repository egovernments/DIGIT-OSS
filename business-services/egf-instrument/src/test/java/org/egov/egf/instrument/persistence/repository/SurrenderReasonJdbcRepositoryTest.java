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
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.persistence.entity.SurrenderReasonEntity;
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
public class SurrenderReasonJdbcRepositoryTest {

    private SurrenderReasonJdbcRepository surrenderReasonJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() throws Exception {
        surrenderReasonJdbcRepository = new SurrenderReasonJdbcRepository(namedParameterJdbcTemplate, jdbcTemplate);
    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql" })
    public void test_create() {

        SurrenderReasonEntity surrenderReason = SurrenderReasonEntity.builder().id("1").name("name")
                .description("description").build();
        surrenderReason.setTenantId("default");
        SurrenderReasonEntity actualResult = surrenderReasonJdbcRepository.create(surrenderReason);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_surrenderReason",
                new SurrenderReasonResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("name")).isEqualTo(actualResult.getName());
        assertThat(row.get("description")).isEqualTo(actualResult.getDescription());

    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_update() {

        SurrenderReasonEntity surrenderReason = SurrenderReasonEntity.builder().id("1").name("name")
                .description("description").build();
        surrenderReason.setTenantId("default");
        SurrenderReasonEntity actualResult = surrenderReasonJdbcRepository.update(surrenderReason);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_surrenderReason",
                new SurrenderReasonResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("name")).isEqualTo(actualResult.getName());
        assertThat(row.get("description")).isEqualTo(actualResult.getDescription());

    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_delete() {

        SurrenderReasonEntity surrenderReason = SurrenderReasonEntity.builder().id("1").name("name")
                .description("description").build();
        surrenderReason.setTenantId("default");
        SurrenderReasonEntity actualResult = surrenderReasonJdbcRepository.delete(surrenderReason);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_surrenderReason",
                new SurrenderReasonResultExtractor());
        assertTrue("Result set length is zero", result.size() == 0);
    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_search() {

        Pagination<SurrenderReason> page = (Pagination<SurrenderReason>) surrenderReasonJdbcRepository
                .search(getSurrenderReasonSearch());
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getDescription()).isEqualTo("description");

    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_invalid_search() {

        Pagination<SurrenderReason> page = (Pagination<SurrenderReason>) surrenderReasonJdbcRepository
                .search(getSurrenderReasonSearch1());
        assertThat(page.getPagedData().size()).isEqualTo(0);

    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_find_by_id() {

        SurrenderReasonEntity surrenderReasonEntity = SurrenderReasonEntity.builder().id("1").build();
        surrenderReasonEntity.setTenantId("default");
        SurrenderReasonEntity result = surrenderReasonJdbcRepository.findById(surrenderReasonEntity);
        assertThat(result.getName()).isEqualTo("name");
        assertThat(result.getDescription()).isEqualTo("description");

    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        SurrenderReasonEntity surrenderReasonEntity = SurrenderReasonEntity.builder().id("5").build();
        surrenderReasonEntity.setTenantId("default");
        SurrenderReasonEntity result = surrenderReasonJdbcRepository.findById(surrenderReasonEntity);
        assertNull(result);

    }

    @Test(expected = InvalidDataException.class)
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_search_invalid_sort_option() {

        SurrenderReasonSearch search = getSurrenderReasonSearch();
        search.setSortBy("desc");
        surrenderReasonJdbcRepository.search(search);

    }

    @Test
    @Sql(scripts = { "/sql/surrenderreason/clearSurrenderReason.sql",
            "/sql/surrenderreason/insertSurrenderReasonData.sql" })
    public void test_search_without_pagesize_offset_sortby() {

        SurrenderReasonSearch search = getSurrenderReasonSearch();
        search.setSortBy(null);
        search.setPageSize(null);
        search.setOffset(null);
        Pagination<SurrenderReason> page = (Pagination<SurrenderReason>) surrenderReasonJdbcRepository
                .search(getSurrenderReasonSearch());
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getDescription()).isEqualTo("description");

    }

    class SurrenderReasonResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put("name", resultSet.getString("name"));
                        put("description", resultSet.getString("description"));
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

    private SurrenderReasonSearch getSurrenderReasonSearch1() {
        SurrenderReasonSearch surrenderReasonSearch = new SurrenderReasonSearch();
        surrenderReasonSearch.setId("id");
        surrenderReasonSearch.setName("name");
        surrenderReasonSearch.setDescription("description");
        surrenderReasonSearch.setTenantId("tenantId");
        surrenderReasonSearch.setPageSize(500);
        surrenderReasonSearch.setOffset(0);
        surrenderReasonSearch.setSortBy("name desc");
        return surrenderReasonSearch;
    }

    private SurrenderReasonSearch getSurrenderReasonSearch() {
        SurrenderReasonSearch surrenderReasonSearch = new SurrenderReasonSearch();
        surrenderReasonSearch.setId("1");
        surrenderReasonSearch.setIds("1");
        surrenderReasonSearch.setName("name");
        surrenderReasonSearch.setDescription("description");
        surrenderReasonSearch.setPageSize(500);
        surrenderReasonSearch.setOffset(0);
        surrenderReasonSearch.setSortBy("name desc");
        return surrenderReasonSearch;
    }
}
