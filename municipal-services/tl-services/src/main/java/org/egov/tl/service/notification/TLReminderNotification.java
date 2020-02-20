package org.egov.tl.service.notification;


import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.service.EnrichmentService;
import org.egov.tl.util.NotificationUtil;
import org.egov.tl.web.models.SMSRequest;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.TradeLicenseSearchCriteria;
import org.egov.tl.workflow.WorkflowIntegrator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;

import static org.egov.tl.util.TLConstants.*;

@Component
@Slf4j
public class TLReminderNotification {



    private NotificationUtil util;

    private TLConfiguration config;

    private TLRepository repository;

    private EnrichmentService enrichmentService;

    private WorkflowIntegrator workflowIntegrator;


    @Autowired
    public TLReminderNotification(NotificationUtil util, TLConfiguration config, TLRepository repository,
                                  EnrichmentService enrichmentService, WorkflowIntegrator workflowIntegrator) {
        this.util = util;
        this.config = config;
        this.repository = repository;
        this.enrichmentService = enrichmentService;
        this.workflowIntegrator = workflowIntegrator;
    }



    /**
     * Searches trade licenses which are expiring and sends reminder sms to
     *  owner's of the licenses
     * @param serviceName
     * @param validTill
     * @param requestInfo
     */
    public void getLicensesAndPerformAction(String serviceName, String jobName, Long validTill, RequestInfo requestInfo){

        TradeLicenseSearchCriteria criteria = TradeLicenseSearchCriteria.builder()
                                        .businessService(serviceName)
                                        .validTo(validTill)
                                        .status(STATUS_APPROVED)
                                        .limit(config.getPaginationSize())
                                        .build();

        int offSet = 0;

        while (true){

            log.info("current Offset: "+offSet);

            List<TradeLicense> licenses = repository.getLicenses(criteria);
            if(CollectionUtils.isEmpty(licenses))
                break;

            licenses = enrichmentService.enrichTradeLicenseSearch(licenses, criteria, requestInfo);

            if(jobName.equalsIgnoreCase(JOB_SMS_REMINDER))
                sendReminderSMS(requestInfo, licenses);

            else if(jobName.equalsIgnoreCase(JOB_EXPIRY))
                expireLicenses(requestInfo, licenses);

            offSet = offSet + config.getPaginationSize();

            criteria.setOffset(offSet);
        }


    }


    /**
     * Sends customized reminder sms to the owner's of the given licenses
     * @param licenses The licenses for which reminder has to be send
     */
    private void sendReminderSMS(RequestInfo requestInfo, List<TradeLicense> licenses){

        String tenantId = getStateLevelTenant(licenses.get(0).getTenantId());

        String localizationMessages = util.getLocalizationMessages(tenantId, requestInfo);

        List<SMSRequest> smsRequests = new LinkedList<>();

        for(TradeLicense license : licenses){

           String message = util.getReminderMsg(license, localizationMessages);
           Map<String,String > mobileNumberToOwner = new HashMap<>();

            license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                if(owner.getMobileNumber()!=null)
                    mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
            });
            smsRequests.addAll(util.createSMSRequest(message,mobileNumberToOwner));
        }

        util.sendSMS(smsRequests, config.getIsReminderEnabled());

    }


    /**
     * Calls workflow with action expire on the given license
     * @param requestInfo
     * @param licenses Licenses to be expired
     */
    private void expireLicenses(RequestInfo requestInfo, List<TradeLicense> licenses){

         licenses.forEach(license -> {
             license.setAction(ACTION_EXPIRE);
         });

        workflowIntegrator.callWorkFlow(new TradeLicenseRequest(requestInfo, licenses));

    }



    /**
     * Returns state level tenant
     * @param tenantId
     * @return
     */
    private String getStateLevelTenant(String tenantId){
        return tenantId.split("\\.")[0];
    }


}
