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
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.domain.repository.SurrenderReasonRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;

@Import(TestConfiguration.class)
@RunWith(SpringRunner.class)
public class SurrenderReasonServiceTest {

    private SurrenderReasonService surrenderReasonService;

    @Mock
    private SmartValidator validator;

    @Mock
    private SurrenderReasonRepository surrenderReasonRepository;

    private BindingResult errors = new BeanPropertyBindingResult(null, null);

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        surrenderReasonService = new SurrenderReasonService(validator, surrenderReasonRepository);
    }

    @Test
    public final void test_save_with_out_kafka() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.uniqueCheck(any(String.class), any(SurrenderReason.class))).thenReturn(true);
        when(surrenderReasonRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = CustomBindException.class)
    public final void test_save_with_out_kafka_unique_false() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.uniqueCheck(any(String.class), any(SurrenderReason.class))).thenReturn(false);
        when(surrenderReasonRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.create(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_save_with_out_kafka_and_with_null_req() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.uniqueCheck(any(String.class), any(SurrenderReason.class))).thenReturn(false);
        when(surrenderReasonRepository.save(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.create(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_update_with_out_kafka() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);
        when(surrenderReasonRepository.uniqueCheck(any(String.class), any(SurrenderReason.class))).thenReturn(true);
        List<SurrenderReason> actualResult = surrenderReasonService.update(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = CustomBindException.class)
    public final void test_update_with_out_kafka_unique_false() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);
        when(surrenderReasonRepository.uniqueCheck(any(String.class), any(SurrenderReason.class))).thenReturn(false);
        List<SurrenderReason> actualResult = surrenderReasonService.update(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_delete_with_out_kafka() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.delete(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.delete(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_with_out_kafka_and_with_null_req() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();

        when(surrenderReasonRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.update(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_update_without_id() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();
        expextedResult.get(0).setId(null);

        when(surrenderReasonRepository.update(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.update(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test
    public final void test_search() {

        List<SurrenderReason> surrenderReasons = getSurrenderReasons();
        SurrenderReasonSearch surrenderReasonSearch = new SurrenderReasonSearch();
        Pagination<SurrenderReason> expextedResult = new Pagination<>();

        expextedResult.setPagedData(surrenderReasons);

        when(surrenderReasonRepository.search(surrenderReasonSearch)).thenReturn(expextedResult);

        Pagination<SurrenderReason> actualResult = surrenderReasonService.search(surrenderReasonSearch);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_save() {

        SurrenderReason expextedResult = getSurrenderReasons().get(0);

        when(surrenderReasonRepository.save(any(SurrenderReason.class))).thenReturn(expextedResult);

        SurrenderReason actualResult = surrenderReasonService.save(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_update() {

        SurrenderReason expextedResult = getSurrenderReasons().get(0);

        when(surrenderReasonRepository.update(any(SurrenderReason.class))).thenReturn(expextedResult);

        SurrenderReason actualResult = surrenderReasonService.update(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_delete() {

        SurrenderReason expextedResult = getSurrenderReasons().get(0);

        when(surrenderReasonRepository.delete(any(SurrenderReason.class))).thenReturn(expextedResult);

        SurrenderReason actualResult = surrenderReasonService.delete(expextedResult);

        assertEquals(expextedResult, actualResult);
    }

    @Test(expected = InvalidDataException.class)
    public final void test_delete_with_out_surrenderreasons() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();
        expextedResult.get(0).setId(null);

        when(surrenderReasonRepository.delete(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.delete(null, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    @Test(expected = InvalidDataException.class)
    public final void test_delete_with_out_id() {

        List<SurrenderReason> expextedResult = getSurrenderReasons();
        expextedResult.get(0).setId(null);

        when(surrenderReasonRepository.delete(any(List.class), any(RequestInfo.class))).thenReturn(expextedResult);

        List<SurrenderReason> actualResult = surrenderReasonService.delete(expextedResult, errors, requestInfo);

        assertEquals(expextedResult, actualResult);

    }

    private List<SurrenderReason> getSurrenderReasons() {
        List<SurrenderReason> surrenderReasons = new ArrayList<SurrenderReason>();
        SurrenderReason surrenderReason = SurrenderReason.builder().id("1").name("name").build();
        surrenderReason.setTenantId("default");
        SurrenderReason surrenderReason1 = SurrenderReason.builder().id("1").name("name").build();
        surrenderReason.setTenantId("default");
        surrenderReasons.add(surrenderReason);
        surrenderReasons.add(surrenderReason1);
        return surrenderReasons;
    }

}
