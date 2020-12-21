package org.egov.waterconnection.validator;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.web.models.ValidatorResult;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.service.MeterInfoValidator;
import org.egov.waterconnection.service.PropertyValidator;
import org.egov.waterconnection.service.WaterFieldValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
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


	/**Used strategy pattern for avoiding multiple if else condition
	 * 
	 * @param waterConnectionRequest
	 * @param isUpdate
	 */
	public void validateWaterConnection(WaterConnectionRequest waterConnectionRequest, boolean isUpdate) {
		Map<String, String> errorMap = new HashMap<>();
		if (StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance())
				|| StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction())) {
			errorMap.put("INVALID_ACTION", "Workflow obj can not be null or action can not be empty!!");
			throw new CustomException(errorMap);
		}
		ValidatorResult isPropertyValidated = propertyValidator.validate(waterConnectionRequest, isUpdate);
		if (!isPropertyValidated.isStatus())
			errorMap.putAll(isPropertyValidated.getErrorMessage());
		ValidatorResult isWaterFieldValidated = waterFieldValidator.validate(waterConnectionRequest, isUpdate);
		if (!isWaterFieldValidated.isStatus())
			errorMap.putAll(isWaterFieldValidated.getErrorMessage());
		ValidatorResult isMeterInfoValidated = meterInfoValidator.validate(waterConnectionRequest, isUpdate);
		if (!isMeterInfoValidated.isStatus())
			errorMap.putAll(isMeterInfoValidated.getErrorMessage());

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
	public void validateUpdate(WaterConnectionRequest request, WaterConnection searchResult) {
		validateAllIds(request.getWaterConnection(), searchResult);
		validateDuplicateDocuments(request);
		setFieldsFromSearch(request,searchResult);
		
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
	private void setFieldsFromSearch(WaterConnectionRequest request, WaterConnection searchResult) {
		request.getWaterConnection().setConnectionNo(searchResult.getConnectionNo());
	}
}
