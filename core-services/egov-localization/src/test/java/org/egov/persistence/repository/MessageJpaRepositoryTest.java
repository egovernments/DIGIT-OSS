package org.egov.persistence.repository;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.egov.TestConfiguration;
import org.egov.persistence.entity.Message;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.StringUtils;

@RunWith(SpringRunner.class)
@DataJpaTest
@Import(TestConfiguration.class)
public class MessageJpaRepositoryTest {

    @Autowired
    private MessageJpaRepository messageJpaRepository;

    @Test
    @Ignore
    @Sql(scripts = {"/sql/clearMessages.sql", "/sql/createMessages.sql"})
    public void shouldFetchMessagesForGivenTenantAndLocale() {
        final List<Message> actualMessages = messageJpaRepository
            .find("tenant1", "en_US");

        assertEquals(2, actualMessages.size());
    }

    @Test
    @Ignore
    @Sql(scripts = {"/sql/clearMessages.sql", "/sql/createMessages.sql"})
    public void shouldSaveMessages() {
        final String locale = "newLocale";
        final String tenant = "newTenant";
        final Message message1 = Message.builder().tenantId(tenant)
            .code("code1")
            .locale(locale)
            .message("New message1")
            .module("module")
            .createdBy(1L)
            .createdDate(new Date())
            .build();
        final Message message2 = Message.builder()
            .tenantId(tenant)
            .code("code2")
            .locale(locale)
            .message("New message2")
            .module("module")
            .createdBy(1L)
            .createdDate(new Date())
            .build();

        messageJpaRepository.save(Arrays.asList(message1, message2));

        assertTrue("Id generated for message1", StringUtils.isEmpty(message1.getId()));
        assertTrue("Id generated for message2", StringUtils.isEmpty(message2.getId()));
        assertEquals(2, messageJpaRepository.find(tenant, locale).size());
    }
}
