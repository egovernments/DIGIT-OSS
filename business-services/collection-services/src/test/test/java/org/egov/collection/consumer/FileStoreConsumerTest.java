package org.egov.collection.consumer;

import java.util.HashMap;

import org.egov.collection.repository.PaymentRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {FileStoreConsumer.class})
@ExtendWith(SpringExtension.class)
class FileStoreConsumerTest {
    @Autowired
    private FileStoreConsumer fileStoreConsumer;

    @MockBean
    private PaymentRepository paymentRepository;

    /**
     * Method under test: {@link FileStoreConsumer#listen(HashMap, String)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testListen() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.collection.consumer.FileStoreConsumer.listen(FileStoreConsumer.java:36)
        //   In order to prevent listen(HashMap, String)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   listen(HashMap, String).
        //   See https://diff.blue/R013 to resolve this issue.

        this.fileStoreConsumer.listen(new HashMap<>(), "Topic");
    }
}

