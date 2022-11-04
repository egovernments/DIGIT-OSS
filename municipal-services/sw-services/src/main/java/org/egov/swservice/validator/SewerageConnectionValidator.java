package org.egov.swservice.validator;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.web.models.OwnerInfo;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.ValidatorResult;
import org.egov.swservice.service.PropertyValidator;
import org.egov.swservice.service.SewerageFieldValidator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

@Component
public class SewerageConnectionValidator {
	
	@Autowired
	private PropertyValidator propertyValidator;
	
	@Autowired
	private SewerageFieldValidator sewerageFieldValidator;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	/**Used strategy pattern for avoiding multiple if else condition
	 * 
	 * @param sewerageConnectionRequest SewarageConnectionRequest is request for create or update
	 * @param reqType True for update and false for create
	 */
	public void validateSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest, int reqType) {
		Map<String, String> errorMap = new HashMap<>();
		if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance() == null || StringUtils
				.isEmpty(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			errorMap.put("INVALID_ACTION", "Workflow obj can not be null or action can not be empty!!");
			throw new CustomException(errorMap);
		}
		ValidatorResult isPropertyValidated = propertyValidator.validate(sewerageConnectionRequest, reqType);
		if (!isPropertyValidated.isStatus()) {
			errorMap.putAll(isPropertyValidated.getErrorMessage());
		}
		ValidatorResult isSewerageFieldValidated = sewerageFieldValidator.validate(sewerageConnectionRequest, reqType);
		if (!isSewerageFieldValidated.isStatus()) {
			errorMap.putAll(isSewerageFieldValidated.getErrorMessage());
		}
		if(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase("PAY"))
			errorMap.put("INVALID_ACTION","Pay action cannot perform directly");

		String channel = sewerageConnectionRequest.getSewerageConnection().getChannel();
		if(channel != null){
			if(!SWConstants.CHANNEL_VALUES.contains(channel))
				errorMap.put("INVALID_CHANNEL","The value given for channel field is invalid");
			if(reqType == SWConstants.CREATE_APPLICATION && sewerageConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("EMPLOYEE") && channel.equalsIgnoreCase("CITIZEN"))
				errorMap.put("INVALID_CHANNEL","The value given for channel field is invalid for employee role");
			if(reqType == SWConstants.CREATE_APPLICATION && sewerageConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN") && !channel.equalsIgnoreCase("CITIZEN"))
				errorMap.put("INVALID_CHANNEL","The value given for channel field is invalid for citizen role");

		}
		
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	
	/**
	 * Validate for previous data to current data
	 * 
	 * @param request sewerage connection request
	 * @param searchResult sewerage connection search result
	 */
	public void validateUpdate(SewerageConnectionRequest request, SewerageConnection searchResult) {
		validateAllIds(request.getSewerageConnection(), searchResult);
		validateDuplicateDocuments(request);
		setFieldsFromSearch(request,searchResult);
		
	}
   
	/**
	 * Validates if all ids are same as obtained from search result
	 * 
	 * @param updateSewerageConnection The sewerage connection request from update request
	 * @param searchResult The sewerage connection from search result
	 */
	private void validateAllIds(SewerageConnection updateSewerageConnection, SewerageConnection searchResult) {
		Map<String, String> errorMap = new HashMap<>();
		if (!searchResult.getApplicationNo().equals(updateSewerageConnection.getApplicationNo())) {
			StringBuilder builder = new StringBuilder();
			builder.append("The application number from search: ").append(searchResult.getApplicationNo())
					.append(" and from update: ").append(updateSewerageConnection.getApplicationNo())
					.append(" does not match");
			errorMap.put("INVALID_UPDATE", builder.toString());
		}
		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}
    
    /**
     * Validates application documents for duplicates
     * 
     * @param request The sewerageConnection Request
     */
	private void validateDuplicateDocuments(SewerageConnectionRequest request) {
		List<String> documentFileStoreIds = new LinkedList<>();
		if (request.getSewerageConnection().getDocuments() != null) {
			request.getSewerageConnection().getDocuments().forEach(document -> {
				if (documentFileStoreIds.contains(document.getFileStoreId()))
					throw new CustomException("DUPLICATE_DOCUMENT ERROR",
							"Same document cannot be used multiple times");
				else
					documentFileStoreIds.add(document.getFileStoreId());
			});
		}
	}
	/**
	 * Enrich Immutable fields
	 * 
	 * @param request Sewerage connection request
	 * @param searchResult sewerage connection search result
	 */
	private void setFieldsFromSearch(SewerageConnectionRequest request, SewerageConnection searchResult) {
		request.getSewerageConnection().setConnectionNo(searchResult.getConnectionNo());

		/*
		 * Replace the requestBody data and data from dB for those fields that come as masked (data containing "*" is
		 * identified as masked) in requestBody
		 *
		 * */
		if (!CollectionUtils.isEmpty(request.getSewerageConnection().getConnectionHolders()) &&
				!CollectionUtils.isEmpty(searchResult.getConnectionHolders())) {

			List<OwnerInfo> connHolders = request.getSewerageConnection().getConnectionHolders();
			searchResult = encryptionDecryptionUtil.decryptObject(searchResult, "WnSConnectionDecrypDisabled", SewerageConnection.class, request.getRequestInfo());
			List<OwnerInfo> searchedConnHolders = searchResult.getConnectionHolders();

			if (!ObjectUtils.isEmpty(connHolders.get(0).getOwnerType()) &&
					!ObjectUtils.isEmpty(searchedConnHolders.get(0).getOwnerType())) {

				int k = 0;
				for (OwnerInfo holderInfo : connHolders) {
					if (holderInfo.getOwnerType().contains("*"))
						holderInfo.setOwnerType(searchedConnHolders.get(k).getOwnerType());
					if (holderInfo.getRelationship().contains("*"))
						holderInfo.setRelationship(searchedConnHolders.get(k).getRelationship());
					k++;
				}
			}
		}
	}
}
