package org.egov.collection.util;

import org.egov.collection.model.BankAccountServiceMappingSearchCriteria;
import org.egov.collection.service.BankAccountMappingService;
import org.egov.collection.web.contract.BankAccountServiceMapping;
import org.egov.collection.web.contract.BankAccountServiceMappingReq;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {CollectionMastersRequestValidator.class})
@ExtendWith(SpringExtension.class)
class CollectionMastersRequestValidatorTest {
    @MockBean
    private BankAccountMappingService bankAccountMappingService;

    @Autowired
    private CollectionMastersRequestValidator collectionMastersRequestValidator;

    @Test
    void testValidateBankAccountSearchRequest() {
        Error error = this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest(new BankAccountServiceMappingSearchCriteria())
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_001", getResult.getCode());
        assertEquals("Tenant Id is Required", getResult.getMessage());
        assertEquals("tenantId", getResult.getField());
    }

    @Test
    void testValidateBankAccountSearchRequest3() {
        assertNull(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest(new BankAccountServiceMappingSearchCriteria("42", new ArrayList<>(), "3",
                        "egcl_001", "janedoe/featurebranch")));
    }

    @Test
    void testValidateBankAccountSearchRequest4() {
        BankAccountServiceMappingSearchCriteria bankAccountServiceMappingSearchCriteria = mock(
                BankAccountServiceMappingSearchCriteria.class);
        when(bankAccountServiceMappingSearchCriteria.getTenantId()).thenReturn("42");
        assertNull(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest(bankAccountServiceMappingSearchCriteria));
        verify(bankAccountServiceMappingSearchCriteria).getTenantId();
    }

    @Test
    void testValidateBankAccountSearchRequest5() {
        BankAccountServiceMappingSearchCriteria bankAccountServiceMappingSearchCriteria = mock(
                BankAccountServiceMappingSearchCriteria.class);
        when(bankAccountServiceMappingSearchCriteria.getTenantId()).thenReturn("");
        Error error = this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest(bankAccountServiceMappingSearchCriteria)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_001", getResult.getCode());
        assertEquals("Tenant Id is Required", getResult.getMessage());
        assertEquals("tenantId", getResult.getField());
        verify(bankAccountServiceMappingSearchCriteria).getTenantId();
    }

