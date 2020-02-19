package org.egov.pt.service;

import static org.egov.pt.util.PTConstants.WF_APPROVED_STATUS;
import static org.egov.pt.util.PTConstants.WF_CANCELLED_STATUS;
import static org.egov.pt.util.PTConstants.WF_OPEN_STATUS;
import static org.egov.pt.util.PTConstants.WF_PAID_STATUS;
import static org.egov.pt.util.PTConstants.WF_PAYMENT_PENDING_STATUS;
import static org.egov.pt.util.PTConstants.WF_REJECTED_STATUS;

import java.math.BigDecimal;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.PropertyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private Producer producer;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PropertyConfiguration propertyConfiguration;

    @Autowired
    private PropertyUtil util;

    @Value("${notification.url}")
    private String notificationURL;
    
    public void sendNotification(Property property) {
    	
    	
    	String state = property.getWorkflow().getState() != null ? property.getWorkflow().getState().getState() : "NO_WORKFLOW"; 
    	
    	
    	String msg  = null;
    	
    	switch (state) {
    	
		case "NO_WORFLOW" :
			
			msg = null;
			
			break;	
    	
		case WF_OPEN_STATUS :
			
			msg = null;
			
			break;	
			
		case WF_APPROVED_STATUS :
			
			break;
			
		case WF_REJECTED_STATUS :
			
			break;
			
		case WF_CANCELLED_STATUS :
			
			break;
			
		case WF_PAYMENT_PENDING_STATUS :
			
			break;
			
		default:
			break;
		}
    }
    
    public void sendNotification(Property property, BigDecimal Amount) {
    	
    	
    	String state = property.getWorkflow().getState().getState();
    	
    	if(state.equalsIgnoreCase(WF_PAID_STATUS)) {
    		
    		String msg = "paid msg";
    		
    	}
    }
      
}