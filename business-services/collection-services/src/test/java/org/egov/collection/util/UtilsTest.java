package org.egov.collection.util;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UtilsTest {

    @Test
    void testIsPositiveInteger() {
        assertTrue(Utils.isPositiveInteger(BigDecimal.valueOf(42L)));
        assertTrue(Utils.isPositiveInteger(BigDecimal.valueOf(0L)));
        assertFalse(Utils.isPositiveInteger(BigDecimal.valueOf(-1L)));
    }
}

