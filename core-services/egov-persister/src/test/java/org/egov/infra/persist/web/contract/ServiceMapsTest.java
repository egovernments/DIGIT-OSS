package org.egov.infra.persist.web.contract;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

class ServiceMapsTest {

    @Test
    void testConstructor() {
        ServiceMaps actualServiceMaps = new ServiceMaps();
        ArrayList<Mapping> mappingList = new ArrayList<>();
        actualServiceMaps.setMappings(mappingList);
        actualServiceMaps.setServiceName("Service Name");
        assertSame(mappingList, actualServiceMaps.getMappings());
        assertEquals("Service Name", actualServiceMaps.getServiceName());
    }
}

