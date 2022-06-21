package org.egov.infra.persist.consumer;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;

class PersisterBatchConsumerConfigTest {


    @Test
    void testStartContainer() {

        assertFalse((new PersisterBatchConsumerConfig()).startContainer());
    }

    @Test
    void testPauseContainer() {

        assertFalse((new PersisterBatchConsumerConfig()).pauseContainer());
    }


    @Test
    void testResumeContainer() {

        assertFalse((new PersisterBatchConsumerConfig()).resumeContainer());
    }
}

