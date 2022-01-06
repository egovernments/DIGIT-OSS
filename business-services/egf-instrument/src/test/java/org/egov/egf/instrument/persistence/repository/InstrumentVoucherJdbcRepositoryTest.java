package org.egov.egf.instrument.persistence.repository;

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
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.domain.model.InstrumentVoucherSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherEntity;
import org.junit.Before;
import org.junit.Ignore;
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
@Ignore
public class InstrumentVoucherJdbcRepositoryTest {

    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private static final String DEFAULT="default";

    private static final String INSTRUMENT_ID="instrumentId";

    private static final String VOUCHER_HEADER_ID="voucherHeaderId";

    private static final String RECEIPT_HEADER_ID="receiptHeaderId";

    @Before
    public void setUp() throws Exception {
        instrumentVoucherJdbcRepository = new InstrumentVoucherJdbcRepository(namedParameterJdbcTemplate);
    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql" })
    public void test_create() {

        InstrumentVoucherEntity instrumentVoucher = InstrumentVoucherEntity.builder().id("1").instrumentId("1")
                .voucherHeaderId("1").receiptHeaderId("1").build();
        instrumentVoucher.setTenantId(DEFAULT);
        InstrumentVoucherEntity actualResult = instrumentVoucherJdbcRepository.create(instrumentVoucher);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentVoucher",
                new InstrumentVoucherResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get(INSTRUMENT_ID)).isEqualTo(actualResult.getInstrumentId());
        assertThat(row.get(VOUCHER_HEADER_ID)).isEqualTo(actualResult.getVoucherHeaderId());
        assertThat(row.get(RECEIPT_HEADER_ID)).isEqualTo(actualResult.getReceiptHeaderId());

    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_update() {

        InstrumentVoucherEntity instrumentVoucher = InstrumentVoucherEntity.builder().id("1").instrumentId("1")
                .voucherHeaderId("1").receiptHeaderId("1").build();
        instrumentVoucher.setTenantId(DEFAULT);
        InstrumentVoucherEntity actualResult = instrumentVoucherJdbcRepository.update(instrumentVoucher);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrumentVoucher",
                new InstrumentVoucherResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get(INSTRUMENT_ID)).isEqualTo(actualResult.getInstrumentId());
        assertThat(row.get(VOUCHER_HEADER_ID)).isEqualTo(actualResult.getVoucherHeaderId());
        assertThat(row.get(RECEIPT_HEADER_ID)).isEqualTo(actualResult.getReceiptHeaderId());

    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_find_by_id() {

        InstrumentVoucherEntity instrumentVoucherEntity = InstrumentVoucherEntity.builder().id("1").build();
        instrumentVoucherEntity.setTenantId(DEFAULT);
        InstrumentVoucherEntity result = instrumentVoucherJdbcRepository.findById(instrumentVoucherEntity);

        assertThat(result.getInstrumentId()).isEqualTo("1");
        assertThat(result.getVoucherHeaderId()).isEqualTo("1");
        assertThat(result.getReceiptHeaderId()).isEqualTo("1");

    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentVoucherEntity instrumentVoucherEntity = InstrumentVoucherEntity.builder().id("5").build();
        instrumentVoucherEntity.setTenantId(DEFAULT);
        InstrumentVoucherEntity result = instrumentVoucherJdbcRepository.findById(instrumentVoucherEntity);
        assertNull(result);

    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_search() {
        Pagination<InstrumentVoucher> page = (Pagination<InstrumentVoucher>) instrumentVoucherJdbcRepository
                .search(getInstrumentVoucherSearch());
        assertThat(page.getPagedData().get(0).getReceiptHeaderId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getVoucherHeaderId()).isEqualTo("1");
    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_invalid_search() {
        Pagination<InstrumentVoucher> page = (Pagination<InstrumentVoucher>) instrumentVoucherJdbcRepository
                .search(getInstrumentVoucherSearch1());
        assertThat(page.getPagedData().size()).isEqualTo(0);
    }

    @Test(expected = InvalidDataException.class)
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_search_invalid_sort_option() {
        InstrumentVoucherSearch search = getInstrumentVoucherSearch();
        search.setSortBy("desc");
        instrumentVoucherJdbcRepository.search(search);
    }

    @Test
    @Sql(scripts = { "/sql/instrumentvoucher/clearInstrumentVoucher.sql",
            "/sql/instrumentvoucher/insertInstrumentVoucherData.sql" })
    public void test_search_without_pagesize_offset_sortby() {
        InstrumentVoucherSearch search = getInstrumentVoucherSearch();
        search.setSortBy(null);
        search.setPageSize(null);
        search.setOffset(null);
        Pagination<InstrumentVoucher> page = (Pagination<InstrumentVoucher>) instrumentVoucherJdbcRepository
                .search(getInstrumentVoucherSearch());
        assertThat(page.getPagedData().get(0).getInstrument().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getReceiptHeaderId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getVoucherHeaderId()).isEqualTo("1");
    }

    class InstrumentVoucherResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put(INSTRUMENT_ID, resultSet.getString(INSTRUMENT_ID));
                        put(VOUCHER_HEADER_ID, resultSet.getString(VOUCHER_HEADER_ID));
                        put(RECEIPT_HEADER_ID, resultSet.getString(RECEIPT_HEADER_ID));
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

    private InstrumentVoucherSearch getInstrumentVoucherSearch1() {
        InstrumentVoucherSearch instrumentVoucherSearch = new InstrumentVoucherSearch();
        instrumentVoucherSearch.setInstrument(Instrument.builder().id("id").build());
        instrumentVoucherSearch.setReceiptHeaderId(RECEIPT_HEADER_ID);
        instrumentVoucherSearch.setVoucherHeaderId(string3);
        instrumentVoucherSearch.setTenantId("tenantId");
        instrumentVoucherSearch.setPageSize(500);
        instrumentVoucherSearch.setOffset(0);
        instrumentVoucherSearch.setSortBy("id desc");
        return instrumentVoucherSearch;
    }

    private InstrumentVoucherSearch getInstrumentVoucherSearch() {
        InstrumentVoucherSearch instrumentVoucherSearch = new InstrumentVoucherSearch();
        instrumentVoucherSearch.setReceiptHeaderId("1");
        instrumentVoucherSearch.setVoucherHeaderId("1");
        instrumentVoucherSearch.setInstruments("1");
        instrumentVoucherSearch.setReceiptIds("1");
        instrumentVoucherSearch.setPageSize(500);
        instrumentVoucherSearch.setOffset(0);
        instrumentVoucherSearch.setSortBy("id desc");
        return instrumentVoucherSearch;
    }
}
