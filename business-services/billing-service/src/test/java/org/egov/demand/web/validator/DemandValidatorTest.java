package org.egov.demand.web.validator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;

import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.enums.Type;
import org.egov.demand.web.contract.DemandRequest;
import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;

class DemandValidatorTest {

    @Test
    void testSupports() {
        DemandValidator demandValidator = new DemandValidator();
        assertFalse(demandValidator.supports(Object.class));
    }


    @Test
    void testValidate() {
        DemandValidator demandValidator = new DemandValidator();
        ArrayList<Object> objectList = new ArrayList<>();
        assertThrows(RuntimeException.class,
                () -> demandValidator.validate(objectList, new BindException(objectList, "java.util.Collection")));
    }


    @Test
    void testValidateForUpdate() {
        DemandValidator demandValidator = new DemandValidator();
        assertThrows(RuntimeException.class, () -> demandValidator.validateForUpdate("Target",
                new BindException(new BindException(new BindException(new BindException(mock(BindingResult.class)))))));
    }



    @Test
    void testValidateForUpdate3() {
        DemandValidator demandValidator = new DemandValidator();
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).addAllErrors((org.springframework.validation.Errors) any());

        BindException bindException = new BindException(bindingResult);
        bindException.addAllErrors(
                new BindException(new BindException(new BindException(new BindException(mock(BindingResult.class))))));
        assertThrows(RuntimeException.class, () -> demandValidator.validateForUpdate("Target",
                new BindException(new BindException(new BindException(bindException)))));
        verify(bindingResult).addAllErrors((org.springframework.validation.Errors) any());
    }


    @Test
    void testValidateDemandCriteria() {
        DemandValidator demandValidator = new DemandValidator();
        DemandCriteria demandCriteria = new DemandCriteria();
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        verify(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
    }


    @Test
    void testValidateDemandCriteria3() {
        DemandValidator demandValidator = new DemandValidator();
        HashSet<String> demandId = new HashSet<>();
        HashSet<String> payer = new HashSet<>();
        HashSet<String> consumerCode = new HashSet<>();
        BigDecimal valueOfResult = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria("42", demandId, payer, consumerCode, "businessService",
                valueOfResult, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS, "42", "jane.doe@example.org", "businessService",
                true, true);

        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertEquals("businessService", demandCriteria.getBusinessService());
        assertEquals(Type.ARREARS, demandCriteria.getType());
        assertEquals("42", demandCriteria.getTenantId());
        assertEquals("businessService", demandCriteria.getStatus());
        assertTrue(demandCriteria.getReceiptRequired());
        assertEquals(1L, demandCriteria.getPeriodTo().longValue());
        assertEquals(1L, demandCriteria.getPeriodFrom().longValue());
        assertTrue(demandCriteria.getPayer().isEmpty());
        assertEquals("42", demandCriteria.getMobileNumber());
        assertTrue(demandCriteria.getIsPaymentCompleted());
        assertEquals("jane.doe@example.org", demandCriteria.getEmail());
        BigDecimal demandTo = demandCriteria.getDemandTo();
        assertEquals(valueOfResult, demandTo);
        assertTrue(demandCriteria.getDemandId().isEmpty());
        assertTrue(demandCriteria.getConsumerCode().isEmpty());
        assertEquals(demandTo, demandCriteria.getDemandFrom());
    }



    @Test
    void testValidateDemandCriteria5() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setDemandId(new HashSet<>());
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertFalse(demandCriteria.getReceiptRequired());
        assertTrue(demandCriteria.getDemandId().isEmpty());
    }

    @Test
    void testValidateDemandCriteria6() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setConsumerCode(new HashSet<>());
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertFalse(demandCriteria.getReceiptRequired());
        assertTrue(demandCriteria.getConsumerCode().isEmpty());
    }


    @Test
    void testValidateDemandCriteria7() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setBusinessService("businessService");
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertEquals("businessService", demandCriteria.getBusinessService());
        assertFalse(demandCriteria.getReceiptRequired());
    }


    @Test
    void testValidateDemandCriteria8() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        BigDecimal valueOfResult = BigDecimal.valueOf(42L);
        demandCriteria.setDemandFrom(valueOfResult);
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertFalse(demandCriteria.getReceiptRequired());
        assertSame(valueOfResult, demandCriteria.getDemandFrom());
    }


    @Test
    void testValidateDemandCriteria9() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        BigDecimal valueOfResult = BigDecimal.valueOf(42L);
        demandCriteria.setDemandTo(valueOfResult);
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertFalse(demandCriteria.getReceiptRequired());
        assertSame(valueOfResult, demandCriteria.getDemandTo());
    }


    @Test
    void testValidateDemandCriteria10() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setType(Type.ARREARS);
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertEquals(Type.ARREARS, demandCriteria.getType());
        assertFalse(demandCriteria.getReceiptRequired());
    }


    @Test
    void testValidateDemandCriteria11() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setMobileNumber("42");
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertFalse(demandCriteria.getReceiptRequired());
        assertEquals("42", demandCriteria.getMobileNumber());
    }


    @Test
    void testValidateDemandCriteria12() {
        DemandValidator demandValidator = new DemandValidator();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setEmail("jane.doe@example.org");
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(demandCriteria,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
        assertFalse(demandCriteria.getReceiptRequired());
        assertEquals("jane.doe@example.org", demandCriteria.getEmail());
    }
}

