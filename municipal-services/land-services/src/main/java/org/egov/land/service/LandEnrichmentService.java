package org.egov.land.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.land.config.LandConfiguration;
import org.egov.land.util.LandConstants;
import org.egov.land.util.LandUtil;
import org.egov.land.web.models.AuditDetails;
import org.egov.land.web.models.Channel;
import org.egov.land.web.models.LandInfo;
import org.egov.land.web.models.LandInfoRequest;
import org.egov.land.web.models.LandSearchCriteria;
import org.egov.land.web.models.OwnerInfo;
import org.egov.land.web.models.Source;
import org.egov.land.web.models.UserDetailResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LandEnrichmentService {

	@Autowired
	private LandUtil landUtil;

	@Autowired
	private LandBoundaryService boundaryService;

	@Autowired
	private LandConfiguration config;

	@Autowired
	private LandUserService userService;

	public void enrichLandInfoRequest(LandInfoRequest landRequest, boolean isUpdate) {
		@Valid RequestInfo requestInfo = landRequest.getRequestInfo();
		AuditDetails auditDetails = landUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
		landRequest.getLandInfo().setAuditDetails(auditDetails);
		if (!isUpdate) {
			landRequest.getLandInfo().setId(UUID.randomUUID().toString());
			boundaryService.getAreaType(landRequest, config.getHierarchyTypeCode());
		}

		if (landRequest.getLandInfo().getInstitution() != null) {
			if (StringUtils.isEmpty(landRequest.getLandInfo().getInstitution().getId()))
				landRequest.getLandInfo().getInstitution().setId(UUID.randomUUID().toString());
			if (StringUtils.isEmpty(landRequest.getLandInfo().getInstitution().getTenantId()))
				landRequest.getLandInfo().getInstitution().setTenantId(landRequest.getLandInfo().getTenantId());
		}
		
		if (StringUtils.isEmpty(landRequest.getLandInfo().getChannel())) {
			landRequest.getLandInfo().setChannel(Channel.SYSTEM);
		}

		if (StringUtils.isEmpty(landRequest.getLandInfo().getSource())) {
			landRequest.getLandInfo().setSource(Source.MUNICIPAL_RECORDS);
		}

		// address
		if (landRequest.getLandInfo().getAddress() != null) {
			if (StringUtils.isEmpty(landRequest.getLandInfo().getAddress().getId()))
				landRequest.getLandInfo().getAddress().setId(UUID.randomUUID().toString());
			landRequest.getLandInfo().getAddress().setTenantId(landRequest.getLandInfo().getTenantId());
			landRequest.getLandInfo().getAddress().setAuditDetails(auditDetails);
			if (landRequest.getLandInfo().getAddress().getGeoLocation() != null
					&& StringUtils.isEmpty(landRequest.getLandInfo().getAddress().getGeoLocation().getId()))
				landRequest.getLandInfo().getAddress().getGeoLocation().setId(UUID.randomUUID().toString());
		}
		// units
		if (!CollectionUtils.isEmpty(landRequest.getLandInfo().getUnit())) {
			landRequest.getLandInfo().getUnit().forEach(unit -> {
				if (StringUtils.isEmpty(unit.getId())) {
					unit.setId(UUID.randomUUID().toString());
				}
				unit.setTenantId(landRequest.getLandInfo().getTenantId());
				unit.setAuditDetails(auditDetails);
			});
		}

		// Documents
		if (!CollectionUtils.isEmpty(landRequest.getLandInfo().getDocuments())) {
			landRequest.getLandInfo().getDocuments().forEach(document -> {
				if (StringUtils.isEmpty(document.getId())) {
					document.setId(UUID.randomUUID().toString());
				}
				document.setAuditDetails(auditDetails);
			});
		}

		// Owners
		if (!CollectionUtils.isEmpty(landRequest.getLandInfo().getOwners())) {
			landRequest.getLandInfo().getOwners().forEach(owner -> {
				if (StringUtils.isEmpty(owner.getOwnerId()))
					owner.setOwnerId(UUID.randomUUID().toString());
				owner.setAuditDetails(auditDetails);
			});
		}
	}

	/**
	 * Creates search criteria from list of landInfo's
	 * 
	 * @param landInfo
	 *            's list The landInfo whose id's are added to search
	 * @return landSearch criteria on basis of landInfo id
	 */
	public LandSearchCriteria getLandCriteriaFromIds(List<LandInfo> landInfo, Integer limit) {
		LandSearchCriteria criteria = new LandSearchCriteria();
		Set<String> landIds = new HashSet<>();
		landInfo.forEach(data -> landIds.add(data.getId()));
		criteria.setIds(new LinkedList<>(landIds));
		criteria.setTenantId(landInfo.get(0).getTenantId());
		criteria.setLimit(limit);
		return criteria;
	}

	public List<LandInfo> enrichLandInfoSearch(List<LandInfo> landInfos, LandSearchCriteria criteria,
			RequestInfo requestInfo) {

		List<LandInfoRequest> landInfors = new ArrayList<LandInfoRequest>();
		landInfos.forEach(bpa -> {
			landInfors.add(new LandInfoRequest(requestInfo, bpa));
		});
		if (criteria.getLimit() == null || !criteria.getLimit().equals(-1)) {
			enrichBoundary(landInfors);
		}

		UserDetailResponse userDetailResponse = userService.getUsersForLandInfos(landInfos);
		enrichOwner(userDetailResponse, landInfos);
		if(!CollectionUtils.isEmpty(landInfos) && !CollectionUtils.isEmpty(landInfos.get(0).getOwners())){
			log.debug("In enrich service...... ");
		}
		return landInfos;
	}

	private void enrichBoundary(List<LandInfoRequest> landRequests) {
		landRequests.forEach(landRequest -> {
			boundaryService.getAreaType(landRequest, config.getHierarchyTypeCode());
		});
	}

	private void enrichOwner(UserDetailResponse userDetailResponse, List<LandInfo> landInfos) {

		List<OwnerInfo> users = userDetailResponse.getUser();
		Map<String, OwnerInfo> userIdToOwnerMap = new HashMap<>();
		users.forEach(user -> userIdToOwnerMap.put(user.getUuid(), user));
		landInfos.forEach(landInfo -> {
			landInfo.getOwners().forEach(owner -> {
				if (userIdToOwnerMap.get(owner.getUuid()) == null)
					throw new CustomException(LandConstants.OWNER_SEARCH_ERROR,
							"The owner of the landInfo " + landInfo.getId() + " is not coming in user search");
				else
					owner.addUserWithoutAuditDetail(userIdToOwnerMap.get(owner.getUuid()));
			});
		});
	}
}
