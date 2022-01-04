package org.egov.egf.instrument.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.TestConfiguration;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.repository.InstrumentAccountCodeRepository;
import org.egov.egf.instrument.domain.repository.InstrumentTypeRepository;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.repository.ChartOfAccountContractRepository;
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
public class InstrumentAccountCodeServiceTest {

    private InstrumentAccountCodeService instrumentAccountCodeService;

    @Mock
    private InstrumentAccountCodeRepository instrumentAccountCodeRepository;

    @Mock
    private SmartValidator validator;

    @Mock
    private ChartOfAccountContractRepository chartOfAccountContractRepository;

    @Mock
    private InstrumentTypeRepository instrumentTypeRepository;

    private BindingResult errors = new BeanPropertyBindingResult(null, null);

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        instrumentAccountCodeService = new InstrumentAccountCodeService(validator, instrumentAccountCodeRepository,
                chartOfAccountContractRepository, instrumentTypeRepository);
    }

    @Test
    public final void test_create() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);
        when(instrumentAccountCodeRepository.uniqueCheck(any(String.class), any(InstrumentAccountCode.class))).thenReturn(true);
        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.create(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = CustomBindException.class)
    public final void test_create_unique_false() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);
        when(instrumentAccountCodeRepository.uniqueCheck(any(String.class), any(InstrumentAccountCode.class))).thenReturn(false);
        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.create(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_create_and_with_null_req() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.create(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_update_() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.update(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);
        when(instrumentAccountCodeRepository.uniqueCheck(any(String.class), any(InstrumentAccountCode.class))).thenReturn(true);
        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.update(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_null_id() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();
        expextedResult.get(0).setId(null);

        when(instrumentAccountCodeRepository.update(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);
        when(instrumentAccountCodeRepository.uniqueCheck(any(String.class), any(InstrumentAccountCode.class))).thenReturn(true);
        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.update(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = CustomBindException.class)
    public final void test_update_unique_false() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.update(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);
        when(instrumentAccountCodeRepository.uniqueCheck(any(String.class), any(InstrumentAccountCode.class))).thenReturn(false);
        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.update(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_delete_() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.delete(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.delete(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_delete_null_req() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.delete(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.delete(null, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_delete_null_id() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();
        expextedResult.get(0).setId(null);

        when(instrumentAccountCodeRepository.delete(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.delete(expextedResult, errors,
                requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_with_null_req() {

        List<InstrumentAccountCode> expextedResult = getInstrumentAccountCodes();

        when(instrumentAccountCodeRepository.update(any(List.class), any(RequestInfo.class)))
                .thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.update(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_search() {

        List<InstrumentAccountCode> instrumentAccountCodes = getInstrumentAccountCodes();
        InstrumentAccountCodeSearch instrumentAccountCodeSearch = new InstrumentAccountCodeSearch();
        Pagination<InstrumentAccountCode> expextedResult = new Pagination<>();

        expextedResult.setPagedData(instrumentAccountCodes);

        when(instrumentAccountCodeRepository.search(instrumentAccountCodeSearch)).thenReturn(expextedResult);

        Pagination<InstrumentAccountCode> actualResult = instrumentAccountCodeService
                .search(instrumentAccountCodeSearch);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_save() {

        InstrumentAccountCode expextedResult = getInstrumentAccountCodes().get(0);

        when(instrumentAccountCodeRepository.save(any(InstrumentAccountCode.class))).thenReturn(expextedResult);

        InstrumentAccountCode actualResult = instrumentAccountCodeService.save(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_update() {

        InstrumentAccountCode expextedResult = getInstrumentAccountCodes().get(0);

        when(instrumentAccountCodeRepository.update(any(InstrumentAccountCode.class))).thenReturn(expextedResult);

        InstrumentAccountCode actualResult = instrumentAccountCodeService.update(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_delete() {

        InstrumentAccountCode expextedResult = getInstrumentAccountCodes().get(0);

        when(instrumentAccountCodeRepository.delete(any(InstrumentAccountCode.class))).thenReturn(expextedResult);

        InstrumentAccountCode actualResult = instrumentAccountCodeService.delete(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test(expected = InvalidDataException.class)
    public final void test_fetch_instrumenttype() {

        List<InstrumentAccountCode> instrumentAccountCodes = getInstrumentAccountCodes();

        InstrumentType expextedResult = InstrumentType.builder().name("name").description("description").active(true)
                .id("1").build();

        instrumentAccountCodes.get(0).setInstrumentType(expextedResult);

        when(instrumentTypeRepository.findById(any(InstrumentType.class))).thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.fetchRelated(instrumentAccountCodes,
                new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getInstrumentType());
    }

    @Test
    public final void test_fetch_accountcode() {

        List<InstrumentAccountCode> instrumentAccountCodes = getInstrumentAccountCodes();

        ChartOfAccountContract expextedResult = ChartOfAccountContract.builder().glcode("glcode").id("1").build();

        instrumentAccountCodes.get(0).setAccountCode(expextedResult);

        when(chartOfAccountContractRepository.findByGlcode(any(ChartOfAccountContract.class), Matchers.anyObject()))
                .thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.fetchRelated(instrumentAccountCodes,
                new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getAccountCode());
    }

    @Test(expected = InvalidDataException.class)
    public final void test_fetch_instrumenttype_null() {

        List<InstrumentAccountCode> instrumentAccountCodes = getInstrumentAccountCodes();

        InstrumentType expextedResult = InstrumentType.builder().name("name").description("description").active(true)
                .id("1").build();

        instrumentAccountCodes.get(0).setInstrumentType(expextedResult);

        when(instrumentTypeRepository.findById(null)).thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.fetchRelated(instrumentAccountCodes,
                new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getInstrumentType());
    }

    @Test(expected = InvalidDataException.class)
    public final void test_fetch_accountcode_null() {

        List<InstrumentAccountCode> instrumentAccountCodes = getInstrumentAccountCodes();

        ChartOfAccountContract expextedResult = ChartOfAccountContract.builder().glcode("glcode").id("1").build();

        instrumentAccountCodes.get(0).setAccountCode(expextedResult);

        when(chartOfAccountContractRepository.findByGlcode(null, new RequestInfo())).thenReturn(expextedResult);

        List<InstrumentAccountCode> actualResult = instrumentAccountCodeService.fetchRelated(instrumentAccountCodes,
                new RequestInfo());

        assertEquals(expextedResult, actualResult.get(0).getAccountCode());
    }

    private List<InstrumentAccountCode> getInstrumentAccountCodes() {
        List<InstrumentAccountCode> instrumentAccountCodes = new ArrayList<InstrumentAccountCode>();
        InstrumentAccountCode instrumentAccountCode = InstrumentAccountCode.builder().id("1").build();
        instrumentAccountCode.setTenantId("default");
        instrumentAccountCodes.add(instrumentAccountCode);
        return instrumentAccountCodes;
    }

}
