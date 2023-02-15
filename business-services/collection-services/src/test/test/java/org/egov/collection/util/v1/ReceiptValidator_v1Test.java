package org.egov.collection.util.v1;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;

import org.egov.collection.model.v1.ReceiptRequest_v1;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {ReceiptValidator_v1.class})
@ExtendWith(SpringExtension.class)
class ReceiptValidator_v1Test {
    @Autowired
    private ReceiptValidator_v1 receiptValidator_v1;

    @Test
    void testValidateUserInfo() {
        ReceiptRequest_v1 receiptReq = new ReceiptRequest_v1();
        HashMap<String, String> stringStringMap = new HashMap<>();
        this.receiptValidator_v1.validateUserInfo(receiptReq, stringStringMap);
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo2() {
        RequestInfo requestInfo = new RequestInfo();
        ReceiptRequest_v1 receiptReq = new ReceiptRequest_v1(requestInfo, new ArrayList<>());

        HashMap<String, String> stringStringMap = new HashMap<>();
        this.receiptValidator_v1.validateUserInfo(receiptReq, stringStringMap);
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo4() {
        ReceiptRequest_v1 receiptRequest_v1 = mock(ReceiptRequest_v1.class);
        when(receiptRequest_v1.getRequestInfo()).thenReturn(new RequestInfo());
        HashMap<String, String> stringStringMap = new HashMap<>();
        this.receiptValidator_v1.validateUserInfo(receiptRequest_v1, stringStringMap);
        verify(receiptRequest_v1, atLeast(1)).getRequestInfo();
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo5() {
        ReceiptRequest_v1 receiptRequest_v1 = mock(ReceiptRequest_v1.class);
        when(receiptRequest_v1.getRequestInfo()).thenReturn(new RequestInfo("42", "INVALID_USER_INFO", 4L,
                "INVALID_USER_INFO", "INVALID_USER_INFO", "INVALID_USER_INFO", "42", "ABC123", "42", new User()));
        HashMap<String, String> stringStringMap = new HashMap<>();
        this.receiptValidator_v1.validateUserInfo(receiptRequest_v1, stringStringMap);
        verify(receiptRequest_v1, atLeast(1)).getRequestInfo();
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo6() {
        ReceiptRequest_v1 receiptRequest_v1 = mock(ReceiptRequest_v1.class);
        when(receiptRequest_v1.getRequestInfo())
                .thenReturn(new RequestInfo("42", "INVALID_USER_INFO", 4L, "INVALID_USER_INFO", "INVALID_USER_INFO",
                        "INVALID_USER_INFO", "42", "ABC123", "42", new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID",
                        "42", "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210")));
        this.receiptValidator_v1.validateUserInfo(receiptRequest_v1, new HashMap<>());
        verify(receiptRequest_v1, atLeast(1)).getRequestInfo();
    }

    @Test
    void testValidateUserInfo7() {
        ReceiptRequest_v1 receiptRequest_v1 = mock(ReceiptRequest_v1.class);
        when(receiptRequest_v1.getRequestInfo()).thenReturn(new RequestInfo("42", "INVALID_USER_INFO", 4L,
                "INVALID_USER_INFO", "INVALID_USER_INFO", "INVALID_USER_INFO", "42", "ABC123", "42",
                new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42", "42", new ArrayList<>(), "42", "")));
        HashMap<String, String> stringStringMap = new HashMap<>();
        this.receiptValidator_v1.validateUserInfo(receiptRequest_v1, stringStringMap);
        verify(receiptRequest_v1, atLeast(1)).getRequestInfo();
        assertEquals(1, stringStringMap.size());
    }
}

