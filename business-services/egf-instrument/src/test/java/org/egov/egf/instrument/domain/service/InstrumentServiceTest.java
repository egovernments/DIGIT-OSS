package org.egov.egf.instrument.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.TestConfiguration;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.repository.InstrumentRepository;
import org.egov.egf.instrument.domain.repository.InstrumentTypeRepository;
import org.egov.egf.instrument.domain.repository.SurrenderReasonRepository;
import org.egov.egf.instrument.web.contract.InstrumentContract;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.egov.egf.master.web.repository.BankAccountContractRepository;
import org.egov.egf.master.web.repository.BankContractRepository;
import org.egov.egf.master.web.repository.FinancialStatusContractRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;

@Import(TestConfiguration.class)
@RunWith(SpringRunner.class)
public class InstrumentServiceTest {

    private InstrumentService instrumentService;

    @Mock
    private InstrumentRepository instrumentRepository;

    @Mock
    private SmartValidator validator;

    @Mock
    private SurrenderReasonRepository surrenderReasonRepository;

    @Mock
    private BankContractRepository bankContractRepository;

    @Mock
    private FinancialStatusContractRepository financialStatusContractRepository;

    @Mock
    private BankAccountContractRepository bankAccountContractRepository;

    @Mock
    private InstrumentTypeRepository instrumentTypeRepository;

