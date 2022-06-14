package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.egov.demand.model.Demand;

import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.PaymentBackUpdateAudit;
import org.egov.demand.repository.querybuilder.DemandQueryBuilder;
import org.egov.demand.repository.rowmapper.DemandRowMapper;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.DemandRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {DemandRepository.class})
@ExtendWith(SpringExtension.class)
class DemandRepositoryTest {
    @MockBean
    private DemandQueryBuilder demandQueryBuilder;

    @Autowired
    private DemandRepository demandRepository;

    @MockBean
    private DemandRowMapper demandRowMapper;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private Util util;


    @Test
    void testGetDemands() throws DataAccessException {
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn("Query");
        when(this.demandQueryBuilder.getDemandQuery((DemandCriteria) any(), (List<Object>) any()))
                .thenThrow(new EmptyResultDataAccessException(3));
        assertThrows(EmptyResultDataAccessException.class, () -> this.demandRepository.getDemands(new DemandCriteria()));
        verify(this.demandQueryBuilder).getDemandQuery((DemandCriteria) any(), (List<Object>) any());
    }

    @Test
    void testGetDemands2() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        when(this.demandQueryBuilder.getDemandQuery((DemandCriteria) any(), (List<Object>) any()))
                .thenReturn("Demand Query");
        List<Demand> actualDemands = this.demandRepository.getDemands(new DemandCriteria());
        assertSame(objectList, actualDemands);
        assertTrue(actualDemands.isEmpty());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.demandQueryBuilder).getDemandQuery((DemandCriteria) any(), (List<Object>) any());
    }

    @Test
    void testGetDemandsForConsumerCodes() throws DataAccessException {
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn("Query");
        when(this.demandQueryBuilder.getDemandQueryForConsumerCodes((java.util.Map<String, Set<String>>) any(),
                (List<Object>) any(), (String) any())).thenThrow(new EmptyResultDataAccessException(3));
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.demandRepository.getDemandsForConsumerCodes(new HashMap<>(), "42"));
        verify(this.demandQueryBuilder).getDemandQueryForConsumerCodes((java.util.Map<String, Set<String>>) any(),
                (List<Object>) any(), (String) any());
    }


    @Test
    void testGetDemandsForConsumerCodes2() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        when(this.demandQueryBuilder.getDemandQueryForConsumerCodes((java.util.Map<String, Set<String>>) any(),
                (List<Object>) any(), (String) any())).thenReturn("Demand Query For Consumer Codes");
        List<Demand> actualDemandsForConsumerCodes = this.demandRepository.getDemandsForConsumerCodes(new HashMap<>(),
                "42");
        assertSame(objectList, actualDemandsForConsumerCodes);
        assertTrue(actualDemandsForConsumerCodes.isEmpty());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.demandQueryBuilder).getDemandQueryForConsumerCodes((java.util.Map<String, Set<String>>) any(),
                (List<Object>) any(), (String) any());
    }


    @Test
    void testSave() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.demandRepository.save(new DemandRequest());
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }



    @Test
    void testSave3() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any()))
                .thenThrow(new EmptyResultDataAccessException(3));
        assertThrows(EmptyResultDataAccessException.class, () -> this.demandRepository.save(new DemandRequest()));
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }




    @Test
    void testUpdate4() throws DataAccessException {
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn("Query");
        when(this.demandQueryBuilder.getDemandQuery((DemandCriteria) any(), (List<Object>) any()))
                .thenThrow(new EmptyResultDataAccessException(3));

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        DemandRequest demandRequest = mock(DemandRequest.class);
        when(demandRequest.getDemands()).thenReturn(demandList);
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.demandRepository.update(demandRequest, new PaymentBackUpdateAudit()));
        verify(this.demandQueryBuilder).getDemandQuery((DemandCriteria) any(), (List<Object>) any());
        verify(demandRequest).getDemands();
    }


    @Test
    void testUpdate5() throws DataAccessException {
        when(this.jdbcTemplate.update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any()))
                .thenReturn(1);
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(new ArrayList<>());
        when(this.demandQueryBuilder.getDemandQuery((DemandCriteria) any(), (List<Object>) any()))
                .thenReturn("Demand Query");

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        DemandRequest demandRequest = mock(DemandRequest.class);
        when(demandRequest.getDemands()).thenReturn(demandList);
        this.demandRepository.update(demandRequest, new PaymentBackUpdateAudit());
        verify(this.jdbcTemplate).update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any());
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.demandQueryBuilder).getDemandQuery((DemandCriteria) any(), (List<Object>) any());
        verify(demandRequest).getDemands();
    }



    @Test
    void testUpdate7() throws DataAccessException {
        when(this.jdbcTemplate.update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any()))
                .thenReturn(1);
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(new ArrayList<>());
        when(this.demandQueryBuilder.getDemandQuery((DemandCriteria) any(), (List<Object>) any()))
                .thenReturn("Demand Query");

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        DemandRequest demandRequest = mock(DemandRequest.class);
        when(demandRequest.getDemands()).thenReturn(demandList);
        this.demandRepository.update(demandRequest, new PaymentBackUpdateAudit());
        verify(this.jdbcTemplate).update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any());
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.demandQueryBuilder).getDemandQuery((DemandCriteria) any(), (List<Object>) any());
        verify(demandRequest).getDemands();
    }


    @Test
    void testUpdate8() throws DataAccessException {
        when(this.jdbcTemplate.update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any()))
                .thenReturn(1);
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(new ArrayList<>());
        when(this.demandQueryBuilder.getDemandQuery((DemandCriteria) any(), (List<Object>) any()))
                .thenReturn("Demand Query");

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        DemandRequest demandRequest = mock(DemandRequest.class);
        when(demandRequest.getDemands()).thenReturn(demandList);
        this.demandRepository.update(demandRequest, null);
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.demandQueryBuilder).getDemandQuery((DemandCriteria) any(), (List<Object>) any());
        verify(demandRequest).getDemands();
    }

    @Test
    void testInsertBatch() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<Demand> newDemands = new ArrayList<>();
        this.demandRepository.insertBatch(newDemands, new ArrayList<>());
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testInsertBatch2() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any()))
                .thenThrow(new EmptyResultDataAccessException(3));
        ArrayList<Demand> newDemands = new ArrayList<>();
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.demandRepository.insertBatch(newDemands, new ArrayList<>()));
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testUpdateBatch() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<Demand> oldDemands = new ArrayList<>();
        this.demandRepository.updateBatch(oldDemands, new ArrayList<>());
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testUpdateBatch2() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any()))
                .thenThrow(new EmptyResultDataAccessException(3));
        ArrayList<Demand> oldDemands = new ArrayList<>();
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.demandRepository.updateBatch(oldDemands, new ArrayList<>()));
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testInsertBatchForAudit() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<Demand> demands = new ArrayList<>();
        this.demandRepository.insertBatchForAudit(demands, new ArrayList<>());
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testInsertBatchForAudit2() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any()))
                .thenThrow(new EmptyResultDataAccessException(3));
        ArrayList<Demand> demands = new ArrayList<>();
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.demandRepository.insertBatchForAudit(demands, new ArrayList<>()));
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testInsertBackUpdateForPayment() throws DataAccessException {
        when(this.jdbcTemplate.update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any()))
                .thenReturn(1);
        this.demandRepository.insertBackUpdateForPayment(new PaymentBackUpdateAudit());
        verify(this.jdbcTemplate).update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any());
    }


    @Test
    void testInsertBackUpdateForPayment2() throws DataAccessException {
        when(this.jdbcTemplate.update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any()))
                .thenThrow(new EmptyResultDataAccessException(3));
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.demandRepository.insertBackUpdateForPayment(new PaymentBackUpdateAudit()));
        verify(this.jdbcTemplate).update((String) any(), (org.springframework.jdbc.core.PreparedStatementSetter) any());
    }

    @Test
    void testSearchPaymentBackUpdateAudit() throws DataAccessException {
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<String>) any()))
                .thenReturn("Query For Object");
        assertEquals("Query For Object", this.demandRepository.searchPaymentBackUpdateAudit(new PaymentBackUpdateAudit()));
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<String>) any());
    }


}

