package org.egov;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.junit.Test;

import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ObjectMapperTest {

    @Test
    public void test_should_convert_class_instance_to_map() {
        final Foo foo = new Foo("value1", new SubFoo("value2"));
        final HashMap hashMap = new ObjectMapper().convertValue(foo, HashMap.class);

        assertNotNull(hashMap);
        assertEquals("value1", hashMap.get("bar1"));
        @SuppressWarnings("unchecked")
        final HashMap<String, Object> subFoo =
            (HashMap<String, Object>)hashMap.get("subFoo");
        assertNotNull(subFoo);
        assertEquals("value2", subFoo.get("bar2"));
    }

    @Test
    public void test_should_convert_map_to_map() {
        final HashMap<String, Object> foo = new HashMap<>();
        foo.put("bar1", "value1");
        final HashMap<String, Object> subFoo = new HashMap<>();
        subFoo.put("bar2", "value2");
        foo.put("subFoo", subFoo);
        final HashMap hashMap = new ObjectMapper().convertValue(foo, HashMap.class);

        assertNotNull(hashMap);
        assertEquals("value1", hashMap.get("bar1"));
        @SuppressWarnings("unchecked")
        final HashMap<String, Object> subFooMap =
            (HashMap<String, Object>)hashMap.get("subFoo");
        assertNotNull(subFooMap);
        assertEquals("value2", subFooMap.get("bar2"));
    }

    @Getter
    @AllArgsConstructor
    private class Foo {
        private String bar1;
        private SubFoo subFoo;
    }

    @Getter
    @AllArgsConstructor
    private class SubFoo {
        private String bar2;
    }
}