    private BindingResult errors = new BeanPropertyBindingResult(null, null);

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        instrumentService = new InstrumentService(validator, instrumentRepository,
                bankContractRepository, financialStatusContractRepository, bankAccountContractRepository,
                instrumentTypeRepository);
    }

    @Test
    public final void test_create_dd() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("dd");

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("dd");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_dd_null_transnumber() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("dd");
        expextedResult.get(0).setTransactionNumber(null);
        expextedResult.get(0).setBank(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("dd");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(false);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_dd_null_bankdetails() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("dd");
        expextedResult.get(0).setBank(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("dd");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(false);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_create_cheque() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("cheque");

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("cheque");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), Matchers.anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_cheque_null_transnumber() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("cheque");
        expextedResult.get(0).setTransactionNumber(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("cheque");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), Matchers.anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_cheque_null_bankdetails() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("cheque");
        expextedResult.get(0).setBank(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("cheque");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), Matchers.anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_create_cash() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("cash");

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("cash");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }
    
    @Test
    public final void test_create_cash_zero_amount() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("cash");
        expextedResult.get(0).setAmount(new BigDecimal(0));

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("cash");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }
    
    

    @Test(expected = InvalidDataException.class)
    public final void test_create_cash_null_transnumber() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("cash");
        expextedResult.get(0).setTransactionNumber(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("cash");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), Matchers.anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_create_online() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("online");

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("online");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_online_null_transnumber() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("online");
        expextedResult.get(0).setTransactionNumber(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("online");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_create_bankchallan() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("bankchallan");

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("bankchallan");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), Matchers.anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_bankchallan_null_transnumber() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("bankchallan");
        expextedResult.get(0).setTransactionNumber(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("bankchallan");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_bankchallan_null_bankdetails() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("bankchallan");
        expextedResult.get(0).setBank(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("bankchallan");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_bankchallan_null_bankaccountdetails() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).getInstrumentType().setName("bankchallan");
        expextedResult.get(0).setBankAccount(null);

        Pagination<InstrumentType> pit = getInstrumentType();
        pit.getPagedData().get(0).setName("bankchallan");

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(pit);
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(getBankContract());
        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(getBankAccountContract());
        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(getFinancialStatusContract());
        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(getSurrenderReason());
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);

        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    private SurrenderReason getSurrenderReason() {
        return SurrenderReason.builder().name("name").description("description").id("1")
                .build();
    }

    private BankAccountContract getBankAccountContract() {
        return BankAccountContract.builder().accountNumber("accountNumber")
                .description("description").active(true).id("1").build();
    }

    private BankContract getBankContract() {
        return BankContract.builder().code("code").description("description").active(true)
                .id("1").build();
    }

    private Pagination<InstrumentType> getInstrumentType() {
        Pagination<InstrumentType> page = new Pagination<>();
        page.setPagedData(getInstrumentTypes());
        return page;
    }

    @Test(expected = InvalidDataException.class)
    public final void test_save_with_null_req() {

        List<Instrument> expextedResult = getInstruments();

        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(false);
        when(instrumentRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.create(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_update_() {

        List<Instrument> expextedResult = getInstrumentss();
        expextedResult.get(0).setId("1");
        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);
        when(instrumentRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.update(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_null_id() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).setId(null);

        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);
        when(instrumentRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.update(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_delete_() {

        List<Instrument> expextedResult = getInstruments();

        expextedResult.get(0).setId("1");

        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);
        when(instrumentRepository.delete(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.delete(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_delete_null_id() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).setId(null);

        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);
        when(instrumentRepository.delete(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.delete(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_with_null_req() {

        List<Instrument> expextedResult = getInstruments();

        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);
        when(instrumentRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.update(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_without_id() {

        List<Instrument> expextedResult = getInstruments();
        expextedResult.get(0).setId(null);

        when(instrumentRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.update(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_delete_with_null_req() {

        List<Instrument> expextedResult = getInstruments();

        when(instrumentRepository.uniqueCheck(any(String.class), any(Instrument.class))).thenReturn(true);
        when(instrumentRepository.delete(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.delete(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_search() {

        List<Instrument> instruments = getInstruments();
        InstrumentSearch instrumentSearch = new InstrumentSearch();
        Pagination<Instrument> expextedResult = new Pagination<>();

        expextedResult.setPagedData(instruments);

        when(instrumentRepository.search(instrumentSearch)).thenReturn(expextedResult);

        Pagination<Instrument> actualResult = instrumentService.search(instrumentSearch);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_save() {

        Instrument expextedResult = getInstruments().get(0);

        when(instrumentRepository.save(any(Instrument.class))).thenReturn(expextedResult);

        Instrument actualResult = instrumentService.save(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_update() {

        Instrument expextedResult = getInstruments().get(0);

        when(instrumentRepository.update(any(Instrument.class))).thenReturn(expextedResult);

        Instrument actualResult = instrumentService.update(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_delete() {

        Instrument expextedResult = getInstruments().get(0);

        when(instrumentRepository.delete(any(Instrument.class))).thenReturn(expextedResult);

        Instrument actualResult = instrumentService.delete(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_fetch_instrumenttype() {

        List<Instrument> instruments = getInstrumentss();
        Pagination<InstrumentType> expextedResult = new Pagination<>();
        InstrumentType it = InstrumentType.builder().name("name").description("description").active(true).id("1")
                .build();
        expextedResult.setPagedData(new ArrayList<>());
        expextedResult.getPagedData().add(it);
        instruments.get(0).setInstrumentType(it);

        when(instrumentTypeRepository.search(any(InstrumentTypeSearch.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult.getPagedData().get(0), actualResult.get(0).getInstrumentType());
    }

    @Test
    public final void test_fetch_bank() {

        List<Instrument> instruments = getInstrumentss();

        BankContract expextedResult = BankContract.builder().id("id").description("description").active(true)
                .id("1").build();

        instruments.get(0).setBank(expextedResult);

        when(bankContractRepository.findById(any(BankContract.class), anyObject())).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getBank());
    }

    @Test
    public final void test_fetch_bankaccount() {

        List<Instrument> instruments = getInstrumentss();

        BankAccountContract expextedResult = BankAccountContract.builder().accountNumber("accountNumber")
                .description("description").active(true).id("1").build();

        instruments.get(0).setBankAccount(expextedResult);

        when(bankAccountContractRepository.findByAccountNumber(any(BankAccountContract.class), anyObject()))
                .thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getBankAccount());
    }

    @Test
    public final void test_fetch_financialstatus() {

        List<Instrument> instruments = getInstrumentss();

        FinancialStatusContract expextedResult = FinancialStatusContract.builder().name("name")
                .description("description").id("1").build();

        instruments.get(0).setFinancialStatus(expextedResult);

        when(financialStatusContractRepository.findById(any(FinancialStatusContract.class), Matchers.anyObject()))
                .thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getFinancialStatus());
    }

    @Test
    public final void test_fetch_surrenderreason() {

        List<Instrument> instruments = getInstrumentss();

        SurrenderReason expextedResult = SurrenderReason.builder().name("name").description("description").id("1")
                .build();

        instruments.get(0).setSurrenderReason(expextedResult);

        when(surrenderReasonRepository.findById(any(SurrenderReason.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getSurrenderReason());
    }

    @Test(expected = InvalidDataException.class)
    public final void test_fetch_instrumenttype_null() {

        List<Instrument> instruments = getInstrumentss();
        Pagination<InstrumentType> expextedResult = new Pagination<>();
        InstrumentType it = InstrumentType.builder().name("name").description("description").active(true).id("1")
                .build();
        expextedResult.setPagedData(new ArrayList<>());
        expextedResult.getPagedData().add(it);
        instruments.get(0).setInstrumentType(it);

        when(instrumentTypeRepository.search(null)).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult.getPagedData().get(0), actualResult.get(0).getInstrumentType());

    }

   /* @Test(expected = InvalidDataException.class)
    public final void test_fetch_bank_null() {

        List<Instrument> instruments = getInstrumentss();

        BankContract expextedResult = BankContract.builder().name("name").description("description").id("1").build();

        instruments.get(0).setBank(expextedResult);

        when(bankContractRepository.findById(null, new RequestInfo())).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getBank());
    }*/

   /* @Test(expected = InvalidDataException.class)
    public final void test_fetch_bankaccount_null() {

        List<Instrument> instruments = getInstrumentss();

        BankAccountContract expextedResult = BankAccountContract.builder().accountNumber("accountNumber")
                .description("description").id("1").build();

        instruments.get(0).setBankAccount(expextedResult);

        when(bankAccountContractRepository.findByAccountNumber(null, null)).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getBankAccount());
    }*/
    @Test
    public final void test_fetch_financialstatus_null() {

        List<Instrument> instruments = getInstrumentss();

        FinancialStatusContract expextedResult = FinancialStatusContract.builder().name("name")
                .description("description").id("1").build();

        instruments.get(0).setFinancialStatus(expextedResult);

        when(financialStatusContractRepository.findById(null, new RequestInfo())).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getFinancialStatus());
    }

    @Test
    public final void test_fetch_surrenderreason_null() {

        List<Instrument> instruments = getInstrumentss();

        SurrenderReason expextedResult = SurrenderReason.builder().name("name").description("description").id("1").build();

        instruments.get(0).setSurrenderReason(expextedResult);

        when(surrenderReasonRepository.findById(null)).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.fetchRelated(instruments, new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getSurrenderReason());
    }

    @Test
    public final void test_deposit() {

        List<Instrument> expextedResult = getInstruments();

        when(instrumentRepository.findById(any(Instrument.class))).thenReturn(getInstruments().get(0));
        when(financialStatusContractRepository.findByModuleCode(any(FinancialStatusContract.class)))
                .thenReturn(getFinancialStatusContract());
        when(instrumentRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.deposit(getInstrumentRequest(), errors, requestInfo);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_dishonor() {

        List<Instrument> expextedResult = getInstruments();

        when(instrumentRepository.findById(any(Instrument.class))).thenReturn(getInstruments().get(0));
        when(financialStatusContractRepository.findByModuleCode(any(FinancialStatusContract.class)))
                .thenReturn(getFinancialStatusContract());
        when(instrumentRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<Instrument> actualResult = instrumentService.dishonor(getInstrumentRequest(), errors, requestInfo);

        assertEquals(expextedResult, actualResult);
    }

    private FinancialStatusContract getFinancialStatusContract() {
        return FinancialStatusContract.builder().code("Deposit").moduleType("Instrument").build();
    }

    private InstrumentRequest getInstrumentRequest() {
        InstrumentRequest instrumentDepositRequest = new InstrumentRequest();
        instrumentDepositRequest.setInstruments(getInstrumentContracts());
        instrumentDepositRequest.getInstruments().get(0).setId("instrumentDepositId");
        return instrumentDepositRequest;
    }

    private List<Instrument> getInstruments() {
        List<Instrument> instruments = new ArrayList<Instrument>();
        InstrumentType it = InstrumentType.builder().name("dd").build();
        it.setTenantId("default");
        Instrument instrument = Instrument.builder().amount(BigDecimal.ONE).id("1")
                .payee("payee")
                .bank(BankContract.builder().code("code").description("description").active(true)
                        .id("1").build())
                .bankAccount(BankAccountContract.builder().accountNumber("accountNumber")
                        .description("description").active(true).id("1").build())
                .financialStatus(FinancialStatusContract.builder().name("name")
                        .description("description").id("1").build())
                .surrenderReason(SurrenderReason.builder().name("name").description("description").id("1")
                        .build())
                .instrumentType(it)
                .transactionNumber("1")
                .transactionDate(new Date()).build();
        instrument.setTenantId("default");
        instruments.add(instrument);
        return instruments;
    }

    private List<Instrument> getInstrumentss() {
        List<Instrument> instruments = new ArrayList<Instrument>();
        Instrument instrument = Instrument.builder().build();
        instrument.setTenantId("default");
        instruments.add(instrument);
        return instruments;
    }

    private List<InstrumentContract> getInstrumentContracts() {
        List<InstrumentContract> instrumentContracts = new ArrayList<InstrumentContract>();
        InstrumentContract instrumentContract = InstrumentContract.builder().build();
        instrumentContract.setTenantId("default");
        instrumentContracts.add(instrumentContract);
        return instrumentContracts;
    }

    private List<InstrumentType> getInstrumentTypes() {
        List<InstrumentType> lits = new ArrayList<>();
        InstrumentType it = InstrumentType.builder().name("cheque").build();
        it.setTenantId("default");
        lits.add(it);
        return lits;
    }
}
