package org.egov.collection.repository;

import org.egov.collection.model.BankAccountServiceMapping;
import org.egov.collection.model.BankAccountServiceMappingSearchCriteria;
import org.egov.collection.repository.querybuilder.BankAccountServiceQueryBuilder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {BankAccountMappingRepository.class})
@ExtendWith(SpringExtension.class)
class BankAccountMappingRepositoryTest {
    @Autowired
    private BankAccountMappingRepository bankAccountMappingRepository;

    @MockBean
    private BankAccountServiceQueryBuilder bankAccountServiceQueryBuilder;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Test
    void testPersistBankAccountServiceMapping() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(), (java.util.Map<String, ?>[]) any()))
                .thenReturn(new int[]{1, 1, 1, 1});
        when(this.bankAccountServiceQueryBuilder.insertBankAccountServiceDetailsQuery()).thenReturn("3");
        this.bankAccountMappingRepository.persistBankAccountServiceMapping(new ArrayList<>());
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(), (java.util.Map<String, ?>[]) any());
        verify(this.bankAccountServiceQueryBuilder).insertBankAccountServiceDetailsQuery();
    }

    @Test
    void testPersistBankAccountServiceMapping2() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(), (java.util.Map<String, ?>[]) any()))
                .thenReturn(new int[]{1, 1, 1, 1});
        when(this.bankAccountServiceQueryBuilder.insertBankAccountServiceDetailsQuery()).thenReturn("3");

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new BankAccountServiceMapping());
        this.bankAccountMappingRepository.persistBankAccountServiceMapping(bankAccountServiceMappingList);
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(), (java.util.Map<String, ?>[]) any());
        verify(this.bankAccountServiceQueryBuilder).insertBankAccountServiceDetailsQuery();
    }

    @Test
    void testSearchBankAccountServicemapping() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
        when(this.bankAccountServiceQueryBuilder.BankAccountServiceMappingSearchQuery(
                (BankAccountServiceMappingSearchCriteria) any(), (java.util.Map<String, Object>) any())).thenReturn("3");
        List<BankAccountServiceMapping> actualSearchBankAccountServicemappingResult = this.bankAccountMappingRepository
                .searchBankAccountServicemapping(new BankAccountServiceMappingSearchCriteria());
        assertSame(objectList, actualSearchBankAccountServicemappingResult);
        assertTrue(actualSearchBankAccountServicemappingResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
        verify(this.bankAccountServiceQueryBuilder).BankAccountServiceMappingSearchQuery(
                (BankAccountServiceMappingSearchCriteria) any(), (java.util.Map<String, Object>) any());
    }

    @Test
    void testSearchBankAccountBranches() throws DataAccessException {
        ArrayList<Long> resultLongList = new ArrayList<>();
        when(this.jdbcTemplate.queryForList((String) any(), (Class<Long>) any(), (Object[]) any()))
                .thenReturn(resultLongList);
        when(this.bankAccountServiceQueryBuilder.getAllBankAccountsForServiceQuery()).thenReturn("3");
        List<Long> actualSearchBankAccountBranchesResult = this.bankAccountMappingRepository
                .searchBankAccountBranches("42");
        assertSame(resultLongList, actualSearchBankAccountBranchesResult);
        assertTrue(actualSearchBankAccountBranchesResult.isEmpty());
        verify(this.jdbcTemplate).queryForList((String) any(), (Class<Long>) any(), (Object[]) any());
        verify(this.bankAccountServiceQueryBuilder).getAllBankAccountsForServiceQuery();
    }
}

