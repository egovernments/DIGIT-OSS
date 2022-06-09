package org.egov.collection.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.v1.Receipt_v1;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.service.v1.CollectionService_v1;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;

import static org.mockito.Mockito.*;

class MigrationServiceTest {
    @MockBean
    private boolean aBoolean;

    @MockBean
    private CollectionProducer collectionProducer;

    @MockBean
    private CollectionService_v1 collectionService_v1;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private MigrationService migrationService;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @Test
    void testMigrateReceiptDefault() {

        ApplicationProperties properties = new ApplicationProperties();
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        MigrationService migrationService = mock(MigrationService.class);
        RequestInfo requestInfo = new RequestInfo();
        migrationService.migrateReceipt(requestInfo, new ArrayList<>());
        }


    @Test
    void testMigrateReceiptRequestInfoNull() {

        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        MigrationService migrationService = mock(MigrationService.class);
        RequestInfo requestInfo = null;
        migrationService.migrateReceipt(null, new ArrayList<>());
    }


    @Test
    void testMigrateReceipt3() {

        CollectionProducer collectionProducer = mock(CollectionProducer.class);
        doNothing().when(collectionProducer).producer((String) any(), (Object) any());
        MigrationService migrationService = new MigrationService(new ApplicationProperties(),
                mock(ServiceRequestRepository.class), collectionProducer);
        RequestInfo requestInfo = new RequestInfo();
        migrationService.migrateReceipt(requestInfo, new ArrayList<>());
        verify(collectionProducer).producer((String) any(), (Object) any());
    }

    @Test
    void testMigrateReceipt4() {

        CollectionProducer collectionProducer = mock(CollectionProducer.class);
        doNothing().when(collectionProducer).producer((String) any(), (Object) any());
        MigrationService migrationService =mock(MigrationService.class);
        RequestInfo requestInfo = new RequestInfo();

        ArrayList<Receipt_v1> receipt_v1List = new ArrayList<>();
        receipt_v1List.add(new Receipt_v1());
        migrationService.migrateReceipt(requestInfo, receipt_v1List);
    }

    @Test
    void testMigrateReceipt5() {

        CollectionProducer collectionProducer = mock(CollectionProducer.class);
        doNothing().when(collectionProducer).producer((String) any(), (Object) any());
        MigrationService migrationService = mock(MigrationService.class);
        RequestInfo requestInfo = new RequestInfo();

        ArrayList<Receipt_v1> receipt_v1List = new ArrayList<>();
        receipt_v1List.add(null);
        migrationService.migrateReceipt(requestInfo, receipt_v1List);
    }
}

