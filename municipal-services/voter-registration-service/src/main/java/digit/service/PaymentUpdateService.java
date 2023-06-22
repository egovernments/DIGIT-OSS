package digit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import digit.repository.VoterRegistrationRepository;
import digit.web.models.*;
import digit.web.models.coremodels.*;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
public class PaymentUpdateService {

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private VoterRegistrationRepository repository;

    public void process(HashMap<String, Object> record) {

        try {

            PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
            RequestInfo requestInfo = paymentRequest.getRequestInfo();

            List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
            String tenantId = paymentRequest.getPayment().getTenantId();

            for (PaymentDetail paymentDetail : paymentDetails) {
                updateWorkflowForVoterRegistrationPayment(requestInfo, tenantId, paymentDetail);
            }
        } catch (Exception e) {
            log.error("KAFKA_PROCESS_ERROR:", e);
        }

    }

    private void updateWorkflowForVoterRegistrationPayment(RequestInfo requestInfo, String tenantId, PaymentDetail paymentDetail) {

        Bill bill  = paymentDetail.getBill();

        VoterApplicationSearchCriteria criteria = VoterApplicationSearchCriteria.builder()
                .applicationNumber(bill.getConsumerCode())
                .tenantId(tenantId)
                .build();

        List<VoterRegistrationApplication> voterRegistrationApplicationList = repository.getApplications(criteria);

        if (CollectionUtils.isEmpty(voterRegistrationApplicationList))
            throw new CustomException("INVALID RECEIPT",
                    "No applications found for the consumerCode " + criteria.getApplicationNumber());

        Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(tenantId).build();
        requestInfo.getUserInfo().getRoles().add(role);

        voterRegistrationApplicationList.forEach( application -> {

            VoterRegistrationRequest updateRequest = VoterRegistrationRequest.builder().requestInfo(requestInfo)
                    .voterRegistrationApplications(Collections.singletonList(application)).build();

            ProcessInstanceRequest wfRequest = workflowService.getProcessInstanceForVoterRegistrationPayment(updateRequest);

            State state = workflowService.callWorkFlow(wfRequest);

        });
    }

}