    @Test
    void testValidateBankAccountServiceRequest() {
        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        assertNull(this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq));
    }

    @Test
    void testValidateBankAccountServiceRequest2() {
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(new ArrayList<>());
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        assertNull(this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq));
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq).setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
    }

    @Test
    void testValidateBankAccountServiceRequest3() {
        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new BankAccountServiceMapping());
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        Error error = this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(3, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("Tenant Id is Required", getResult.getMessage());
        ErrorField getResult1 = fields.get(2);
        assertEquals("Please select bank account", getResult1.getMessage());
        assertEquals("businessdetails", getResult1.getField());
        assertEquals("egcl_003", getResult1.getCode());
        assertEquals("tenantId", getResult.getField());
        assertEquals("egcl_001", getResult.getCode());
        ErrorField getResult2 = fields.get(1);
        assertEquals("businessdetails", getResult2.getField());
        assertEquals("egcl_002", getResult2.getCode());
        assertEquals("Please select business details", getResult2.getMessage());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq).setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
    }

    @Test
    void testValidateBankAccountServiceRequest5() {
        when(this.bankAccountMappingService
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        BankAccountServiceMapping bankAccountServiceMapping = mock(
                BankAccountServiceMapping.class);
        when(bankAccountServiceMapping.getBankAccount()).thenReturn("3");
        when(bankAccountServiceMapping.getBusinessDetails()).thenReturn("Business Details");
        when(bankAccountServiceMapping.getTenantId()).thenReturn("42");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(bankAccountServiceMapping);
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        assertNull(this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq));
        verify(this.bankAccountMappingService)
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        verify(bankAccountServiceMapping, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMapping, atLeast(1)).getBusinessDetails();
        verify(bankAccountServiceMapping, atLeast(1)).getTenantId();
    }

    @Test
    void testValidateBankAccountServiceRequest6() {
        ArrayList<org.egov.collection.model.BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new org.egov.collection.model.BankAccountServiceMapping());
        when(this.bankAccountMappingService
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(bankAccountServiceMappingList);
        BankAccountServiceMapping bankAccountServiceMapping = mock(
                BankAccountServiceMapping.class);
        when(bankAccountServiceMapping.getBankAccount()).thenReturn("3");
        when(bankAccountServiceMapping.getBusinessDetails()).thenReturn("Business Details");
        when(bankAccountServiceMapping.getTenantId()).thenReturn("42");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList1 = new ArrayList<>();
        bankAccountServiceMappingList1.add(bankAccountServiceMapping);
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList1);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        Error error = this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_004", getResult.getCode());
        assertEquals(
                "The service Business Details is already mapped to the bank account number 3. Please select the correct"
                        + " bank account",
                getResult.getMessage());
        assertEquals("Bank Account service mappping", getResult.getField());
        verify(this.bankAccountMappingService)
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        verify(bankAccountServiceMapping, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMapping, atLeast(1)).getBusinessDetails();
        verify(bankAccountServiceMapping, atLeast(1)).getTenantId();
    }

    @Test
    void testValidateBankAccountServiceRequest7() {
        when(this.bankAccountMappingService
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        BankAccountServiceMapping bankAccountServiceMapping = mock(
                BankAccountServiceMapping.class);
        when(bankAccountServiceMapping.getBankAccount()).thenReturn(null);
        when(bankAccountServiceMapping.getBusinessDetails()).thenReturn("Business Details");
        when(bankAccountServiceMapping.getTenantId()).thenReturn("42");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(bankAccountServiceMapping);
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        Error error = this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_003", getResult.getCode());
        assertEquals("Please select bank account", getResult.getMessage());
        assertEquals("businessdetails", getResult.getField());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        verify(bankAccountServiceMapping, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMapping, atLeast(1)).getBusinessDetails();
        verify(bankAccountServiceMapping, atLeast(1)).getTenantId();
    }

    @Test
    void testValidateBankAccountServiceRequest8() {
        when(this.bankAccountMappingService
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        BankAccountServiceMapping bankAccountServiceMapping = mock(
                BankAccountServiceMapping.class);
        when(bankAccountServiceMapping.getBankAccount()).thenReturn("");
        when(bankAccountServiceMapping.getBusinessDetails()).thenReturn("Business Details");
        when(bankAccountServiceMapping.getTenantId()).thenReturn("42");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(bankAccountServiceMapping);
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        Error error = this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_003", getResult.getCode());
        assertEquals("Please select bank account", getResult.getMessage());
        assertEquals("businessdetails", getResult.getField());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        verify(bankAccountServiceMapping, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMapping, atLeast(1)).getBusinessDetails();
        verify(bankAccountServiceMapping, atLeast(1)).getTenantId();
    }

    @Test
    void testValidateBankAccountServiceRequest9() {
        when(this.bankAccountMappingService
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        BankAccountServiceMapping bankAccountServiceMapping = mock(
                BankAccountServiceMapping.class);
        when(bankAccountServiceMapping.getBankAccount()).thenReturn("3");
        when(bankAccountServiceMapping.getBusinessDetails()).thenReturn(null);
        when(bankAccountServiceMapping.getTenantId()).thenReturn("42");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(bankAccountServiceMapping);
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        Error error = this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_002", getResult.getCode());
        assertEquals("Please select business details", getResult.getMessage());
        assertEquals("businessdetails", getResult.getField());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        verify(bankAccountServiceMapping).getBankAccount();
        verify(bankAccountServiceMapping, atLeast(1)).getBusinessDetails();
        verify(bankAccountServiceMapping, atLeast(1)).getTenantId();
    }

    @Test
    void testValidateBankAccountServiceRequest10() {
        ArrayList<org.egov.collection.model.BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new org.egov.collection.model.BankAccountServiceMapping());
        when(this.bankAccountMappingService
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(bankAccountServiceMappingList);
        BankAccountServiceMapping bankAccountServiceMapping = mock(
                BankAccountServiceMapping.class);
        when(bankAccountServiceMapping.getBankAccount()).thenReturn(" is already mapped to the bank account number ");
        when(bankAccountServiceMapping.getBusinessDetails()).thenReturn("Business Details");
        when(bankAccountServiceMapping.getTenantId()).thenReturn("42");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList1 = new ArrayList<>();
        bankAccountServiceMappingList1.add(bankAccountServiceMapping);
        BankAccountServiceMappingReq bankAccountServiceMappingReq = mock(BankAccountServiceMappingReq.class);
        when(bankAccountServiceMappingReq.getBankAccountServiceMapping()).thenReturn(bankAccountServiceMappingList1);
        doNothing().when(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        doNothing().when(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        Error error = this.collectionMastersRequestValidator.validateBankAccountServiceRequest(bankAccountServiceMappingReq)
                .getError();
        assertEquals("Bank account service request is invalid", error.getMessage());
        List<ErrorField> fields = error.getFields();
        assertEquals(1, fields.size());
        assertNull(error.getDescription());
        assertEquals(400, error.getCode());
        ErrorField getResult = fields.get(0);
        assertEquals("egcl_004", getResult.getCode());
        assertEquals("The service Business Details is already mapped to the bank account number  is already mapped to the"
                + " bank account number . Please select the correct bank account", getResult.getMessage());
        assertEquals("Bank Account service mappping", getResult.getField());
        verify(this.bankAccountMappingService)
                .searchBankAccountService((BankAccountServiceMappingSearchCriteria) any());
        verify(bankAccountServiceMappingReq).getBankAccountServiceMapping();
        verify(bankAccountServiceMappingReq)
                .setBankAccountServiceMapping((List<BankAccountServiceMapping>) any());
        verify(bankAccountServiceMappingReq).setRequestInfo((RequestInfo) any());
        verify(bankAccountServiceMapping, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMapping, atLeast(1)).getBusinessDetails();
        verify(bankAccountServiceMapping, atLeast(1)).getTenantId();
    }
}

