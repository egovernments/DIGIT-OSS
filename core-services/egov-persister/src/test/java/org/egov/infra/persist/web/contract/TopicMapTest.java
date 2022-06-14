package org.egov.infra.persist.web.contract;

import static org.junit.jupiter.api.Assertions.assertSame;

import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Test;

class TopicMapTest {

    @Test
    void testConstructor() {
        TopicMap actualTopicMap = new TopicMap();
        HashMap<String, List<Mapping>> stringListMap = new HashMap<>();
        actualTopicMap.setTopicMap(stringListMap);
        assertSame(stringListMap, actualTopicMap.getTopicMap());
    }
}

