package org.egov.egf.instrument.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNull;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.egf.instrument.persistence.entity.InstrumentTypePropertyEntity;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class InstrumentTypePropertyJdbcRepositoryTest {

    private InstrumentTypePropertyJdbcRepository instrumentTypePropertyJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Before
    public void setUp() throws Exception {
        instrumentTypePropertyJdbcRepository = new InstrumentTypePropertyJdbcRepository(namedParameterJdbcTemplate);
    }

    @Test
    @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql" })
    public void test_create() {

        InstrumentTypePropertyEntity instrumentTypeProperty = InstrumentTypePropertyEntity.builder().id("1")
                .transactionType("Credit").reconciledOncreate(true).statusOnCreateId("1").statusOnReconcileId("1")
                .statusOnUpdateId("1").build();
        instrumentTypeProperty.setTenantId("default");
        InstrumentTypePropertyEntity actualResult = instrumentTypePropertyJdbcRepository.create(instrumentTypeProperty);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentTypeProperty",
                new InstrumentTypePropertyResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get("transactionType")).isEqualTo(actualResult.getTransactionType());
        assertThat(row.get("reconciledOncreate")).isEqualTo(actualResult.getReconciledOncreate());
        assertThat(row.get("statusOnCreateId")).isEqualTo(actualResult.getStatusOnCreateId());
        assertThat(row.get("statusOnReconcileId")).isEqualTo(actualResult.getStatusOnReconcileId());
        assertThat(row.get("statusOnUpdateId")).isEqualTo(actualResult.getStatusOnUpdateId());

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
            "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" })
    public void test_update() {

        InstrumentTypePropertyEntity instrumentTypeProperty = InstrumentTypePropertyEntity.builder().id("1")
                .transactionType("Credit").reconciledOncreate(true).statusOnCreateId("1").statusOnReconcileId("1")
                .statusOnUpdateId("1").build();
        instrumentTypeProperty.setTenantId("default");
        InstrumentTypePropertyEntity actualResult = instrumentTypePropertyJdbcRepository.update(instrumentTypeProperty);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentTypeProperty",
                new InstrumentTypePropertyResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get("transactionType")).isEqualTo(actualResult.getTransactionType());
        assertThat(row.get("reconciledOncreate")).isEqualTo(actualResult.getReconciledOncreate());
        assertThat(row.get("statusOnCreateId")).isEqualTo(actualResult.getStatusOnCreateId());
        assertThat(row.get("statusOnReconcileId")).isEqualTo(actualResult.getStatusOnReconcileId());
        assertThat(row.get("statusOnUpdateId")).isEqualTo(actualResult.getStatusOnUpdateId());

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
            "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" })
    public void test_find_by_id() {

        InstrumentTypePropertyEntity instrumentTypePropertyEntity = InstrumentTypePropertyEntity.builder().id("1")
                .build();
        instrumentTypePropertyEntity.setTenantId("default");
        InstrumentTypePropertyEntity result = instrumentTypePropertyJdbcRepository
                .findById(instrumentTypePropertyEntity);

        assertThat(result.getTransactionType()).isEqualTo("Credit");
        assertThat(result.getReconciledOncreate()).isEqualTo(true);
        assertThat(result.getStatusOnCreateId()).isEqualTo("created");
        assertThat(result.getStatusOnReconcileId()).isEqualTo("reconciled");
        assertThat(result.getStatusOnUpdateId()).isEqualTo("updated");

    }

    @Test
    @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
            "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentTypePropertyEntity instrumentTypePropertyEntity = InstrumentTypePropertyEntity.builder().id("5")
                .build();
        instrumentTypePropertyEntity.setTenantId("default");
        InstrumentTypePropertyEntity result = instrumentTypePropertyJdbcRepository
                .findById(instrumentTypePropertyEntity);
        assertNull(result);

    }

    /*
     * @Test
     * @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
     * "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" }) public void test_search() {
     * Pagination<InstrumentTypeProperty> page = (Pagination<InstrumentTypeProperty>) instrumentTypePropertyJdbcRepository
     * .search(getInstrumentTypePropertySearch()); assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
     * assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
     * assertThat(page.getPagedData().get(0).getDescription()).isEqualTo( "description"); }
     */

    /*
     * @Test
     * @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
     * "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" }) public void test_invalid_search() {
     * Pagination<InstrumentTypeProperty> page = (Pagination<InstrumentTypeProperty>) instrumentTypePropertyJdbcRepository
     * .search(getInstrumentTypePropertySearch1()); assertThat(page.getPagedData().size()).isEqualTo(0); }
     */

    /*
     * @Test(expected = InvalidDataException.class)
     * @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
     * "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" }) public void test_search_invalid_sort_option() {
     * InstrumentTypePropertySearch search = getInstrumentTypePropertySearch(); search.setSortBy("desc");
     * instrumentTypePropertyJdbcRepository.search(search); }
     * @Test
     * @Sql(scripts = { "/sql/instrumenttypeproperty/clearInstrumentTypeProperty.sql",
     * "/sql/instrumenttypeproperty/insertInstrumentTypePropertyData.sql" }) public void
     * test_search_without_pagesize_offset_sortby() { InstrumentTypePropertySearch search = getInstrumentTypePropertySearch();
     * search.setSortBy(null); search.setPageSize(null); search.setOffset(null); Pagination<InstrumentTypeProperty> page =
     * (Pagination<InstrumentTypeProperty>) instrumentTypePropertyJdbcRepository .search(getInstrumentTypePropertySearch());
     * assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);
     * assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
     * assertThat(page.getPagedData().get(0).getDescription()).isEqualTo( "description"); }
     */

    class InstrumentTypePropertyResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put("transactionType", resultSet.getString("transactionType"));
                        put("reconciledOncreate", resultSet.getBoolean("reconciledOncreate"));
                        put("statusOnCreateId", resultSet.getString("statusOnCreateId"));
                        put("statusOnUpdateId", resultSet.getString("statusOnUpdateId"));
                        put("statusOnReconcileId", resultSet.getString("statusOnReconcileId"));
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

    /*
     * private InstrumentTypePropertySearch getInstrumentTypePropertySearch1() { InstrumentTypePropertySearch
     * instrumentTypePropertySearch = new InstrumentTypePropertySearch(); instrumentTypePropertySearch.setId("id");
     * instrumentTypePropertySearch.setName("name"); instrumentTypePropertySearch.setDescription("description");
     * instrumentTypePropertySearch.setActive(true); instrumentTypePropertySearch.setTenantId("tenantId");
     * instrumentTypePropertySearch.setPageSize(500); instrumentTypePropertySearch.setOffset(0);
     * instrumentTypePropertySearch.setSortBy("name desc"); return instrumentTypePropertySearch; } private
     * InstrumentTypePropertySearch getInstrumentTypePropertySearch() { InstrumentTypePropertySearch instrumentTypePropertySearch
     * = new InstrumentTypePropertySearch(); instrumentTypePropertySearch.setName("name");
     * instrumentTypePropertySearch.setDescription("description"); instrumentTypePropertySearch.setActive(true);
     * instrumentTypePropertySearch.setPageSize(500); instrumentTypePropertySearch.setOffset(0);
     * instrumentTypePropertySearch.setSortBy("name desc"); return instrumentTypePropertySearch; }
     */
}
