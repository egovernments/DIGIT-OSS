package org.egov.auditservice.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {ChooseSignerAndVerifier.class})
@ExtendWith(SpringExtension.class)
class ChooseSignerAndVerifierTest {
    @MockBean
    private AuditServiceRepository auditServiceRepository;

    @Autowired
    private ChooseSignerAndVerifier chooseSignerAndVerifier;

    @MockBean
    private ConfigurableSignAndVerify configurableSignAndVerify;

    @Autowired
    private List<ConfigurableSignAndVerify> list;


    //@Test
    void testSelectImplementationAndSign() {
        assertThrows(CustomException.class,
                () -> chooseSignerAndVerifier.selectImplementationAndSign(new AuditLogRequest()));
    }


}

