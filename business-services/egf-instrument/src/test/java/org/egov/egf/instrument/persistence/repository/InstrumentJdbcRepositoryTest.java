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

    private String string1="accountNumber";

    private String string2="branchName";

    private String string3="drawer";

    private String string4="payee";

    private String string5="serialNo";

    private String string6="transactionNumber";

    private String string7="Credit";

    private String string8="default";

    private String string9="amount";

    private String string10="bankId";

    private String string11="bankAccountId";

    private String string12="financialStatusId";

    private String string13="instrumentTypeId";

    private String string14="surrenderReasonId";

    private String string15="transactionType";

    @Before
    public void setUp() throws Exception {
        instrumentJdbcRepository = new InstrumentJdbcRepository(namedParameterJdbcTemplate, jdbcTemplate,
                instrumentVoucherJdbcRepository, dishonorReasonJdbcRepository);
    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql" })
    public void test_create() {

        InstrumentEntity instrument = InstrumentEntity.builder().id("1").amount(BigDecimal.ONE)
                .bankAccountId(string1).bankId("code").branchName(string2).drawer(string3)
                .financialStatusId("1").instrumentTypeId("name").payee(string4).serialNo(string5)
                .surrenderReasonId("1").transactionNumber(string6).transactionDate(new Date())
                .transactionType(string7).build();
        instrument.setTenantId(string8);
        InstrumentEntity actualResult = instrumentJdbcRepository.create(instrument);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrument",
                new InstrumentResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get(string9).toString()).isEqualTo("1.00");
        assertThat(row.get(string10)).isEqualTo(actualResult.getBankId());
        assertThat(row.get(string11)).isEqualTo(actualResult.getBankAccountId());
        assertThat(row.get(string2)).isEqualTo(actualResult.getBranchName());
        assertThat(row.get(string3)).isEqualTo(actualResult.getDrawer());
        assertThat(row.get(string12)).isEqualTo(actualResult.getFinancialStatusId());
        assertThat(row.get(string13)).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get(string4)).isEqualTo(actualResult.getPayee());
        assertThat(row.get(string5)).isEqualTo(actualResult.getSerialNo());
        assertThat(row.get(string14)).isEqualTo(actualResult.getSurrenderReasonId());
        assertThat(row.get(string6)).isEqualTo(actualResult.getTransactionNumber());
        assertThat(row.get(string15)).isEqualTo(actualResult.getTransactionType());

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_update() {

        InstrumentEntity instrument = InstrumentEntity.builder().id("1").amount(BigDecimal.ONE).bankAccountId("1")
                .bankId("1").branchName(string2).drawer(string3).financialStatusId("1").instrumentTypeId("1")
                .payee(string4).serialNo(string5).surrenderReasonId("1").transactionNumber(string6)
                .transactionDate(new Date()).transactionType(string7).build();
        instrument.setTenantId(string8);
        InstrumentEntity actualResult = instrumentJdbcRepository.update(instrument);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_instrument",
                new InstrumentResultExtractor());
        Map<String, Object> row = result.get(0);

        assertThat(row.get(string9).toString()).isEqualTo("1.00");
        assertThat(row.get(string10)).isEqualTo(actualResult.getBankId());
        assertThat(row.get(string11)).isEqualTo(actualResult.getBankAccountId());
        assertThat(row.get(string2)).isEqualTo(actualResult.getBranchName());
        assertThat(row.get(string3)).isEqualTo(actualResult.getDrawer());
        assertThat(row.get(string12)).isEqualTo(actualResult.getFinancialStatusId());
        assertThat(row.get(string13)).isEqualTo(actualResult.getInstrumentTypeId());
        assertThat(row.get(string4)).isEqualTo(actualResult.getPayee());
        assertThat(row.get(string5)).isEqualTo(actualResult.getSerialNo());
        assertThat(row.get(string14)).isEqualTo(actualResult.getSurrenderReasonId());
        assertThat(row.get(string6)).isEqualTo(actualResult.getTransactionNumber());
        assertThat(row.get(string15)).isEqualTo(actualResult.getTransactionType());

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_search() {

        Pagination<Instrument> page = (Pagination<Instrument>) instrumentJdbcRepository.search(getInstrumentSearch());

        assertThat(page.getPagedData().get(0).getAmount()).isEqualTo("1.00");
        assertThat(page.getPagedData().get(0).getBank().getId()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getBankAccount().getAccountNumber()).isEqualTo(string1);
        assertThat(page.getPagedData().get(0).getBranchName()).isEqualTo(string2);
        assertThat(page.getPagedData().get(0).getDrawer()).isEqualTo(string3);
        assertThat(page.getPagedData().get(0).getFinancialStatus().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getPayee()).isEqualTo(string4);
        assertThat(page.getPagedData().get(0).getSerialNo()).isEqualTo(string5);
        assertThat(page.getPagedData().get(0).getSurrenderReason().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getTransactionNumber()).isEqualTo(string6);
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
        instrumentEntity.setTenantId(string8);
        InstrumentEntity result = instrumentJdbcRepository.findById(instrumentEntity);

        assertThat(result.getAmount()).isEqualTo("1.00");
        assertThat(result.getBankId()).isEqualTo("code");
        assertThat(result.getBankAccountId()).isEqualTo(string1);
        assertThat(result.getBranchName()).isEqualTo(string2);
        assertThat(result.getDrawer()).isEqualTo(string3);
        assertThat(result.getFinancialStatusId()).isEqualTo("1");
        assertThat(result.getInstrumentTypeId()).isEqualTo("name");
        assertThat(result.getPayee()).isEqualTo(string4);
        assertThat(result.getSerialNo()).isEqualTo(string5);
        assertThat(result.getSurrenderReasonId()).isEqualTo("1");
        assertThat(result.getTransactionNumber()).isEqualTo(string6);
        assertThat(result.getTransactionType()).isEqualTo(string7);

    }

    @Test
    @Sql(scripts = { "/sql/instrument/clearInstrument.sql", "/sql/instrument/insertInstrumentData.sql" })
    public void test_find_by_invalid_id_should_return_null() {

        InstrumentEntity instrumentEntity = InstrumentEntity.builder().id("5").build();
        instrumentEntity.setTenantId(string8);
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
        assertThat(page.getPagedData().get(0).getBankAccount().getAccountNumber()).isEqualTo(string1);
        assertThat(page.getPagedData().get(0).getBranchName()).isEqualTo(string2);
        assertThat(page.getPagedData().get(0).getDrawer()).isEqualTo(string3);
        assertThat(page.getPagedData().get(0).getFinancialStatus().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getInstrumentType().getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getPayee()).isEqualTo(string4);
        assertThat(page.getPagedData().get(0).getSerialNo()).isEqualTo(string5);
        assertThat(page.getPagedData().get(0).getSurrenderReason().getId()).isEqualTo("1");
        assertThat(page.getPagedData().get(0).getTransactionNumber()).isEqualTo(string6);
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
                        put(string9, resultSet.getString(string9));
                        put(string10, resultSet.getString(string10));
                        put(string11, resultSet.getString(string11));
                        put(string2 , resultSet.getString(string2));
                        put(string3, resultSet.getString(string3));
                        put(string12, resultSet.getString(string12));
                        put(string13, resultSet.getString(string13));
                        put(string4, resultSet.getString(string4));
                        put(string5, resultSet.getString(string5));
                        put(string6, resultSet.getString(string6));
                        put(string15, resultSet.getString(string15));
                        put(string14, resultSet.getString(string14));
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
        instrumentSearch.setBranchName(string2);
        instrumentSearch.setDrawer(string3);
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().id("1").build());
        instrumentSearch.setRemittanceVoucherId("1");
        instrumentSearch.setInstrumentType(InstrumentType.builder().id("1").build());
        instrumentSearch.setPayee(string4);
        instrumentSearch.setSerialNo(string5);
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("1").build());
        instrumentSearch.setTransactionNumber(string6);
        instrumentSearch.setTransactionType(TransactionType.Credit);
        instrumentSearch.setReceiptIds("1");
        instrumentSearch.setTenantId(string8);
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
        instrumentSearch.setBankAccount(BankAccountContract.builder().accountNumber(string1).build());
        instrumentSearch.setBranchName(string2);
        instrumentSearch.setDrawer(string3);
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().id("1").build());
        instrumentSearch.setFinancialStatuses("1");
        instrumentSearch.setRemittanceVoucherId("1");
        instrumentSearch.setInstrumentType(InstrumentType.builder().name("name").build());
        instrumentSearch.setInstrumentTypes("name");
        instrumentSearch.setPayee(string4);
        instrumentSearch.setSerialNo(string5);
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("1").build());
        instrumentSearch.setTransactionNumber(string6);
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
        instrumentSearch.setTenantId(string8);
        instrumentSearch.setPageSize(500);
        instrumentSearch.setOffset(0);
        instrumentSearch.setSortBy("id desc");
        return instrumentSearch;
    }
}