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
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.persistence.entity.InstrumentAccountCodeEntity;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
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
public class InstrumentAccountCodeJdbcRepositoryTest {

    private InstrumentAccountCodeJdbcRepository instrumentAccountCodeJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() throws Exception {
        instrumentAccountCodeJdbcRepository = new InstrumentAccountCodeJdbcRepository(namedParameterJdbcTemplate, jdbcTemplate);
    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql" })
    public void test_create() {

        InstrumentAccountCodeEntity instrumentAccountCode = InstrumentAccountCodeEntity.builder().instrumentTypeId("1")
                .accountCodeId("1").build();
        instrumentAccountCode.setTenantId("default");
        InstrumentAccountCodeEntity actualResult = instrumentAccountCodeJdbcRepository.create(instrumentAccountCode);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentAccountCode",
                new InstrumentAccountCodeResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("instrumentTypeId")).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get("accountCodeId")).isEqualTo(actualResult.getAccountCodeId());

    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_update() {

        InstrumentAccountCodeEntity instrumentAccountCode = InstrumentAccountCodeEntity.builder().instrumentTypeId("name")
                .accountCodeId("glcode").build();
        instrumentAccountCode.setTenantId("default");
        InstrumentAccountCodeEntity actualResult = instrumentAccountCodeJdbcRepository.update(instrumentAccountCode);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentAccountCode",
                new InstrumentAccountCodeResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("instrumentTypeId")).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get("accountCodeId")).isEqualTo(actualResult.getAccountCodeId());

    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_delete() {

        InstrumentAccountCodeEntity instrumentAccountCode = InstrumentAccountCodeEntity.builder().id("1").instrumentTypeId("name")
                .accountCodeId("glcode").build();
        instrumentAccountCode.setTenantId("default");
        InstrumentAccountCodeEntity actualResult = instrumentAccountCodeJdbcRepository.delete(instrumentAccountCode);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentAccountCode",
                new InstrumentAccountCodeResultExtractor());
        assertTrue("Result set length is zero", result.size() == 0);
    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_search() {

        Pagination<InstrumentAccountCode> page = (Pagination<InstrumentAccountCode>) instrumentAccountCodeJdbcRepository
                .search(getInstrumentAccountCodeSearch());
        assertThat(page.getPagedData().get(0).getAccountCode().getGlcode()).isEqualTo("glcode");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");

    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_invalid_search() {

        Pagination<InstrumentAccountCode> page = (Pagination<InstrumentAccountCode>) instrumentAccountCodeJdbcRepository
                .search(getInstrumentAccountCodeSearch1());
        assertThat(page.getPagedData().size()).isEqualTo(0);

    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_find_by_id() {

        InstrumentAccountCodeEntity instrumentAccountCodeEntity = InstrumentAccountCodeEntity.builder().id("1").build();
        instrumentAccountCodeEntity.setTenantId("default");
        InstrumentAccountCodeEntity result = instrumentAccountCodeJdbcRepository.findById(instrumentAccountCodeEntity);
        assertThat(result.getAccountCodeId()).isEqualTo("glcode");
        assertThat(result.getInstrumentTypeId()).isEqualTo("name");

    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentAccountCodeEntity instrumentAccountCodeEntity = InstrumentAccountCodeEntity.builder().id("5").build();
        instrumentAccountCodeEntity.setTenantId("default");
        InstrumentAccountCodeEntity result = instrumentAccountCodeJdbcRepository.findById(instrumentAccountCodeEntity);
        assertNull(result);

    }

    @Test(expected = InvalidDataException.class)
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_search_invalid_sort_option() {

        InstrumentAccountCodeSearch search = getInstrumentAccountCodeSearch();
        search.setSortBy("desc");
        instrumentAccountCodeJdbcRepository.search(search);

    }

    @Test
    @Sql(scripts = { "/sql/instrumentaccountcode/clearInstrumentAccountCode.sql",
            "/sql/instrumentaccountcode/insertInstrumentAccountCodeData.sql" })
    public void test_search_without_pagesize_offset_sortby() {

        InstrumentAccountCodeSearch search = getInstrumentAccountCodeSearch();
        search.setSortBy(null);
        search.setPageSize(null);
        search.setOffset(null);
        Pagination<InstrumentAccountCode> page = (Pagination<InstrumentAccountCode>) instrumentAccountCodeJdbcRepository
                .search(getInstrumentAccountCodeSearch());
        assertThat(page.getPagedData().get(0).getAccountCode().getGlcode()).isEqualTo("glcode");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");

    }

    class InstrumentAccountCodeResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put("instrumentTypeId", resultSet.getString("instrumentTypeId"));
                        put("accountCodeId", resultSet.getString("accountCodeId"));
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

    private InstrumentAccountCodeSearch getInstrumentAccountCodeSearch1() {
        InstrumentAccountCodeSearch instrumentAccountCodeSearch = new InstrumentAccountCodeSearch();
        instrumentAccountCodeSearch.setId("id");
        instrumentAccountCodeSearch.setInstrumentType(InstrumentType.builder().id("10").build());
        instrumentAccountCodeSearch.setAccountCode(ChartOfAccountContract.builder().id("1").build());
        instrumentAccountCodeSearch.setTenantId("tenantId");
        instrumentAccountCodeSearch.setPageSize(500);
        instrumentAccountCodeSearch.setOffset(0);
        instrumentAccountCodeSearch.setSortBy("accountCodeId desc");
        return instrumentAccountCodeSearch;
    }

    private InstrumentAccountCodeSearch getInstrumentAccountCodeSearch() {
        InstrumentAccountCodeSearch instrumentAccountCodeSearch = new InstrumentAccountCodeSearch();
        instrumentAccountCodeSearch.setId("1");
        instrumentAccountCodeSearch.setIds("1");
        instrumentAccountCodeSearch.setInstrumentType(InstrumentType.builder().name("name").build());
        instrumentAccountCodeSearch.setAccountCode(ChartOfAccountContract.builder().glcode("glcode").build());
        instrumentAccountCodeSearch.setPageSize(500);
        instrumentAccountCodeSearch.setOffset(0);
        instrumentAccountCodeSearch.setSortBy("accountCodeId desc");
        return instrumentAccountCodeSearch;
    }
}
