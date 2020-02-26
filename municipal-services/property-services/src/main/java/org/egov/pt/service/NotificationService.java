package org.egov.pt.service;

import static org.egov.pt.util.PTConstants.ACTION_PAY;
import static org.egov.pt.util.PTConstants.CREATED_STRING;
import static org.egov.pt.util.PTConstants.CREATE_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.CREATE_STRING;
import static org.egov.pt.util.PTConstants.MT_NO_WORKFLOW;
import static org.egov.pt.util.PTConstants.NOTIFICATION_AMOUNT;
import static org.egov.pt.util.PTConstants.NOTIFICATION_APPID;
import static org.egov.pt.util.PTConstants.NOTIFICATION_CONSUMERCODE;
import static org.egov.pt.util.PTConstants.NOTIFICATION_MUTATION_LINK;
import static org.egov.pt.util.PTConstants.NOTIFICATION_PAY_LINK;
import static org.egov.pt.util.PTConstants.NOTIFICATION_PROPERTYID;
import static org.egov.pt.util.PTConstants.NOTIFICATION_PROPERTY_LINK;
import static org.egov.pt.util.PTConstants.NOTIFICATION_STATUS;
import static org.egov.pt.util.PTConstants.NOTIFICATION_TENANTID;
import static org.egov.pt.util.PTConstants.NOTIFICATION_UPDATED_CREATED_REPLACE;
import static org.egov.pt.util.PTConstants.UPDATED_STRING;
import static org.egov.pt.util.PTConstants.UPDATE_NO_WORKFLOW;
import static org.egov.pt.util.PTConstants.UPDATE_STRING;
import static org.egov.pt.util.PTConstants.WF_MT_STATUS_APPROVED_CODE;
import static org.egov.pt.util.PTConstants.WF_MT_STATUS_CHANGE_CODE;
import static org.egov.pt.util.PTConstants.WF_MT_STATUS_OPEN_CODE;
import static org.egov.pt.util.PTConstants.WF_MT_STATUS_PAID_CODE;
import static org.egov.pt.util.PTConstants.WF_MT_STATUS_PAYMENT_PENDING_CODE;
import static org.egov.pt.util.PTConstants.WF_NO_WORKFLOW;
import static org.egov.pt.util.PTConstants.WF_STATUS_APPROVED;
import static org.egov.pt.util.PTConstants.WF_STATUS_DOCVERIFIED;
import static org.egov.pt.util.PTConstants.WF_STATUS_DOCVERIFIED_LOCALE;
import static org.egov.pt.util.PTConstants.WF_STATUS_FIELDVERIFIED;
import static org.egov.pt.util.PTConstants.WF_STATUS_FIELDVERIFIED_LOCALE;
import static org.egov.pt.util.PTConstants.WF_STATUS_OPEN;
import static org.egov.pt.util.PTConstants.WF_STATUS_OPEN_LOCALE;
import static org.egov.pt.util.PTConstants.WF_STATUS_PAID;
import static org.egov.pt.util.PTConstants.WF_STATUS_PAYMENT_PENDING;
import static org.egov.pt.util.PTConstants.WF_STATUS_REJECTED;
import static org.egov.pt.util.PTConstants.WF_STATUS_REJECTED_LOCALE;
import static org.egov.pt.util.PTConstants.WF_UPDATE_STATUS_APPROVED_CODE;
import static org.egov.pt.util.PTConstants.WF_UPDATE_STATUS_CHANGE_CODE;
import static org.egov.pt.util.PTConstants.WF_UPDATE_STATUS_OPEN_CODE;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.event.Event;
import org.egov.pt.models.event.EventRequest;
import org.egov.pt.models.workflow.Action;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.util.NotificationUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.pt.web.contracts.SMSRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class NotificationService {

	@Autowired
	private NotificationUtil notifUtil;

	@Autowired
	private PropertyConfiguration configs;

	@Value("${notification.url}")
	private String notificationURL;

	public void sendNotificationForMutation(PropertyRequest propertyRequest) {

		String msg = null;
		String state = null;
		Property property = propertyRequest.getProperty();
		ProcessInstance wf = property.getWorkflow();
		String completeMsgs = notifUtil.getLocalizationMessages(property.getTenantId(), propertyRequest.getRequestInfo());
		state = getStateFromWf(wf, configs.getIsMutationWorkflowEnabled());
		String localisedState = getLocalisedState(wf.getState().getState(), completeMsgs);

		switch (state) {

		case WF_NO_WORKFLOW:
			msg = getMsgForMutation(property, completeMsgs, MT_NO_WORKFLOW, NOTIFICATION_MUTATION_LINK);
			break;
			
		case WF_STATUS_OPEN:
			msg = getMsgForMutation(property, completeMsgs, WF_MT_STATUS_OPEN_CODE, NOTIFICATION_MUTATION_LINK);
			break;

		case WF_STATUS_APPROVED:
			msg = getMsgForMutation(property, completeMsgs, WF_MT_STATUS_APPROVED_CODE, NOTIFICATION_MUTATION_LINK);
			break;

		case WF_STATUS_PAYMENT_PENDING:
			msg = getMsgForMutation(property, completeMsgs, WF_MT_STATUS_PAYMENT_PENDING_CODE, NOTIFICATION_PAY_LINK);
			break;

		default:
			msg = getMsgForMutation(property, completeMsgs, WF_MT_STATUS_CHANGE_CODE, NOTIFICATION_MUTATION_LINK);
			
			break;
			
		case WF_STATUS_PAID:
			break;
		}

		// Ignoring paid status, since it's wired from payment consumer directly
		if (msg != null) {
			msg = replaceCommonValues(property, msg, localisedState);
			prepareMsgAndSend(propertyRequest, msg);
		}
	}


	public void sendNotificationForMtPayment(PropertyRequest propertyRequest, BigDecimal Amount) {

		Property property = propertyRequest.getProperty();
		String CompleteMsgs = notifUtil.getLocalizationMessages(property.getTenantId(), propertyRequest.getRequestInfo());
		
			String msg = getMsgForMutation(property, CompleteMsgs, WF_MT_STATUS_PAID_CODE, NOTIFICATION_MUTATION_LINK)
						.replace(NOTIFICATION_AMOUNT, Amount.toPlainString());
			msg = replaceCommonValues(property, msg, "");		
			prepareMsgAndSend(propertyRequest, msg);
	}
	
	public void sendNotificationForUpdate(PropertyRequest propertyRequest) {

		Property property = propertyRequest.getProperty();
		ProcessInstance wf = property.getWorkflow();
		String createOrUpdate = null;
		String msg = null;
		
		Boolean isCreate =  CREATE_PROCESS_CONSTANT.equalsIgnoreCase(wf.getNotificationAction());
		String state = getStateFromWf(wf, configs.getIsWorkflowEnabled());
		String completeMsgs = notifUtil.getLocalizationMessages(property.getTenantId(), propertyRequest.getRequestInfo());
		String localisedState = getLocalisedState(wf.getState().getState(), completeMsgs);
		switch (state) {

		case WF_NO_WORKFLOW:
			createOrUpdate = isCreate ? CREATED_STRING : UPDATED_STRING;
			msg = getMsgForUpdate(property, UPDATE_NO_WORKFLOW, completeMsgs, createOrUpdate);
			break;

		case WF_STATUS_OPEN:
			createOrUpdate = isCreate ? CREATE_STRING : UPDATE_STRING;
			msg = getMsgForUpdate(property, WF_UPDATE_STATUS_OPEN_CODE, completeMsgs, createOrUpdate);
			break;

		case WF_STATUS_APPROVED:
			createOrUpdate = isCreate ? CREATED_STRING : UPDATED_STRING;
			msg = getMsgForUpdate(property, WF_UPDATE_STATUS_APPROVED_CODE, completeMsgs, createOrUpdate);
			break;

		default:
			createOrUpdate = isCreate ? CREATE_STRING : UPDATE_STRING;
			msg = getMsgForUpdate(property, WF_UPDATE_STATUS_CHANGE_CODE, completeMsgs, createOrUpdate);
			break;
		}

		
		msg = replaceCommonValues(property, msg, localisedState);
		prepareMsgAndSend(propertyRequest, msg);
	}


	/**
	 * Method to prepare msg for create/update process
	 * 
	 * @param property
	 * @param msgCode
	 * @param completeMsgs
	 * @param createUpdateReplaceString
	 * @return
	 */
	private String getMsgForUpdate(Property property, String msgCode, String completeMsgs, String createUpdateReplaceString) {
		
		String url = notifUtil.getShortenedUrl(
					   configs.getUiAppHost().concat(configs.getViewPropertyLink()
					  .replace(NOTIFICATION_PROPERTYID, property.getPropertyId())
					  .replace(NOTIFICATION_TENANTID, property.getTenantId())));
		
		return notifUtil.getMessageTemplate(msgCode, completeMsgs)
				.replace(NOTIFICATION_PROPERTY_LINK, url)
				.replace(NOTIFICATION_UPDATED_CREATED_REPLACE, createUpdateReplaceString);
	}
	
	

	/**
	 * private method to prepare mutation msg for localization
	 * 
	 * @param property
	 * @param CompleteMsgs
	 * @param statusCode
	 * @param urlCode
	 * @return
	 */
	private String getMsgForMutation (Property property, String CompleteMsgs, String statusCode, String urlCode) {

		String url = statusCode.equalsIgnoreCase(WF_STATUS_PAYMENT_PENDING) ? getPayUrl(property) : getMutationUrl(property);
		return notifUtil.getMessageTemplate(statusCode, CompleteMsgs).replace(urlCode, url);
	}

	/**
	 * Prepares and return url for mutation view screen
	 * 
	 * @param property
	 * @return
	 */
	private String getMutationUrl(Property property) {
		
		return notifUtil.getShortenedUrl(
				 configs.getUiAppHost().concat(configs.getViewMutationLink()
				.replace(NOTIFICATION_APPID, property.getAcknowldgementNumber())
				.replace(NOTIFICATION_TENANTID, property.getTenantId())));
	}
	
	/**
	 * Prepares and return url for property view screen
	 * 
	 * @param property
	 * @return
	 */
	private String getPayUrl(Property property) {
		
		return notifUtil.getShortenedUrl( 
				 configs.getUiAppHost().concat(configs.getPayLink()
				.replace(NOTIFICATION_CONSUMERCODE, property.getAcknowldgementNumber())
				.replace(NOTIFICATION_TENANTID, property.getTenantId())));
	}


	/**
	 * replaces common variable for all messages
	 * 
	 * @param property
	 * @param msg
	 * @return
	 */
	private String replaceCommonValues(Property property, String msg, String localisedState) {

		msg = msg.replace(NOTIFICATION_PROPERTYID, property.getPropertyId()).replace(NOTIFICATION_APPID,
				property.getAcknowldgementNumber());

		if (configs.getIsWorkflowEnabled())
			msg = msg.replace(NOTIFICATION_STATUS, localisedState);
		return msg;
	}
	
	private String getLocalisedState(String state, String completeMsgs) {
		
		switch (state) {
			
		case WF_STATUS_REJECTED :
			return notifUtil.getMessageTemplate(WF_STATUS_REJECTED_LOCALE, completeMsgs);
			
		case WF_STATUS_DOCVERIFIED :
			return notifUtil.getMessageTemplate(WF_STATUS_DOCVERIFIED_LOCALE, completeMsgs);
			
		case WF_STATUS_FIELDVERIFIED:
			return notifUtil.getMessageTemplate(WF_STATUS_FIELDVERIFIED_LOCALE, completeMsgs);
			
		case WF_STATUS_OPEN:
			return notifUtil.getMessageTemplate(WF_STATUS_OPEN_LOCALE, completeMsgs);
		}
		return state;
	}


	/**
	 * Method to extract state from the workflow object
	 * 
	 * @param wf
	 * @return
	 */
	private String getStateFromWf(ProcessInstance wf, Boolean isWorkflowEnabled) {
		
		String state;
		if (isWorkflowEnabled) {

			Boolean isPropertyActive = wf.getState().getApplicationStatus().equalsIgnoreCase(Status.ACTIVE.toString());
			Boolean isTerminateState = wf.getState().getIsTerminateState();
			Set<String> actions = null != wf.getState().getActions()
					? actions = wf.getState().getActions().stream().map(Action::getAction).collect(Collectors.toSet())
					: Collections.emptySet();

			if (isTerminateState && CollectionUtils.isEmpty(actions)) {

				state = isPropertyActive ? WF_STATUS_APPROVED : WF_STATUS_REJECTED;
			} else if (actions.contains(ACTION_PAY)) {

				state = WF_STATUS_PAYMENT_PENDING;
			} else {

				state = wf.getState().getState();
			}

		} else {
			state = WF_NO_WORKFLOW;
		}
		return state;
	}

	/**
	 * Prepares msg for each owner and send 
	 * 
	 * @param property
	 * @param msg
	 */
	private void prepareMsgAndSend(PropertyRequest request, String msg) {

		Property property = request.getProperty();
		RequestInfo requestInfo = request.getRequestInfo();
		Map<String, String> mobileNumberToOwner = new HashMap<>();

		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumberToOwner.put(owner.getMobileNumber(), owner.getName());
		});

		List<SMSRequest> smsRequests = notifUtil.createSMSRequest(msg, mobileNumberToOwner);
		notifUtil.sendSMS(smsRequests);

		List<Event> events = notifUtil.enrichEvent(smsRequests, requestInfo, property.getTenantId());
		notifUtil.sendEventNotification(new EventRequest(requestInfo, events));
	}
}