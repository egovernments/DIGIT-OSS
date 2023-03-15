package org.egov.waterconnection.validator;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.service.MeterInfoValidator;
import org.egov.waterconnection.service.PropertyValidator;
import org.egov.waterconnection.service.WaterFieldValidator;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.web.models.OwnerInfo;
import org.egov.waterconnection.web.models.ValidatorResult;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;


@Component
@Slf4j
public class WaterConnectionValidator {

	@Autowired
	private PropertyValidator propertyValidator;
	
	@Autowired
	private WaterFieldValidator waterFieldValidator;
	
	@Autowired
	private MeterInfoValidator meterInfoValidator;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	/**Used strategy pattern for avoiding multiple if else condition
	 * 
	 * @param waterConnectionRequest
	 * @param reqType
	 */
	public void validateWaterConnection(WaterConnectionRequest waterConnectionRequest, int reqType) {
		Map<String, String> errorMap = new HashMap<>();
		if (StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance())
				|| StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction())) {
			errorMap.put("INVALID_ACTION", "Workflow obj can not be null or action can not be empty!!");
			throw new CustomException(errorMap);
		}
		ValidatorResult isPropertyValidated = propertyValidator.validate(waterConnectionRequest, reqType);
		if (!isPropertyValidated.isStatus())
			errorMap.putAll(isPropertyValidated.getErrorMessage());
		ValidatorResult isWaterFieldValidated = waterFieldValidator.validate(waterConnectionRequest, reqType);
		if (!isWaterFieldValidated.isStatus())
			errorMap.putAll(isWaterFieldValidated.getErrorMessage());
		ValidatorResult isMeterInfoValidated = meterInfoValidator.validate(waterConnectionRequest, reqType);
		if (!isMeterInfoValidated.isStatus())
			errorMap.putAll(isMeterInfoValidated.getErrorMessage());
		if(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction().equalsIgnoreCase("PAY"))
			errorMap.put("INVALID_ACTION","Pay action cannot be perform directly");

		String channel = waterConnectionRequest.getWaterConnection().getChannel();
		if(channel != null){
			if(!WCConstants.CHANNEL_VALUES.contains(channel))
				errorMap.put("INVALID_CHANNEL","The value given for channel field is invalid");
			if( reqType == WCConstants.CREATE_APPLICATION && waterConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("EMPLOYEE") && channel.equalsIgnoreCase("CITIZEN"))
				errorMap.put("INVALID_CHANNEL","The value given for channel field is invalid for employee role");
			if( reqType == WCConstants.CREATE_APPLICATION && waterConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN") && !channel.equalsIgnoreCase("CITIZEN"))
				errorMap.put("INVALID_CHANNEL","The value given for channel field is invalid for citizen role");
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	public void validatePropertyForConnection(List<WaterConnection> waterConnectionList) {
		waterConnectionList.forEach(waterConnection -> {
			if (StringUtils.isEmpty(waterConnection.getId())) {
				StringBuilder builder = new StringBuilder();
				builder.append("PROPERTY UUID NOT FOUND FOR ")
						.append(waterConnection.getConnectionNo() == null ? waterConnection.getApplicationNo()
								: waterConnection.getConnectionNo());
				log.error(builder.toString());
			}
		});
	}
	
	/**
	 * Validate for previous data to current data
	 * 
	 * @param request water connection request
	 * @param searchResult water connection search result
	 */
	public void validateUpdate(WaterConnectionRequest request, WaterConnection searchResult, int reqType) {
		validateAllIds(request.getWaterConnection(), searchResult);
		validateDuplicateDocuments(request);
		setFieldsFromSearch(request, searchResult, reqType);
		
	}
   
	/**
	 * Validates if all ids are same as obtained from search result
	 * 
	 * @param updateWaterConnection The water connection request from update request 
	 * @param searchResult The water connection from search result
	 */
	private void validateAllIds(WaterConnection updateWaterConnection, WaterConnection searchResult) {
		Map<String, String> errorMap = new HashMap<>();
		if (!searchResult.getApplicationNo().equals(updateWaterConnection.getApplicationNo()))
			errorMap.put("INVALID UPDATE", "The application number from search: " + searchResult.getApplicationNo()
					+ " and from update: " + updateWaterConnection.getApplicationNo() + " does not match");
		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}
    
    /**
     * Validates application documents for duplicates
     * 
     * @param request The waterConnection Request
     */
	private void validateDuplicateDocuments(WaterConnectionRequest request) {
		if (request.getWaterConnection().getDocuments() != null) {
			List<String> documentFileStoreIds = new LinkedList<>();
			request.getWaterConnection().getDocuments().forEach(document -> {
				if (documentFileStoreIds.contains(document.getFileStoreId()))
					throw new CustomException("DUPLICATE_DOCUMENT_ERROR",
							"Same document cannot be used multiple times");
				else
					documentFileStoreIds.add(document.getFileStoreId());
			});
		}
	}
	/**
	 * Enrich Immutable fields
	 * 
	 * @param request Water connection request
	 * @param searchResult water connection search result
	 */
	private void setFieldsFromSearch(WaterConnectionRequest request, WaterConnection searchResult, int reqType) {
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			request.getWaterConnection().setConnectionNo(searchResult.getConnectionNo());
		}

		/*
		 * Replace the requestBody data and data from dB for those fields that come as masked (data containing "*" is
		 * identified as masked) in requestBody
		 *
		 * */
		if (!CollectionUtils.isEmpty(request.getWaterConnection().getConnectionHolders()) &&
				!CollectionUtils.isEmpty(searchResult.getConnectionHolders())) {

			List<OwnerInfo> connHolders = request.getWaterConnection().getConnectionHolders();
			searchResult = encryptionDecryptionUtil.decryptObject(searchResult, "WnSConnectionDecrypDisabled", WaterConnection.class, request.getRequestInfo());
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
