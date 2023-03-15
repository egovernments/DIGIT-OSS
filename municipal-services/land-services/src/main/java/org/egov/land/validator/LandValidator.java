package org.egov.land.validator;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.land.util.LandConstants;
import org.egov.land.web.models.LandInfoRequest;
import org.egov.land.web.models.LandSearchCriteria;
import org.egov.land.web.models.OwnerInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LandValidator {

	 @Autowired
	 private LandMDMSValidator mdmsValidator;

	public void validateLandInfo(@Valid LandInfoRequest landRequest,  Object mdmsData) {
		mdmsValidator.validateMdmsData(landRequest, mdmsData);
		validateApplicationDocuments(landRequest, null);
//		validateUser(landRequest);
		validateDuplicateUser(landRequest);
	}
	
	
	/*private void validateUser(@Valid LandInfoRequest landRequest) {
		landRequest.getLandInfo().getOwners().forEach(owner -> {
			if (StringUtils.isEmpty(owner.getRelationship())) {
				throw new CustomException(LandConstants.BPA_CREATE_USER, " Owner relation ship is mandatory " + owner.toString());
			}
		});
	}*/

	private void validateApplicationDocuments(@Valid LandInfoRequest landRequest, Object currentState) {
		if (landRequest.getLandInfo().getDocuments() != null) {
			List<String> documentFileStoreIds = new LinkedList<String>();
			landRequest.getLandInfo().getDocuments().forEach(document -> {
				if (documentFileStoreIds.contains(document.getFileStoreId()))
					throw new CustomException(LandConstants.BPA_DUPLICATE_DOCUMENT, "Same document cannot be used multiple times");
				else
					documentFileStoreIds.add(document.getFileStoreId());
			});
		}
	}
	
	public void validateDuplicateUser(LandInfoRequest landRequest) {
		List<OwnerInfo> owners = landRequest.getLandInfo().getOwners();
		if (owners.size() > 1) {
			List<String> mobileNos = new ArrayList<String>();
			for (OwnerInfo owner : owners) {
				if (mobileNos.contains(owner.getMobileNumber())) {
					throw new CustomException(LandConstants.DUPLICATE_MOBILENUMBER_EXCEPTION,
							"Duplicate mobile numbers found for owners");
				} else {
					mobileNos.add(owner.getMobileNumber());
				}
			}
		}
	}

	/**
	 * Validates if the search parameters are valid
	 * 
	 * @param requestInfo
	 *            The requestInfo of the incoming request
	 * @param criteria
	 *            The LandSearch Criteria
	 */
	public void validateSearch(RequestInfo requestInfo, LandSearchCriteria criteria) {
		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(LandConstants.CITIZEN) && criteria.isEmpty())
			throw new CustomException(LandConstants.INVALID_SEARCH, "Search without any paramters is not allowed");

		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(LandConstants.CITIZEN) && !criteria.tenantIdOnly()
				&& criteria.getTenantId() == null)
			throw new CustomException(LandConstants.INVALID_SEARCH, "TenantId is mandatory in search");

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(LandConstants.CITIZEN) && !criteria.isEmpty()
				&& !criteria.tenantIdOnly() && criteria.getTenantId() == null)
			throw new CustomException(LandConstants.INVALID_SEARCH, "TenantId is mandatory in search");
	}
}
