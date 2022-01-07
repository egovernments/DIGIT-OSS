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
import org.junit.Ignore;
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
@Ignore
public class InstrumentJdbcRepositoryTest {

    @Autowired
    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    private InstrumentJdbcRepository instrumentJdbcRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private DishonorReasonJdbcRepository dishonorReasonJdbcRepository;

    private static final String ACCOUNT_NUMBER="accountNumber";

    private static final String BRANCH_NAME="branchName";

    private static final String DRAWER="drawer";

    private static final String PAYEE="payee";

    private static final String SERIAL_NO="serialNo";

    private static final String TRANSACTION_NUMBER="transactionNumber";

    private static final String CREDIT="Credit";

    private static final String DEFAULT="default";

    private static final String AMOUNT="amount";

    private static final String BANK_ID="bankId";

    private static final String BANK_ACCOUNT_ID="bankAccountId";

    private static final String FINANCIAL_STATUS_ID="financialStatusId";

    private static final String INSTRUMENT_TYPE_ID="instrumentTypeId";

    private static final String SURRENDER_REASON_ID="surrenderReasonId";

    private static final String TRANSACTION_TYPE="transactionType";

    @Before
    public void setUp() throws Exception {
        instrumentJdbcRepository = new InstrumentJdbcRepository(namedParameterJdbcTemplate, jdbcTemplate,
                instrumentVoucherJdbcRepository, dishonorReasonJdbcRepository);
    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql" })
    public void test_create() {

        InstrumentEntity instrument = InstrumentEntity.builder().id("1").amount(BigDecimal.ONE)
                .bankAccountId(ACCOUNT_NUMBER).bankId("code").branchName(BRANCH_NAME).drawer(DRAWER)
                .financialStatusId("1").instrumentTypeId("name").payee(PAYEE).serialNo(SERIAL_NO)
                .surrenderReasonId("1").transactionNumber(TRANSACTION_NUMBER).transactionDate(new Date())
                .transactionType(CREDIT).build();
        instrument.setTenantId(DEFAULT);
        InstrumentEntity actualResult = instrumentJdbcRepository.create(instrument);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrument",
                new InstrumentResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get(AMOUNT).toString()).isEqualTo("1.00");
        assertThat(row.get(BANK_ID)).isEqualTo(actualResult.getBankId());
        assertThat(row.get(BANK_ACCOUNT_ID)).isEqualTo(actualResult.getBankAccountId());
        assertThat(row.get(BRANCH_NAME)).isEqualTo(actualResult.getBranchName());
        assertThat(row.get(DRAWER)).isEqualTo(actualResult.getDrawer());
        assertThat(row.get(FINANCIAL_STATUS_ID)).isEqualTo(actualResult.getFinancialStatusId());
        assertThat(row.get(INSTRUMENT_TYPE_ID)).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get(PAYEE)).isEqualTo(actualResult.getPayee());
        assertThat(row.get(SERIAL_NO)).isEqualTo(actualResult.getSerialNo());
        assertThat(row.get(SURRENDER_REASON_ID)).isEqualTo(actualResult.getSurrenderReasonId());
        assertThat(row.get(TRANSACTION_NUMBER)).isEqualTo(actualResult.getTransactionNumber());
        assertThat(row.get(TRANSACTION_TYPE)).isEqualTo(actualResult.getTransactionType());

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_update() {

        InstrumentEntity instrument = InstrumentEntity.builder().id("1").amount(BigDecimal.ONE).bankAccountId("1")
                .bankId("1").branchName(BRANCH_NAME).drawer(DRAWER).financialStatusId("1").instrumentTypeId("1")
                .payee(PAYEE).serialNo(SERIAL_NO).surrenderReasonId("1").transactionNumber(TRANSACTION_NUMBER)
                .transactionDate(new Date()).transactionType(CREDIT).build();
        instrument.setTenantId(DEFAULT);
        InstrumentEntity actualResult = instrumentJdbcRepository.update(instrument);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrument",
                new InstrumentResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get(AMOUNT).toString()).isEqualTo("1.00");
        assertThat(row.get(BANK_ID)).isEqualTo(actualResult.getBankId());
        assertThat(row.get(BANK_ACCOUNT_ID)).isEqualTo(actualResult.getBankAccountId());
        assertThat(row.get(BRANCH_NAME)).isEqualTo(actualResult.getBranchName());
        assertThat(row.get(DRAWER)).isEqualTo(actualResult.getDrawer());
        assertThat(row.get(FINANCIAL_STATUS_ID)).isEqualTo(actualResult.getFinancialStatusId());
        assertThat(row.get(INSTRUMENT_TYPE_ID)).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get(PAYEE)).isEqualTo(actualResult.getPayee());
        assertThat(row.get(SERIAL_NO)).isEqualTo(actualResult.getSerialNo());
        assertThat(row.get(SURRENDER_REASON_ID)).isEqualTo(actualResult.getSurrenderReasonId());
        assertThat(row.get(TRANSACTION_NUMBER)).isEqualTo(actualResult.getTransactionNumber());
        assertThat(row.get(TRANSACTION_TYPE)).isEqualTo(actualResult.getTransactionType());

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_search() {

        Pagination<Instrument> page = (Pagination<Instrument>) instrumentJdbcRepository.search(getInstrumentSearch());

        assertThat(page.getPagedData().get(0).getAmount()).isEqualTo("1.00");
        assertThat(page.getPagedData().get(0).getBank().getId()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getBankAccount().getAccountNumber()).isEqualTo(ACCOUNT_NUMBER);
        assertThat(page.getPagedData().get(0).getBranchName()).isEqualTo(BRANCH_NAME);
        assertThat(page.getPagedData().get(0).getDrawer()).isEqualTo(DRAWER);
        assertThat(page.getPagedData().get(0).getFinancialStatus().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getPayee()).isEqualTo(PAYEE);
        assertThat(page.getPagedData().get(0).getSerialNo()).isEqualTo(SERIAL_NO);
        assertThat(page.getPagedData().get(0).getSurrenderReason().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getTransactionNumber()).isEqualTo(TRANSACTION_NUMBER);
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
        instrumentEntity.setTenantId(DEFAULT);
        InstrumentEntity result = instrumentJdbcRepository.findById(instrumentEntity);

        assertThat(result.getAmount()).isEqualTo("1.00");
        assertThat(result.getBankId()).isEqualTo("code");
        assertThat(result.getBankAccountId()).isEqualTo(ACCOUNT_NUMBER);
        assertThat(result.getBranchName()).isEqualTo(BRANCH_NAME);
        assertThat(result.getDrawer()).isEqualTo(DRAWER);
        assertThat(result.getFinancialStatusId()).isEqualTo("1");
        assertThat(result.getInstrumentTypeId()).isEqualTo("name");
        assertThat(result.getPayee()).isEqualTo(PAYEE);
        assertThat(result.getSerialNo()).isEqualTo(SERIAL_NO);
        assertThat(result.getSurrenderReasonId()).isEqualTo("1");
        assertThat(result.getTransactionNumber()).isEqualTo(TRANSACTION_NUMBER);
        assertThat(result.getTransactionType()).isEqualTo(CREDIT);

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentEntity instrumentEntity = InstrumentEntity.builder().id("5").build();
        instrumentEntity.setTenantId(DEFAULT);
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
        assertThat(page.getPagedData().get(0).getBankAccount().getAccountNumber()).isEqualTo(ACCOUNT_NUMBER);
        assertThat(page.getPagedData().get(0).getBranchName()).isEqualTo(BRANCH_NAME);
        assertThat(page.getPagedData().get(0).getDrawer()).isEqualTo(DRAWER);
        assertThat(page.getPagedData().get(0).getFinancialStatus().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getPayee()).isEqualTo(PAYEE);
        assertThat(page.getPagedData().get(0).getSerialNo()).isEqualTo(SERIAL_NO);
        assertThat(page.getPagedData().get(0).getSurrenderReason().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getTransactionNumber()).isEqualTo(TRANSACTION_NUMBER);
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
                        put(AMOUNT, resultSet.getString(AMOUNT));
                        put(BANK_ID, resultSet.getString(BANK_ID));
                        put(BANK_ACCOUNT_ID, resultSet.getString(BANK_ACCOUNT_ID));
                        put(BRANCH_NAME , resultSet.getString(BRANCH_NAME));
                        put(DRAWER, resultSet.getString(DRAWER));
                        put(FINANCIAL_STATUS_ID, resultSet.getString(FINANCIAL_STATUS_ID));
                        put(INSTRUMENT_TYPE_ID, resultSet.getString(INSTRUMENT_TYPE_ID));
                        put(PAYEE, resultSet.getString(PAYEE));
                        put(SERIAL_NO, resultSet.getString(SERIAL_NO));
                        put(TRANSACTION_NUMBER, resultSet.getString(TRANSACTION_NUMBER));
                        put(TRANSACTION_TYPE, resultSet.getString(TRANSACTION_TYPE));
                        put(SURRENDER_REASON_ID, resultSet.getString(SURRENDER_REASON_ID));
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
        instrumentSearch.setBranchName(BRANCH_NAME);
        instrumentSearch.setDrawer(DRAWER);
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().id("1").build());
        instrumentSearch.setRemittanceVoucherId("1");
        instrumentSearch.setInstrumentType(InstrumentType.builder().id("1").build());
        instrumentSearch.setPayee(PAYEE);
        instrumentSearch.setSerialNo(SERIAL_NO);
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("1").build());
        instrumentSearch.setTransactionNumber(TRANSACTION_NUMBER);
        instrumentSearch.setTransactionType(TransactionType.Credit);
        instrumentSearch.setReceiptIds("1");
        instrumentSearch.setTenantId(DEFAULT);
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
        instrumentSearch.setBankAccount(BankAccountContract.builder().accountNumber(ACCOUNT_NUMBER).build());
        instrumentSearch.setBranchName(BRANCH_NAME);
        instrumentSearch.setDrawer(DRAWER);
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().id("1").build());
        instrumentSearch.setFinancialStatuses("1");
        instrumentSearch.setRemittanceVoucherId("1");
        instrumentSearch.setInstrumentType(InstrumentType.builder().name("name").build());
        instrumentSearch.setInstrumentTypes("name");
        instrumentSearch.setPayee(PAYEE);
        instrumentSearch.setSerialNo(SERIAL_NO);
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("1").build());
        instrumentSearch.setTransactionNumber(TRANSACTION_NUMBER);
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
        instrumentSearch.setTenantId(DEFAULT);
        instrumentSearch.setPageSize(500);
        instrumentSearch.setOffset(0);
        instrumentSearch.setSortBy("id desc");
        return instrumentSearch;
    }
}