package org.egov.collection.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.v1.Receipt_v1;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.service.v1.CollectionService_v1;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
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

    /**
     * Method under test: {@link MigrationService#migrate(RequestInfo, Integer, Integer, String)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testMigrate() throws JsonProcessingException {
        // TODO: Complete this test.
        //   Reason: R026 Failed to create Spring context.
        //   Attempt to initialize test context failed with
        //   org.mockito.exceptions.base.MockitoException:
        //   Cannot mock/spy boolean
        //   Mockito cannot mock/spy because :
        //    - primitive type
        //       at org.springframework.boot.test.mock.mockito.MockDefinition.createMock(MockDefinition.java:154)
        //       at org.springframework.boot.test.mock.mockito.MockitoPostProcessor.registerMock(MockitoPostProcessor.java:183)
        //       at org.springframework.boot.test.mock.mockito.MockitoPostProcessor.register(MockitoPostProcessor.java:165)
        //       at org.springframework.boot.test.mock.mockito.MockitoPostProcessor.postProcessBeanFactory(MockitoPostProcessor.java:139)
        //       at org.springframework.boot.test.mock.mockito.MockitoPostProcessor.postProcessBeanFactory(MockitoPostProcessor.java:127)
        //       at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:286)
        //       at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:174)
        //       at org.springframework.context.support.AbstractApplicationContext.invokeBeanFactoryPostProcessors(AbstractApplicationContext.java:706)
        //       at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:532)
        //       at org.springframework.test.context.support.AbstractGenericContextLoader.loadContext(AbstractGenericContextLoader.java:128)
        //       at org.springframework.test.context.support.AbstractGenericContextLoader.loadContext(AbstractGenericContextLoader.java:60)
        //       at org.springframework.test.context.support.AbstractDelegatingSmartContextLoader.delegateLoading(AbstractDelegatingSmartContextLoader.java:275)
        //       at org.springframework.test.context.support.AbstractDelegatingSmartContextLoader.loadContext(AbstractDelegatingSmartContextLoader.java:243)
        //       at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:99)
        //       at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:124)
        //       at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:123)
        //   See https://diff.blue/R026 to resolve this issue.

        this.migrationService.migrate(new RequestInfo(), 2, 3, "42");
    }


    @Test
    void testMigrateReceiptDefault() {

        ApplicationProperties properties = new ApplicationProperties();
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        MigrationService migrationService = mock(MigrationService.class);
        RequestInfo requestInfo = new RequestInfo();
        migrationService.migrateReceipt(requestInfo, new ArrayList<>());
       // assertThrows(CustomException.class, () -> migrationService.migrateReceipt(requestInfo, new ArrayList<>()));
      //   when(this.migrationService.migrateReceipt(requestInfo, new ArrayList<>())).getMock(migrationService);
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

