package org.egov.egf.instrument.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.TransactionType;
import org.egov.egf.instrument.persistence.entity.InstrumentEntity;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.FinancialStatusContract;
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
public class InstrumentJdbcRepositoryTest {

    @Autowired
    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    private InstrumentJdbcRepository instrumentJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() throws Exception {
        instrumentJdbcRepository = new InstrumentJdbcRepository(namedParameterJdbcTemplate, jdbcTemplate,
                instrumentVoucherJdbcRepository);
    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql" })
    public void test_create() {

        InstrumentEntity instrument = InstrumentEntity.builder().id("1").amount(BigDecimal.ONE)
                .bankAccountId("accountNumber").bankId("code").branchName("branchName").drawer("drawer")
                .financialStatusId("1").instrumentTypeId("name").payee("payee").serialNo("serialNo")
                .surrenderReasonId("1").transactionNumber("transactionNumber").transactionDate(new Date())
                .transactionType("Credit").build();
        instrument.setTenantId("default");
        InstrumentEntity actualResult = instrumentJdbcRepository.create(instrument);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrument",
                new InstrumentResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get("amount").toString()).isEqualTo("1.00");
        assertThat(row.get("bankId")).isEqualTo(actualResult.getBankId());
        assertThat(row.get("bankAccountId")).isEqualTo(actualResult.getBankAccountId()); 
        assertThat(row.get("branchName")).isEqualTo(actualResult.getBranchName());
        assertThat(row.get("drawer")).isEqualTo(actualResult.getDrawer());
        assertThat(row.get("financialStatusId")).isEqualTo(actualResult.getFinancialStatusId());
        assertThat(row.get("instrumentTypeId")).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get("payee")).isEqualTo(actualResult.getPayee());
        assertThat(row.get("serialNo")).isEqualTo(actualResult.getSerialNo());
        assertThat(row.get("surrenderReasonId")).isEqualTo(actualResult.getSurrenderReasonId());
        assertThat(row.get("transactionNumber")).isEqualTo(actualResult.getTransactionNumber());
        assertThat(row.get("transactionType")).isEqualTo(actualResult.getTransactionType());

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_update() {

        InstrumentEntity instrument = InstrumentEntity.builder().id("1").amount(BigDecimal.ONE).bankAccountId("1")
                .bankId("1").branchName("branchName").drawer("drawer").financialStatusId("1").instrumentTypeId("1")
                .payee("payee").serialNo("serialNo").surrenderReasonId("1").transactionNumber("transactionNumber")
                .transactionDate(new Date()).transactionType("Credit").build();
        instrument.setTenantId("default");
        InstrumentEntity actualResult = instrumentJdbcRepository.update(instrument);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrument",
                new InstrumentResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get("amount").toString()).isEqualTo("1.00");
        assertThat(row.get("bankId")).isEqualTo(actualResult.getBankId());
        assertThat(row.get("bankAccountId")).isEqualTo(actualResult.getBankAccountId());
        assertThat(row.get("branchName")).isEqualTo(actualResult.getBranchName());
        assertThat(row.get("drawer")).isEqualTo(actualResult.getDrawer());
        assertThat(row.get("financialStatusId")).isEqualTo(actualResult.getFinancialStatusId());
        assertThat(row.get("instrumentTypeId")).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get("payee")).isEqualTo(actualResult.getPayee());
        assertThat(row.get("serialNo")).isEqualTo(actualResult.getSerialNo());
        assertThat(row.get("surrenderReasonId")).isEqualTo(actualResult.getSurrenderReasonId());
        assertThat(row.get("transactionNumber")).isEqualTo(actualResult.getTransactionNumber());
        assertThat(row.get("transactionType")).isEqualTo(actualResult.getTransactionType());

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_search() {

        Pagination<Instrument> page = (Pagination<Instrument>) instrumentJdbcRepository.search(getInstrumentSearch());

        assertThat(page.getPagedData().get(0).getAmount()).isEqualTo("1.00");
        assertThat(page.getPagedData().get(0).getBank().getId()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getBankAccount().getAccountNumber()).isEqualTo("accountNumber");
        assertThat(page.getPagedData().get(0).getBranchName()).isEqualTo("branchName");
        assertThat(page.getPagedData().get(0).getDrawer()).isEqualTo("drawer");
        assertThat(page.getPagedData().get(0).getFinancialStatus().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getPayee()).isEqualTo("payee");
        assertThat(page.getPagedData().get(0).getSerialNo()).isEqualTo("serialNo");
        assertThat(page.getPagedData().get(0).getSurrenderReason().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getTransactionNumber()).isEqualTo("transactionNumber");
        assertThat(page.getPagedData().get(0).getTransactionType()).isEqualTo(TransactionType.Credit);
    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_invalid_search() {

        Pagination<Instrument> page = (Pagination<Instrument>) instrumentJdbcRepository.search(getInstrumentSearch1());
        assertThat(page.getPagedData().size()).isEqualTo(0);

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_find_by_id() {

        InstrumentEntity instrumentEntity = InstrumentEntity.builder().id("1").build();
        instrumentEntity.setTenantId("default");
        InstrumentEntity result = instrumentJdbcRepository.findById(instrumentEntity);

        assertThat(result.getAmount()).isEqualTo("1.00");
        assertThat(result.getBankId()).isEqualTo("code");
        assertThat(result.getBankAccountId()).isEqualTo("accountNumber");
        assertThat(result.getBranchName()).isEqualTo("branchName");
        assertThat(result.getDrawer()).isEqualTo("drawer");
        assertThat(result.getFinancialStatusId()).isEqualTo("1");
        assertThat(result.getInstrumentTypeId()).isEqualTo("name");
        assertThat(result.getPayee()).isEqualTo("payee");
        assertThat(result.getSerialNo()).isEqualTo("serialNo");
        assertThat(result.getSurrenderReasonId()).isEqualTo("1");
        assertThat(result.getTransactionNumber()).isEqualTo("transactionNumber");
        assertThat(result.getTransactionType()).isEqualTo("Credit");

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentEntity instrumentEntity = InstrumentEntity.builder().id("5").build();
        instrumentEntity.setTenantId("default");
        InstrumentEntity result = instrumentJdbcRepository.findById(instrumentEntity);
        assertNull(result);

    }

    @Test(expected = InvalidDataException.class)
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_search_invalid_sort_option() {

        InstrumentSearch search = getInstrumentSearch();
        search.setSortBy("desc");
        instrumentJdbcRepository.search(search);

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_search_without_pagesize_offset_sortby() {

        InstrumentSearch search = getInstrumentSearch();
        search.setSortBy(null);
        search.setPageSize(null);
        search.setOffset(null);
        Pagination<Instrument> page = (Pagination<Instrument>) instrumentJdbcRepository.search(getInstrumentSearch());

        assertThat(page.getPagedData().get(0).getAmount()).isEqualTo("1.00");
        assertThat(page.getPagedData().get(0).getBank().getId()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getBankAccount().getAccountNumber()).isEqualTo("accountNumber");
        assertThat(page.getPagedData().get(0).getBranchName()).isEqualTo("branchName");
        assertThat(page.getPagedData().get(0).getDrawer()).isEqualTo("drawer");
        assertThat(page.getPagedData().get(0).getFinancialStatus().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getPayee()).isEqualTo("payee");
        assertThat(page.getPagedData().get(0).getSerialNo()).isEqualTo("serialNo");
        assertThat(page.getPagedData().get(0).getSurrenderReason().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getTransactionNumber()).isEqualTo("transactionNumber");
        assertThat(page.getPagedData().get(0).getTransactionType()).isEqualTo(TransactionType.Credit);

    }

    class InstrumentResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put("amount", resultSet.getString("amount"));
                        put("bankId", resultSet.getString("bankId"));
                        put("bankAccountId", resultSet.getString("bankAccountId"));
                        put("branchName", resultSet.getString("branchName"));
                        put("drawer", resultSet.getString("drawer"));
                        put("financialStatusId", resultSet.getString("financialStatusId"));
                        put("instrumentTypeId", resultSet.getString("instrumentTypeId"));
                        put("payee", resultSet.getString("payee"));
                        put("serialNo", resultSet.getString("serialNo"));
                        put("transactionNumber", resultSet.getString("transactionNumber"));
                        put("transactionType", resultSet.getString("transactionType"));
                        put("surrenderReasonId", resultSet.getString("surrenderReasonId"));
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

    private InstrumentSearch getInstrumentSearch1() {
        InstrumentSearch instrumentSearch = new InstrumentSearch();
        instrumentSearch.setId("id");
        instrumentSearch.setAmount(BigDecimal.ONE);
        instrumentSearch.setBank(BankContract.builder().id("1").build());
        instrumentSearch.setBankAccount(BankAccountContract.builder().id("1").build());
        instrumentSearch.setBranchName("branchName");
        instrumentSearch.setDrawer("drawer");
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().id("1").build());
        instrumentSearch.setRemittanceVoucherId("1");
        instrumentSearch.setInstrumentType(InstrumentType.builder().id("1").build());
        instrumentSearch.setPayee("payee");
        instrumentSearch.setSerialNo("serialNo");
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("1").build());
        instrumentSearch.setTransactionNumber("transactionNumber");
        instrumentSearch.setTransactionType(TransactionType.Credit);
        instrumentSearch.setReceiptIds("1");
        instrumentSearch.setTenantId("default");
        instrumentSearch.setPageSize(500);
        instrumentSearch.setOffset(0);
        instrumentSearch.setSortBy("id desc");
        return instrumentSearch;
    }

    private InstrumentSearch getInstrumentSearch() {
        InstrumentSearch instrumentSearch = new InstrumentSearch();
        instrumentSearch.setId("1");
        instrumentSearch.setIds("1");
        instrumentSearch.setAmount(BigDecimal.ONE);
        instrumentSearch.setBank(BankContract.builder().id("code").build());
        instrumentSearch.setBankAccount(BankAccountContract.builder().accountNumber("accountNumber").build());
        instrumentSearch.setBranchName("branchName");
        instrumentSearch.setDrawer("drawer");
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().id("1").build());
        instrumentSearch.setFinancialStatuses("1");
        instrumentSearch.setRemittanceVoucherId("1");
        instrumentSearch.setInstrumentType(InstrumentType.builder().name("name").build());
        instrumentSearch.setInstrumentTypes("name");
        instrumentSearch.setPayee("payee");
        instrumentSearch.setSerialNo("serialNo");
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("1").build());
        instrumentSearch.setTransactionNumber("transactionNumber");
        instrumentSearch.setTransactionType(TransactionType.Credit);
        instrumentSearch.setReceiptIds("1");
        try {
            String startDateString = "07/27/2017";
            DateFormat df = new SimpleDateFormat("MM/dd/yyyy");
            Date startDate;
            startDate = df.parse(startDateString);
            instrumentSearch.setTransactionFromDate(startDate);
            instrumentSearch.setTransactionToDate(startDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        instrumentSearch.setTenantId("default");
        instrumentSearch.setPageSize(500);
        instrumentSearch.setOffset(0);
        instrumentSearch.setSortBy("id desc");
        return instrumentSearch;
    }
}