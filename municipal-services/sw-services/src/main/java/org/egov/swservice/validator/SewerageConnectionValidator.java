package org.egov.swservice.validator;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.ValidatorResult;
import org.egov.swservice.service.PropertyValidator;
import org.egov.swservice.service.SewerageFieldValidator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Component
public class SewerageConnectionValidator {
	
	@Autowired
	private PropertyValidator propertyValidator;
	
	@Autowired
	private SewerageFieldValidator sewerageFieldValidator;

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
	}
}
