package org.egov.collection.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;

import org.egov.collection.model.BankAccountServiceMappingSearchCriteria;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BankAccountServiceQueryBuilder.class})
@ExtendWith(SpringExtension.class)
class BankAccountServiceQueryBuilderTest {
    @Autowired
    private BankAccountServiceQueryBuilder bankAccountServiceQueryBuilder;

    @Test
    void testInsertBankAccountServiceDetailsQuery() {
        assertEquals(
                "INSERT INTO egcl_bankaccountservicemapping (id, businessdetails, bankaccount, bank, bankbranch, active,"
                        + " createdby, lastmodifiedby, createddate, lastmodifieddate, tenantid) values(nextval('seq_egcl"
                        + "_bankaccountservicemapping'), :businessdetails, :bankaccount, :bank, :bankbranch, :active, :createdby,"
                        + " :lastmodifiedby, :createddate, :lastmodifieddate, :tenantid)",
                this.bankAccountServiceQueryBuilder.insertBankAccountServiceDetailsQuery());
    }

    @Test
    void testBankAccountServiceMappingSearchQuery() {
        BankAccountServiceMappingSearchCriteria searchCriteria = new BankAccountServiceMappingSearchCriteria();
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("select * from egcl_bankaccountservicemapping where tenantid =:tenantId order by businessdetails",
                this.bankAccountServiceQueryBuilder.BankAccountServiceMappingSearchQuery(searchCriteria, stringObjectMap));
        assertEquals(1, stringObjectMap.size());
    }

    @Test
    void testBankAccountServiceMappingSearchQuery3() {
        BankAccountServiceMappingSearchCriteria searchCriteria = new BankAccountServiceMappingSearchCriteria("42",
                new ArrayList<>(), "3", "select * from egcl_bankaccountservicemapping where tenantid =:tenantId",
                "janedoe/featurebranch");

        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals(
                "select * from egcl_bankaccountservicemapping where tenantid =:tenantId and bankaccount =:bankaccount"
                        + " and bank =:bank and bankBranch =:bankBranch order by businessdetails",
                this.bankAccountServiceQueryBuilder.BankAccountServiceMappingSearchQuery(searchCriteria, stringObjectMap));
        assertEquals(4, stringObjectMap.size());
    }

    @Test
    void testBankAccountServiceMappingSearchQuery4() {
        BankAccountServiceMappingSearchCriteria bankAccountServiceMappingSearchCriteria = mock(
                BankAccountServiceMappingSearchCriteria.class);
        when(bankAccountServiceMappingSearchCriteria.getBank()).thenReturn("Bank");
        when(bankAccountServiceMappingSearchCriteria.getBankAccount()).thenReturn("3");
        when(bankAccountServiceMappingSearchCriteria.getBankBranch()).thenReturn("janedoe/featurebranch");
        when(bankAccountServiceMappingSearchCriteria.getTenantId()).thenReturn("42");
        when(bankAccountServiceMappingSearchCriteria.getBusinessDetails()).thenReturn(new ArrayList<>());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals(
                "select * from egcl_bankaccountservicemapping where tenantid =:tenantId and bankaccount =:bankaccount"
                        + " and bank =:bank and bankBranch =:bankBranch order by businessdetails",
                this.bankAccountServiceQueryBuilder
                        .BankAccountServiceMappingSearchQuery(bankAccountServiceMappingSearchCriteria, stringObjectMap));
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBank();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBankBranch();
        verify(bankAccountServiceMappingSearchCriteria).getTenantId();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBusinessDetails();
        assertEquals(4, stringObjectMap.size());
    }

    @Test
    void testBankAccountServiceMappingSearchQuery5() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("select * from egcl_bankaccountservicemapping where tenantid =:tenantId");
        BankAccountServiceMappingSearchCriteria bankAccountServiceMappingSearchCriteria = mock(
                BankAccountServiceMappingSearchCriteria.class);
        when(bankAccountServiceMappingSearchCriteria.getBank()).thenReturn("Bank");
        when(bankAccountServiceMappingSearchCriteria.getBankAccount()).thenReturn("3");
        when(bankAccountServiceMappingSearchCriteria.getBankBranch()).thenReturn("janedoe/featurebranch");
        when(bankAccountServiceMappingSearchCriteria.getTenantId()).thenReturn("42");
        when(bankAccountServiceMappingSearchCriteria.getBusinessDetails()).thenReturn(stringList);
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals(
                "select * from egcl_bankaccountservicemapping where tenantid =:tenantId and businessdetails ilike any"
                        + "  (array ['%select * from egcl_bankaccountservicemapping where tenantid =:tenantId%']) and bankaccount"
                        + " =:bankaccount and bank =:bank and bankBranch =:bankBranch order by businessdetails",
                this.bankAccountServiceQueryBuilder
                        .BankAccountServiceMappingSearchQuery(bankAccountServiceMappingSearchCriteria, stringObjectMap));
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBank();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBankBranch();
        verify(bankAccountServiceMappingSearchCriteria).getTenantId();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBusinessDetails();
        assertEquals(4, stringObjectMap.size());
    }

    @Test
    void testBankAccountServiceMappingSearchQuery6() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("select * from egcl_bankaccountservicemapping where tenantid =:tenantId");
        stringList.add("select * from egcl_bankaccountservicemapping where tenantid =:tenantId");
        BankAccountServiceMappingSearchCriteria bankAccountServiceMappingSearchCriteria = mock(
                BankAccountServiceMappingSearchCriteria.class);
        when(bankAccountServiceMappingSearchCriteria.getBank()).thenReturn("Bank");
        when(bankAccountServiceMappingSearchCriteria.getBankAccount()).thenReturn("3");
        when(bankAccountServiceMappingSearchCriteria.getBankBranch()).thenReturn("janedoe/featurebranch");
        when(bankAccountServiceMappingSearchCriteria.getTenantId()).thenReturn("42");
        when(bankAccountServiceMappingSearchCriteria.getBusinessDetails()).thenReturn(stringList);
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals(
                "select * from egcl_bankaccountservicemapping where tenantid =:tenantId and businessdetails ilike any"
                        + "  (array ['%select * from egcl_bankaccountservicemapping where tenantid =:tenantId%', '%select * from"
                        + " egcl_bankaccountservicemapping where tenantid =:tenantId%']) and bankaccount =:bankaccount and bank"
                        + " =:bank and bankBranch =:bankBranch order by businessdetails",
                this.bankAccountServiceQueryBuilder
                        .BankAccountServiceMappingSearchQuery(bankAccountServiceMappingSearchCriteria, stringObjectMap));
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBank();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBankAccount();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBankBranch();
        verify(bankAccountServiceMappingSearchCriteria).getTenantId();
        verify(bankAccountServiceMappingSearchCriteria, atLeast(1)).getBusinessDetails();
        assertEquals(4, stringObjectMap.size());
    }

    @Test
    void testConstructor() {
        assertEquals(
                "select distinct(bankaccount) bankAccount from egcl_bankaccountservicemapping where" + " tenantId=:tenantId",
                (new BankAccountServiceQueryBuilder()).getAllBankAccountsForServiceQuery());
    }
}

