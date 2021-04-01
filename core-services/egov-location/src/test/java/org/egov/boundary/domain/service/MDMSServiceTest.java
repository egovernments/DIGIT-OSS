package org.egov.boundary.domain.service;

import org.egov.boundary.persistence.repository.MdmsRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class MDMSServiceTest {

    @Mock
    private MdmsRepository mdmsRepository;

    private MdmsService mdmsService;

    @Before
    public void setup() {
        this.mdmsService = new MdmsService(mdmsRepository);
    }

    //TODO Test cases for service, repository
    @Test
    public void testFetchGeography() {


    }

}
