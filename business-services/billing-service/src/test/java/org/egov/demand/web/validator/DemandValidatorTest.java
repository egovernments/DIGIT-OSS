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
    /**
     * Method under test: {@link DemandValidator#supports(Class)}
     */
    @Test
    void testSupports() {
        DemandValidator demandValidator = new DemandValidator();
        assertFalse(demandValidator.supports(Object.class));
    }

    /**
     * Method under test: {@link DemandValidator#validate(Object, org.springframework.validation.Errors)}
     */
    @Test
    void testValidate() {
        DemandValidator demandValidator = new DemandValidator();
        ArrayList<Object> objectList = new ArrayList<>();
        assertThrows(RuntimeException.class,
                () -> demandValidator.validate(objectList, new BindException(objectList, "java.util.Collection")));
    }

    /**
     * Method under test: {@link DemandValidator#validateForUpdate(Object, org.springframework.validation.Errors)}
     */
    @Test
    void testValidateForUpdate() {
        DemandValidator demandValidator = new DemandValidator();
        assertThrows(RuntimeException.class, () -> demandValidator.validateForUpdate("Target",
                new BindException(new BindException(new BindException(new BindException(mock(BindingResult.class)))))));
    }

    /**
     * Method under test: {@link DemandValidator#validateForUpdate(Object, org.springframework.validation.Errors)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testValidateForUpdate2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.web.validator.DemandValidator.validateDemandForUpdate(DemandValidator.java:140)
        //       at org.egov.demand.web.validator.DemandValidator.validateForUpdate(DemandValidator.java:130)
        //   In order to prevent validateForUpdate(Object, Errors)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   validateForUpdate(Object, Errors).
        //   See https://diff.blue/R013 to resolve this issue.

        DemandValidator demandValidator = new DemandValidator();
        DemandRequest target = new DemandRequest();
        demandValidator.validateForUpdate(target,
                new BindException(new BindException(new BindException(new BindException(mock(BindingResult.class))))));
    }

    /**
     * Method under test: {@link DemandValidator#validateForUpdate(Object, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testValidateDemandCriteria2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.web.validator.DemandValidator.validateDemandCriteria(DemandValidator.java:396)
        //   In order to prevent validateDemandCriteria(DemandCriteria, Errors)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   validateDemandCriteria(DemandCriteria, Errors).
        //   See https://diff.blue/R013 to resolve this issue.

        DemandValidator demandValidator = new DemandValidator();
        BindingResult bindingResult = mock(BindingResult.class);
        doNothing().when(bindingResult).rejectValue((String) any(), (String) any(), (String) any());
        demandValidator.validateDemandCriteria(null,
                new BindException(new BindException(new BindException(new BindException(bindingResult)))));
    }

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testValidateDemandCriteria4() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   org.springframework.beans.NotReadablePropertyException: Invalid property 'businessService' of bean class [java.lang.String]: Bean property 'businessService' is not readable or has an invalid getter method: Does the return type of the getter match the parameter type of the setter?
        //       at org.springframework.beans.AbstractNestablePropertyAccessor.getPropertyValue(AbstractNestablePropertyAccessor.java:622)
        //       at org.springframework.beans.AbstractNestablePropertyAccessor.getPropertyValue(AbstractNestablePropertyAccessor.java:612)
        //       at org.springframework.validation.AbstractPropertyBindingResult.getActualFieldValue(AbstractPropertyBindingResult.java:104)
        //       at org.springframework.validation.AbstractBindingResult.rejectValue(AbstractBindingResult.java:117)
        //       at org.springframework.validation.AbstractErrors.rejectValue(AbstractErrors.java:133)
        //       at org.springframework.validation.BindException.rejectValue(BindException.java:129)
        //       at org.springframework.validation.BindException.rejectValue(BindException.java:129)
        //       at org.springframework.validation.BindException.rejectValue(BindException.java:129)
        //       at org.egov.demand.web.validator.DemandValidator.validateDemandCriteria(DemandValidator.java:400)
        //   In order to prevent validateDemandCriteria(DemandCriteria, Errors)
        //   from throwing NotReadablePropertyException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   validateDemandCriteria(DemandCriteria, Errors).
        //   See https://diff.blue/R013 to resolve this issue.

        DemandValidator demandValidator = new DemandValidator();
        DemandCriteria demandCriteria = new DemandCriteria();
        demandValidator.validateDemandCriteria(demandCriteria, new BindException(
                new BindException(new BindException(new BeanPropertyBindingResult("Target", "businessService")))));
    }

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

    /**
     * Method under test: {@link DemandValidator#validateDemandCriteria(DemandCriteria, org.springframework.validation.Errors)}
     */
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

