package org.egov.demand.web.validator;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.util.HashSet;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.demand.model.UpdateBillCriteria;
import org.egov.demand.util.Util;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BillValidator.class})
@ExtendWith(SpringExtension.class)
class BillValidatorTest {
    @Autowired
    private BillValidator billValidator;

    @MockBean
    private Util util;

    @Test
    void testValidateBillGenRequest() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
        GenerateBillCriteria generateBillCriteria = new GenerateBillCriteria();
        assertThrows(CustomException.class,
                () -> this.billValidator.validateBillGenRequest(generateBillCriteria, new RequestInfo()));
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }



    @Test
    void testValidateBillGenRequest3() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
        GenerateBillCriteria generateBillCriteria = new GenerateBillCriteria("42", "42", new HashSet<>(),
                "BILL_GEN_MANDATORY_FIELDS_MISSING", "jane.doe@example.org", "42");

        this.billValidator.validateBillGenRequest(generateBillCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillGenRequest4() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());

        GenerateBillCriteria generateBillCriteria = new GenerateBillCriteria();
        generateBillCriteria.setEmail("jane.doe@example.org");
        this.billValidator.validateBillGenRequest(generateBillCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillGenRequest5() {
        doThrow(new CustomException("BILL_GEN_MANDATORY_FIELDS_MISSING", "An error occurred")).when(this.util)
                .validateTenantIdForUserType((String) any(), (RequestInfo) any());
        GenerateBillCriteria generateBillCriteria = new GenerateBillCriteria();
        assertThrows(CustomException.class,
                () -> this.billValidator.validateBillGenRequest(generateBillCriteria, new RequestInfo()));
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillGenRequest6() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        GenerateBillCriteria generateBillCriteria = new GenerateBillCriteria("42", "42", stringSet,
                "BILL_GEN_MANDATORY_FIELDS_MISSING", "jane.doe@example.org", "42");

        this.billValidator.validateBillGenRequest(generateBillCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillSearchCriteria() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
        BillSearchCriteria billCriteria = new BillSearchCriteria();
        assertThrows(CustomException.class,
                () -> this.billValidator.validateBillSearchCriteria(billCriteria, new RequestInfo()));
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillSearchCriteria3() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
        HashSet<String> billId = new HashSet<>();
        BillSearchCriteria billCriteria = new BillSearchCriteria("42", billId, 2L, 2L, true, true, true, new HashSet<>(),
                "42", "EGBS_MANDATORY_FIELDS_ERROR", true, 3L, 2L, "jane.doe@example.org", BillV2.BillStatus.ACTIVE, "42");

        this.billValidator.validateBillSearchCriteria(billCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }

    @Test
    void testValidateBillSearchCriteria4() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());

        BillSearchCriteria billSearchCriteria = new BillSearchCriteria();
        billSearchCriteria.setBillId(new HashSet<>());
        this.billValidator.validateBillSearchCriteria(billSearchCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillSearchCriteria5() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());

        BillSearchCriteria billSearchCriteria = new BillSearchCriteria();
        billSearchCriteria.setEmail("jane.doe@example.org");
        this.billValidator.validateBillSearchCriteria(billSearchCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillSearchCriteria6() {
        doNothing().when(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());

        BillSearchCriteria billSearchCriteria = new BillSearchCriteria();
        billSearchCriteria.setMobileNumber("42");
        this.billValidator.validateBillSearchCriteria(billSearchCriteria, new RequestInfo());
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }

    @Test
    void testValidateBillSearchCriteria7() {
        doThrow(new CustomException("EGBS_MANDATORY_FIELDS_ERROR", "An error occurred")).when(this.util)
                .validateTenantIdForUserType((String) any(), (RequestInfo) any());
        BillSearchCriteria billCriteria = new BillSearchCriteria();
        assertThrows(CustomException.class,
                () -> this.billValidator.validateBillSearchCriteria(billCriteria, new RequestInfo()));
        verify(this.util).validateTenantIdForUserType((String) any(), (RequestInfo) any());
    }


    @Test
    void testValidateBillSearchRequest2() {
        HashSet<String> consumerCodes = new HashSet<>();
        MissingNode additionalDetails = MissingNode.getInstance();
        assertThrows(CustomException.class, () -> this.billValidator.validateBillSearchRequest(new UpdateBillCriteria("42",
                consumerCodes, "reasonMessage", additionalDetails, new HashSet<>(), BillV2.BillStatus.ACTIVE)));
    }


    @Test
    void testValidateBillSearchRequest4() {
        UpdateBillCriteria updateBillCriteria = mock(UpdateBillCriteria.class);
        when(updateBillCriteria.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        doNothing().when(updateBillCriteria).setStatusToBeUpdated((BillV2.BillStatus) any());
        assertThrows(CustomException.class, () -> this.billValidator.validateBillSearchRequest(updateBillCriteria));
        verify(updateBillCriteria).getAdditionalDetails();
        verify(updateBillCriteria).setStatusToBeUpdated((BillV2.BillStatus) any());
    }
}

