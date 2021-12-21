package org.egov.tl.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.producer.Producer;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.util.NotificationUtil;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.*;
import org.egov.tl.workflow.WorkflowIntegrator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import com.jayway.jsonpath.JsonPath;

import java.util.*;

import static org.egov.tl.util.TLConstants.*;


@Slf4j
@Component
public class TLBatchService {



    private NotificationUtil util;

    private TLConfiguration config;

    private TLRepository repository;

    private EnrichmentService enrichmentService;

    private WorkflowIntegrator workflowIntegrator;

    private Producer producer;
    
    private TradeUtil tradeUtil;

    @Autowired
    public TLBatchService(NotificationUtil util, TLConfiguration config, TLRepository repository,
                          EnrichmentService enrichmentService, WorkflowIntegrator workflowIntegrator,
                          Producer producer, TradeUtil tradeUtil) {
        this.util = util;
        this.config = config;
        this.repository = repository;
        this.enrichmentService = enrichmentService;
        this.workflowIntegrator = workflowIntegrator;
        this.producer = producer;
        this.tradeUtil=tradeUtil;
    }







    /**
     * Searches trade licenses which are expiring and sends reminder sms to
     *  owner's of the licenses
     * @param serviceName
     * @param requestInfo
     */
    public void getLicensesAndPerformAction(String serviceName, String jobName, RequestInfo requestInfo){
    	
    	List <String> tenantIdsFromRepository = repository.fetchTradeLicenseTenantIds();

        List <String> workflowCodes = Arrays.asList(config.getTlBusinessServices().split("\\s*,\\s*"));

        tenantIdsFromRepository.forEach(tenantIdFromRepository->{

        	try {
        	
        	Long validTill = System.currentTimeMillis();

        	if(jobName.equalsIgnoreCase(JOB_SMS_REMINDER)) {
        		
        		Map<String,Long>tenantIdToReminderPeriod = tradeUtil.getTenantIdToReminderPeriod(requestInfo);
        		
        		if(tenantIdToReminderPeriod.containsKey(tenantIdFromRepository)) { 
        			validTill = validTill + tenantIdToReminderPeriod.get(tenantIdFromRepository);
        		}	
        		else {
        			validTill = validTill + config.getReminderPeriod();
        		}
        	}
        	 

        	TradeLicenseSearchCriteria criteria = TradeLicenseSearchCriteria.builder()
                .businessService(serviceName)
                .validTo(validTill)
                .status(Collections.singletonList(STATUS_APPROVED)).tenantId(tenantIdFromRepository)
                .limit(config.getPaginationSize())
                .build();

        	workflowCodes.forEach(workflowCode ->{

        		int offSet = 0;
        		criteria.setOffset(offSet);

        		while (true){

        				log.info("current Offset: "+offSet);

        				List<TradeLicense> licensesFromRepository = repository.getLicenses(criteria);
        				if(CollectionUtils.isEmpty(licensesFromRepository)) 
        					break;

        				List <TradeLicense> licensesWithWorkflowCode= new ArrayList<TradeLicense>();
            
        				licensesFromRepository.forEach(license->{
        						if (license.getWorkflowCode()!=null && license.getWorkflowCode().equalsIgnoreCase(workflowCode) ) {
        							licensesWithWorkflowCode.add(license);
        						}
            	
        				});
        				
        				if(!CollectionUtils.isEmpty(licensesWithWorkflowCode)) 
        				{
            
        				List<TradeLicense> licenses = enrichmentService.enrichTradeLicenseSearch(licensesWithWorkflowCode, criteria, requestInfo);

        				if(jobName.equalsIgnoreCase(JOB_SMS_REMINDER))
        				{
        				sendReminderSMS(requestInfo, licenses);
        				sendReminderEmail(requestInfo,licenses);
        				}

        				else if(jobName.equalsIgnoreCase(JOB_EXPIRY))
        					expireLicenses(requestInfo, licenses);
        				}

        				offSet = offSet + config.getPaginationSize();

        				criteria.setOffset(offSet);
        		}
        
        	});
        	
        	}
        	catch(Exception ex) {
        		log.error("The batch process could not be completed for the tenant id : "+tenantIdFromRepository);
        	}
        
        	});


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
            try{

                String message = util.getReminderMsg(license, localizationMessages);
                Map<String,String > mobileNumberToOwner = new HashMap<>();

                license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                    if(owner.getMobileNumber()!=null)
                        mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
                });
                smsRequests.addAll(util.createSMSRequest(message,mobileNumberToOwner));
            }
            catch (Exception e){
                producer.push(config.getReminderErrorTopic(), license);
            }
        }

        util.sendSMS(smsRequests, config.getIsReminderEnabled());

    }

    /**
     * Sends customized reminder sms to the owner's of the given licenses
     * @param licenses The licenses for which reminder has to be send
     */
    private void sendReminderEmail(RequestInfo requestInfo, List<TradeLicense> licenses){

        String tenantId = getStateLevelTenant(licenses.get(0).getTenantId());
        String localizationMessages = util.getLocalizationMessages(tenantId, requestInfo);
        List<EmailRequest> emailRequests = new LinkedList<>();
        for(TradeLicense license : licenses){
            try{

                String message = util.getReminderMsg(license, localizationMessages);
                Map<String,String > mobileNumberToEmails = new HashMap<>();
                Set<String> mobileNumbers = new HashSet<>();

                license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                    if(owner.getMobileNumber()!=null)
                        mobileNumbers.add(owner.getMobileNumber());
                });

                mobileNumberToEmails = util.fetchUserEmailIds(mobileNumbers,requestInfo,tenantId);
                emailRequests.addAll(util.createEmailRequest(requestInfo,message,mobileNumberToEmails));

            }
            catch (Exception e){
                producer.push(config.getReminderErrorTopic(), license);
            }
        }

        util.sendEmail(emailRequests, config.getIsReminderEnabled());

    }

    /**
     * Calls workflow with action expire on the given license
     * @param requestInfo
     * @param licenses Licenses to be expired
     */
    private void expireLicenses(RequestInfo requestInfo, List<TradeLicense> licenses){

        try {
            licenses.forEach(license -> {
                license.setAction(ACTION_EXPIRE);
                if(StringUtils.isEmpty(license.getWorkflowCode()))
                    license.setWorkflowCode(DEFAULT_WORKFLOW);
            });

            workflowIntegrator.callWorkFlow(new TradeLicenseRequest(requestInfo, licenses));

            producer.push(config.getUpdateWorkflowTopic(), new TradeLicenseRequest(requestInfo, licenses));
        }
        catch (Exception e){
            producer.push(config.getExpiryErrorTopic(), licenses);
        }



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
