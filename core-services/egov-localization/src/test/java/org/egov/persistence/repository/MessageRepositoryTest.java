package org.egov.persistence.repository;

import org.egov.domain.model.AuthenticatedUser;
import org.egov.domain.model.MessageIdentity;
import org.egov.domain.model.Tenant;
import org.egov.persistence.entity.Message;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Matchers.anyListOf;
import static org.mockito.Mockito.verify;


@RunWith(MockitoJUnitRunner.class)
public class MessageRepositoryTest {

    private static final String TENANT_ID = "tenant_123";
    private static final String MR_IN = "MR_IN";

    @Mock
    private MessageJpaRepository messageJpaRepository;
    
    @InjectMocks
    private MessageRepository messageRepository;
    
    @Test
    public void test_should_save_messages() {
        List<org.egov.domain.model.Message> domainMessages = getDomainMessages();
        final AuthenticatedUser user = new AuthenticatedUser(1L);

        messageRepository.save(domainMessages, user);

        verify(messageJpaRepository).saveAll(anyListOf(Message.class));
    }

    List<org.egov.domain.model.Message> getDomainMessages() {
        final MessageIdentity messageIdentity1 = MessageIdentity.builder()
            .code("core.msg.OTPvalidated")
            .module("module1")
            .locale(MR_IN)
            .tenant(new Tenant(TENANT_ID))
            .build();
        org.egov.domain.model.Message message1 = org.egov.domain.model.Message.builder()
            .message("OTP यशस्वीपणे प्रमाणित")
            .messageIdentity(messageIdentity1)
            .build();
        final MessageIdentity messageIdentity2 = MessageIdentity.builder()
            .code("core.lbl.imageupload")
            .locale(MR_IN)
            .tenant(new Tenant(TENANT_ID))
            .build();
        org.egov.domain.model.Message message2 = org.egov.domain.model.Message.builder()
            .message("प्रतिमा यशस्वीरित्या अपलोड")
            .messageIdentity(messageIdentity2)
            .build();
        return Arrays.asList(message1, message2);
    }
    
    private List<org.egov.web.contract.Message> getMyMessages(){
    	org.egov.web.contract.Message msg1 = org.egov.web.contract.Message.builder()
    			.code("codeOne")
    			.message("messageOne")
    			.module("moduleOne")
//    			.tenantId("tenantOne")
    			.build();
    	org.egov.web.contract.Message msg2 = org.egov.web.contract.Message.builder()
    			.code("codeTwo")
    			.message("messageTwo")
    			.module("moduleTwo")
//    			.tenantId("tenantTwo")
    			.build();
    	return (Arrays.asList(msg1,msg2));
    }

}