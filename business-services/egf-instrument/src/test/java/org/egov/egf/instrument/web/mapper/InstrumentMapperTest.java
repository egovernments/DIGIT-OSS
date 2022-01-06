package org.egov.egf.instrument.web.mapper;

import static org.junit.Assert.assertEquals;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.User;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.TransactionType;
import org.egov.egf.instrument.web.contract.InstrumentContract;
import org.egov.egf.instrument.web.contract.InstrumentSearchContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.contract.InstrumentVoucherContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.contract.TransactionTypeContract;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentMapperTest {

    @InjectMocks
    private InstrumentMapper instrumentMapper;

    @Before
    public void setup() {
        instrumentMapper = new InstrumentMapper();
    }

    @Test
    public void test_to_domain() {

        Instrument expectedDomain = instrumentMapper.toDomain(contract());

        assertEquals(expectedDomain.getId(), domain().getId());
        assertEquals(expectedDomain.getAmount(), domain().getAmount());
        assertEquals(expectedDomain.getBank().getId(), domain().getBank().getId());
        assertEquals(expectedDomain.getBankAccount().getId(), domain().getBankAccount().getId());
        assertEquals(expectedDomain.getBranchName(), domain().getBranchName());
        assertEquals(expectedDomain.getDrawer(), domain().getDrawer());
        assertEquals(expectedDomain.getFinancialStatus().getCode(), domain().getFinancialStatus().getCode());
        assertEquals(expectedDomain.getInstrumentType().getId(), domain().getInstrumentType().getId());
        assertEquals(expectedDomain.getSurrenderReason().getId(), domain().getSurrenderReason().getId());
        assertEquals(expectedDomain.getInstrumentVouchers().iterator().next().getInstrument().getId(),
                domain().getInstrumentVouchers().iterator().next().getInstrument().getId());

        assertEquals(expectedDomain.getInstrumentVouchers().iterator().next().getVoucherHeaderId(),
                domain().getInstrumentVouchers().iterator().next().getVoucherHeaderId());
        assertEquals(expectedDomain.getPayee(), domain().getPayee());
        assertEquals(expectedDomain.getSerialNo(), domain().getSerialNo());
        assertEquals(expectedDomain.getTransactionNumber(), domain().getTransactionNumber());
        assertEquals(expectedDomain.getTransactionType(), domain().getTransactionType());
        assertEquals(expectedDomain.getCreatedBy().getId(), domain().getCreatedBy().getId());
        assertEquals(expectedDomain.getLastModifiedBy().getId(), domain().getLastModifiedBy().getId());
        assertEquals(expectedDomain.getTenantId(), domain().getTenantId());

    }

    @Test
    public void test_to_contract() {

        InstrumentContract expectedContract = instrumentMapper.toContract(domain());

        assertEquals(expectedContract.getId(), contract().getId());
        assertEquals(expectedContract.getAmount(), contract().getAmount());
        assertEquals(expectedContract.getBank().getId(), contract().getBank().getId());
        assertEquals(expectedContract.getBankAccount().getId(), contract().getBankAccount().getId());
        assertEquals(expectedContract.getBranchName(), contract().getBranchName());
        assertEquals(expectedContract.getDrawer(), contract().getDrawer());
        assertEquals(expectedContract.getFinancialStatus().getCode(), contract().getFinancialStatus().getCode());
        assertEquals(expectedContract.getInstrumentType().getId(), contract().getInstrumentType().getId());
        assertEquals(expectedContract.getSurrenderReason().getId(), contract().getSurrenderReason().getId());
        assertEquals(expectedContract.getInstrumentVouchers().iterator().next().getInstrument(),
                contract().getInstrumentVouchers().iterator().next().getInstrument());

        assertEquals(expectedContract.getInstrumentVouchers().iterator().next().getVoucherHeaderId(),
                contract().getInstrumentVouchers().iterator().next().getVoucherHeaderId());
        assertEquals(expectedContract.getPayee(), contract().getPayee());
        assertEquals(expectedContract.getSerialNo(), contract().getSerialNo());
        assertEquals(expectedContract.getTransactionNumber(), contract().getTransactionNumber());
        assertEquals(expectedContract.getTransactionType(), contract().getTransactionType());
        assertEquals(expectedContract.getCreatedBy().getId(), contract().getCreatedBy().getId());
        assertEquals(expectedContract.getLastModifiedBy().getId(), contract().getLastModifiedBy().getId());
        assertEquals(expectedContract.getTenantId(), contract().getTenantId());

    }

    @Test
    public void test_to_search_domain() {

        InstrumentSearch expectedSearchDomain = instrumentMapper.toSearchDomain(searchContract());

        assertEquals(expectedSearchDomain.getId(), searchDomain().getId());
        assertEquals(expectedSearchDomain.getAmount(), searchDomain().getAmount());
        assertEquals(expectedSearchDomain.getBank().getId(), searchDomain().getBank().getId());
        assertEquals(expectedSearchDomain.getBankAccount().getId(), searchDomain().getBankAccount().getId());
        assertEquals(expectedSearchDomain.getBranchName(), searchDomain().getBranchName());
        assertEquals(expectedSearchDomain.getDrawer(), searchDomain().getDrawer());
        assertEquals(expectedSearchDomain.getFinancialStatus().getCode(),
                searchDomain().getFinancialStatus().getCode());
        assertEquals(expectedSearchDomain.getInstrumentType().getId(), searchDomain().getInstrumentType().getId());
        assertEquals(expectedSearchDomain.getSurrenderReason().getId(), searchDomain().getSurrenderReason().getId());

        assertEquals(expectedSearchDomain.getInstrumentVouchers().iterator().next().getVoucherHeaderId(),
                searchDomain().getInstrumentVouchers().iterator().next().getVoucherHeaderId());
        assertEquals(expectedSearchDomain.getPayee(), searchDomain().getPayee());
        assertEquals(expectedSearchDomain.getSerialNo(), searchDomain().getSerialNo());
        assertEquals(expectedSearchDomain.getTransactionNumber(), searchDomain().getTransactionNumber());
        assertEquals(expectedSearchDomain.getTransactionType(), searchDomain().getTransactionType());
        assertEquals(expectedSearchDomain.getCreatedBy().getId(), searchDomain().getCreatedBy().getId());
        assertEquals(expectedSearchDomain.getLastModifiedBy().getId(), searchDomain().getLastModifiedBy().getId());
        assertEquals(expectedSearchDomain.getTenantId(), searchDomain().getTenantId());
        assertEquals(expectedSearchDomain.getPageSize(), searchDomain().getPageSize());
        assertEquals(expectedSearchDomain.getOffset(), searchDomain().getOffset());
    }

    @Test
    public void test_to_search_contract() {

        InstrumentSearchContract expectedSearchContract = instrumentMapper.toSearchContract(searchDomain());

        assertEquals(expectedSearchContract.getId(), searchContract().getId());
        assertEquals(expectedSearchContract.getAmount(), searchContract().getAmount());
        assertEquals(expectedSearchContract.getBank().getId(), searchContract().getBank().getId());
        assertEquals(expectedSearchContract.getBankAccount().getId(), searchContract().getBankAccount().getId());
        assertEquals(expectedSearchContract.getBranchName(), searchContract().getBranchName());
        assertEquals(expectedSearchContract.getDrawer(), searchContract().getDrawer());
        assertEquals(expectedSearchContract.getFinancialStatus().getCode(),
                searchContract().getFinancialStatus().getCode());
        assertEquals(expectedSearchContract.getInstrumentType().getId(), searchContract().getInstrumentType().getId());
        assertEquals(expectedSearchContract.getSurrenderReason().getId(),
                searchContract().getSurrenderReason().getId());
        assertEquals(expectedSearchContract.getInstrumentVouchers().iterator().next().getInstrument(),
                searchContract().getInstrumentVouchers().iterator().next().getInstrument());

        assertEquals(expectedSearchContract.getInstrumentVouchers().iterator().next().getVoucherHeaderId(),
                searchContract().getInstrumentVouchers().iterator().next().getVoucherHeaderId());
        assertEquals(expectedSearchContract.getPayee(), searchContract().getPayee());
        assertEquals(expectedSearchContract.getSerialNo(), searchContract().getSerialNo());
        assertEquals(expectedSearchContract.getTransactionNumber(), searchContract().getTransactionNumber());
        assertEquals(expectedSearchContract.getTransactionType(), searchContract().getTransactionType());
        assertEquals(expectedSearchContract.getCreatedBy().getId(), searchContract().getCreatedBy().getId());
        assertEquals(expectedSearchContract.getLastModifiedBy().getId(), searchContract().getLastModifiedBy().getId());
        assertEquals(expectedSearchContract.getTenantId(), searchContract().getTenantId());
        assertEquals(expectedSearchContract.getPageSize(), searchContract().getPageSize());
        assertEquals(expectedSearchContract.getOffset(), searchContract().getOffset());

    }

    public Instrument domain() {

        Instrument instrument = new Instrument();

        instrument.setId("id");
        instrument.setAmount(BigDecimal.ONE);
        instrument.setBank(BankContract.builder().id("id").build());
        instrument.setBankAccount(BankAccountContract.builder().id("id").build());
        instrument.setBranchName("branchName");
        instrument.setDrawer("drawer");
        instrument.setFinancialStatus(FinancialStatusContract.builder().code("code").build());
        instrument.setInstrumentType(InstrumentType.builder().id("id").build());
        instrument.setSurrenderReason(SurrenderReason.builder().id("id").build());

        List<InstrumentVoucher> instrumentVouchers = new ArrayList<>();

        instrumentVouchers.add(InstrumentVoucher.builder().instrument(Instrument.builder().id("id").build())
                .voucherHeaderId("voucherHeaderId").build());

        instrument.setInstrumentVouchers(instrumentVouchers);

        instrument.setPayee("payee");
        instrument.setSerialNo("serialNo");
        instrument.setTransactionNumber("transactionNumber");
        instrument.setTransactionType(TransactionType.Credit);
        instrument.setCreatedBy(User.builder().id(1l).build());
        instrument.setLastModifiedBy(User.builder().id(1l).build());
        instrument.setTenantId("tenantId");

        return instrument;
    }

    public InstrumentContract contract() {

        InstrumentContract contract = new InstrumentContract();

        contract.setId("id");
        contract.setAmount(BigDecimal.ONE);
        contract.setBank(BankContract.builder().id("id").build());
        contract.setBankAccount(BankAccountContract.builder().id("id").build());
        contract.setBranchName("branchName");
        contract.setDrawer("drawer");
        contract.setFinancialStatus(FinancialStatusContract.builder().code("code").build());
        contract.setInstrumentType(InstrumentTypeContract.builder().id("id").build());
        contract.setSurrenderReason(SurrenderReasonContract.builder().id("id").build());

        List<InstrumentVoucherContract> instrumentVouchers = new ArrayList<>();

        instrumentVouchers.add(InstrumentVoucherContract.builder()
                .instrument("id").voucherHeaderId("voucherHeaderId").build());

        contract.setInstrumentVouchers(instrumentVouchers);

        contract.setPayee("payee");
        contract.setSerialNo("serialNo");
        contract.setTransactionNumber("transactionNumber");
        contract.setTransactionType(TransactionTypeContract.Credit);
        contract.setCreatedBy(User.builder().id(1l).build());
        contract.setLastModifiedBy(User.builder().id(1l).build());
        contract.setTenantId("tenantId");

        return contract;
    }

    public InstrumentSearch searchDomain() {

        InstrumentSearch instrumentSearch = new InstrumentSearch();

        instrumentSearch.setId("id");
        instrumentSearch.setAmount(BigDecimal.ONE);
        instrumentSearch.setBank(BankContract.builder().id("id").build());
        instrumentSearch.setBankAccount(BankAccountContract.builder().id("id").build());
        instrumentSearch.setBranchName("branchName");
        instrumentSearch.setDrawer("drawer");
        instrumentSearch.setFinancialStatus(FinancialStatusContract.builder().code("code").build());
        instrumentSearch.setInstrumentType(InstrumentType.builder().id("id").build());
        instrumentSearch.setSurrenderReason(SurrenderReason.builder().id("id").build());

        List<InstrumentVoucher> instrumentVouchers = new ArrayList<>();

        instrumentVouchers.add(InstrumentVoucher.builder().instrument(Instrument.builder().id("id").build())
                .voucherHeaderId("voucherHeaderId").build());

        instrumentSearch.setInstrumentVouchers(instrumentVouchers);

        instrumentSearch.setPayee("payee");
        instrumentSearch.setSerialNo("serialNo");
        instrumentSearch.setTransactionNumber("transactionNumber");
        instrumentSearch.setTransactionType(TransactionType.Credit);
        instrumentSearch.setCreatedBy(User.builder().id(1l).build());
        instrumentSearch.setLastModifiedBy(User.builder().id(1l).build());
        instrumentSearch.setTenantId("tenantId");
        instrumentSearch.setPageSize(1);
        instrumentSearch.setOffset(1);

        return instrumentSearch;
    }

    public InstrumentSearchContract searchContract() {

        InstrumentSearchContract contract = new InstrumentSearchContract();

        contract.setId("id");
        contract.setAmount(BigDecimal.ONE);
        contract.setBank(BankContract.builder().id("id").build());
        contract.setBankAccount(BankAccountContract.builder().id("id").build());
        contract.setBranchName("branchName");
        contract.setDrawer("drawer");
        contract.setFinancialStatus(FinancialStatusContract.builder().code("code").build());
        contract.setInstrumentType(InstrumentTypeContract.builder().id("id").build());
        contract.setSurrenderReason(SurrenderReasonContract.builder().id("id").build());

        List<InstrumentVoucherContract> instrumentVouchers = new ArrayList<>();

        instrumentVouchers.add(InstrumentVoucherContract.builder()
                .instrument("id").voucherHeaderId("voucherHeaderId").build());

        contract.setInstrumentVouchers(instrumentVouchers);

        contract.setPayee("payee");
        contract.setSerialNo("serialNo");
        contract.setTransactionNumber("transactionNumber");
        contract.setTransactionType(TransactionTypeContract.Credit);
        contract.setCreatedBy(User.builder().id(1l).build());
        contract.setLastModifiedBy(User.builder().id(1l).build());
        contract.setTenantId("tenantId");
        contract.setPageSize(1);
        contract.setOffset(1);

        return contract;
    }

}
