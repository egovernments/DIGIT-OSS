package org.egov.infra.persist.service;

import com.github.zafarkhaja.semver.Version;
import com.jayway.jsonpath.PathNotFoundException;
import org.egov.infra.persist.repository.PersistRepository;
import org.egov.infra.persist.utils.Utils;
import org.egov.infra.persist.web.contract.TopicMap;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {PersistService.class})
@ExtendWith(SpringExtension.class)
class PersistServiceTest {
    @MockBean
    private PersistRepository persistRepository;

    @Autowired
    private PersistService persistService;

    @MockBean
    private TopicMap topicMap;

    @MockBean
    private Utils utils;

    @Test
    void testPersist() throws Exception  {
        when(this.utils.getSemVer((String) any())).thenReturn(Version.forIntegers(1));
        when(this.topicMap.getTopicMap()).thenReturn(new HashMap<>());
    }


    @Test
    void testPersistPathNotFound() {
        when(this.utils.getSemVer((String) any())).thenReturn(Version.forIntegers(1));
        when(this.topicMap.getTopicMap()).thenThrow(new PathNotFoundException("An error occurred"));
        assertThrows(PathNotFoundException.class, () -> this.persistService.persist("Topic", "Json"));
        verify(this.topicMap).getTopicMap();
    }

    @Test
    void testPersistWithTopicOnly() {
        when(this.topicMap.getTopicMap()).thenReturn(new HashMap<>());
        this.persistService.persist("Topic", new ArrayList<>());
        verify(this.topicMap).getTopicMap();
    }


    @Test
    void testPersistError() {
        when(this.utils.getSemVer((String) any())).thenThrow(new PathNotFoundException("An error occurred"));
        when(this.topicMap.getTopicMap()).thenReturn(new HashMap<>());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        assertThrows(PathNotFoundException.class, () -> this.persistService.persist("Topic", stringList));
        verify(this.utils).getSemVer((String) any());
        verify(this.topicMap).getTopicMap();
    }
}

