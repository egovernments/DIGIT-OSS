package org.egov.demand.web.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.amendment.model.Amendment;
import org.egov.demand.amendment.model.AmendmentCriteria;
import org.egov.demand.amendment.model.AmendmentRequest;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.repository.AmendmentRepository;
import org.egov.demand.repository.IdGenRepo;
import org.egov.demand.service.DemandService;
import org.egov.demand.util.Util;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;



public class AmendmentValidatorTest {

    @Mock
    private Util util;

    @Mock
    private ObjectMapper mapper;

    @Mock
    private IdGenRepo idGenRepo;

    @Mock
    private DemandService demandService;

    @Mock
    private ApplicationProperties props;

    @Mock
    private AmendmentRepository amendmentRepository;

    @Mock
    private AmendmentValidator amendmentValidator;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        ReflectionTestUtils.setField(amendmentValidator, "mapper", mapper);
        ReflectionTestUtils.setField(amendmentValidator, "idGenRepo", idGenRepo);
        ReflectionTestUtils.setField(amendmentValidator, "demandService", demandService);
        ReflectionTestUtils.setField(amendmentValidator, "props", props);
        ReflectionTestUtils.setField(amendmentValidator, "amendmentRepository", amendmentRepository);
    }

    @Test
    @DisplayName("Should set the id of amendment to a random UUID")
    public void testEnrichAmendmentForCreateShouldSetIdOfAmendmentToRandomUUID() {

        AmendmentRequest amendmentRequest = AmendmentRequest.builder().build();
        Amendment amendment = Amendment.builder().build();
        amendmentRequest.setAmendment(amendment);
        RequestInfo requestInfo = RequestInfo.builder().build();
        amendmentRequest.setRequestInfo(requestInfo);

        amendmentValidator.enrichAmendmentForCreate(amendmentRequest);

        assertNotNull("1",amendment.getId());
    }

    @Test
    @DisplayName("Should set the id of demandDetails to a random UUID")
    public void testEnrichAmendmentForCreateShouldSetIdOfDemandDetailsToRandomUUID() {
        AmendmentValidator amendmentValidator1 =new AmendmentValidator();
        AmendmentRequest amendmentRequest = AmendmentRequest.builder().build();
        Amendment amendment = Amendment.builder().build();
        amendmentRequest.setAmendment(amendment);
        RequestInfo requestInfo = RequestInfo.builder().build();
        amendmentRequest.setRequestInfo(requestInfo);
        when(props.getIsAmendmentworkflowEnabed()).thenReturn(true);
        when(props.getAmendmentWfModuleName()).thenReturn("amendment");
        when(props.getAmendmentWfName()).thenReturn("amendment");
        when(props.getAmendmentWfOpenAction()).thenReturn("OPEN");

        amendmentValidator.enrichAmendmentForCreate(amendmentRequest);


    }

    @Test
    void testValidateAmendmentCriteriaForSearch() {
        AmendmentValidator amendmentValidator = new AmendmentValidator();
        AmendmentCriteria amendmentCriteria = new AmendmentCriteria();
        amendmentValidator.validateAmendmentCriteriaForSearch(amendmentCriteria);
        assertTrue(amendmentCriteria.getConsumerCode().isEmpty());
    }

    @Test
    void testValidateAmendmentCriteriaForSearch3() {
        AmendmentValidator amendmentValidator = new AmendmentValidator();
        AmendmentCriteria amendmentCriteria = mock(AmendmentCriteria.class);
        when(amendmentCriteria.getConsumerCode()).thenReturn(new HashSet<>());
        amendmentValidator.validateAmendmentCriteriaForSearch(amendmentCriteria);
        verify(amendmentCriteria).getConsumerCode();
    }

    @Test
    void testValidateAmendmentCriteriaForSearch4() {
        AmendmentValidator amendmentValidator = new AmendmentValidator();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        AmendmentCriteria amendmentCriteria = mock(AmendmentCriteria.class);
        when(amendmentCriteria.getBusinessService()).thenReturn("Business Service");
        when(amendmentCriteria.getConsumerCode()).thenReturn(stringSet);
        amendmentValidator.validateAmendmentCriteriaForSearch(amendmentCriteria);
        verify(amendmentCriteria).getBusinessService();
        verify(amendmentCriteria).getConsumerCode();
    }

    @Test
    void testValidateAmendmentCriteriaForSearch5() {
        AmendmentValidator amendmentValidator = new AmendmentValidator();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        AmendmentCriteria amendmentCriteria = mock(AmendmentCriteria.class);
        when(amendmentCriteria.getBusinessService()).thenReturn("");
        when(amendmentCriteria.getConsumerCode()).thenReturn(stringSet);
        assertThrows(CustomException.class, () -> amendmentValidator.validateAmendmentCriteriaForSearch(amendmentCriteria));
        verify(amendmentCriteria).getBusinessService();
        verify(amendmentCriteria).getConsumerCode();
    }

    @Test
    void testValidateAmendmentCriteriaForSearch6() {
        AmendmentValidator amendmentValidator = new AmendmentValidator();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        AmendmentCriteria amendmentCriteria = mock(AmendmentCriteria.class);
        when(amendmentCriteria.getBusinessService())
                .thenThrow(new CustomException("EG_BS_AMENDMENT_CRITERIA_ERROR", "An error occurred"));
        when(amendmentCriteria.getConsumerCode()).thenReturn(stringSet);
        assertThrows(CustomException.class, () -> amendmentValidator.validateAmendmentCriteriaForSearch(amendmentCriteria));
        verify(amendmentCriteria).getBusinessService();
        verify(amendmentCriteria).getConsumerCode();
    }
}

