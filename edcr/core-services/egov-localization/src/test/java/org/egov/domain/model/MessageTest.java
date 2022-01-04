package org.egov.domain.model;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class MessageTest {
    @Test
    public void test_equality_should_be_true_when_both_instances_of_message_have_same_field_values() {
        final MessageIdentity messageIdentity1 = MessageIdentity.builder()
            .tenant(new Tenant("tenant"))
            .locale("locale")
            .module("module")
            .code("code")
            .build();
        final Message message1 = Message.builder()
            .message("message")
            .messageIdentity(messageIdentity1)
            .build();

        final MessageIdentity messageIdentity2 = MessageIdentity.builder()
            .tenant(new Tenant("tenant"))
            .locale("locale")
            .module("module")
            .code("code")
            .build();
        final Message message2 = Message.builder()
            .message("message")
            .messageIdentity(messageIdentity2)
            .build();

        assertEquals(message1, message2);
    }

    @Test
    public void test_should_return_true_when_given_tenant_is_more_specific_than_other_tenant() {
        final MessageIdentity messageIdentity1 = MessageIdentity.builder()
            .locale("en_IN")
            .module("module")
            .code("code1")
            .tenant(new Tenant("mh.panvel"))
            .build();
        final Message message1 = Message.builder()
            .message("mh.panvel message")
            .messageIdentity(messageIdentity1)
            .build();
        final MessageIdentity messageIdentity2 = MessageIdentity.builder()
            .locale("en_IN")
            .module("module")
            .code("code1")
            .tenant(new Tenant("mh"))
            .build();
        final Message message2 = Message.builder()
            .message("mh message")
            .messageIdentity(messageIdentity2)
            .build();
        assertTrue(message1.isMoreSpecificComparedTo(message2));
    }

    @Test
    public void test_should_return_false_when_given_tenant_is_less_specific_than_other_tenant() {
        final MessageIdentity messageIdentity1 = MessageIdentity.builder()
            .locale("en_IN")
            .module("module")
            .code("code1")
            .tenant(new Tenant("mh.panvel"))
            .build();
        final Message message1 = Message.builder()
            .message("mh.panvel message")
            .messageIdentity(messageIdentity1)
            .build();
        final MessageIdentity messageIdentity2 = MessageIdentity.builder()
            .locale("en_IN")
            .module("module")
            .code("code1")
            .tenant(new Tenant("mh"))
            .build();
        final Message message2 = Message.builder()
            .message("mh message")
            .messageIdentity(messageIdentity2)
            .build();
        assertFalse(message2.isMoreSpecificComparedTo(message1));
    }
}