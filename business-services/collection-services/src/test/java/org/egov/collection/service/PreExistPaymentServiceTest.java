package org.egov.collection.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.egov.tracer.model.ServiceCallException;
import org.junit.jupiter.api.Test;

class PreExistPaymentServiceTest {

    @Test
    void testUpdatePaymentBankDetails() {

        assertThrows(ServiceCallException.class, () -> (new PreExistPaymentService()).updatePaymentBankDetails("Ifsccode"));
    }

    @Test
    void testUpdatePaymentBankDetails2() {

        (new PreExistPaymentService()).updatePaymentBankDetails("");
    }
}

