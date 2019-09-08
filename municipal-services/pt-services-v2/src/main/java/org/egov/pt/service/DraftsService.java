package org.egov.pt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.DraftRepository;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.util.ResponseInfoFactory;
import org.egov.pt.web.models.Draft;
import org.egov.pt.web.models.DraftRequest;
import org.egov.pt.web.models.DraftResponse;
import org.egov.pt.web.models.DraftSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.apache.commons.lang.StringUtils.isEmpty;

@Service
@Slf4j
public class DraftsService {
	
	@Autowired
	private Producer producer;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Autowired
	private PropertyConfiguration propertyConfiguration;
	
	@Autowired
	private DraftRepository draftRepository;
	
	@Autowired
	private PropertyUtil propertyUtil;
	
	@Autowired
	private ObjectMapper mapper;

	public DraftResponse createDraft(DraftRequest draftRequest) {
		enrichDraftsForCreate(draftRequest);
		List<Draft> drafts = Collections.singletonList(draftRequest.getDraft());
		producer.push(propertyConfiguration.getSaveDraftsTopic(), draftRequest);
		return DraftResponse.builder().responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(draftRequest.getRequestInfo(), true))
				.drafts(drafts).build();
	}

	private void enrichDraftsForCreate(DraftRequest draftRequest) {
		draftRequest.getDraft().setId(UUID.randomUUID().toString());
		draftRequest.getDraft().setActive(true);
		draftRequest.getDraft().setUserId(draftRequest.getRequestInfo().getUserInfo().getUuid());
		draftRequest.getDraft().setAuditDetails(propertyUtil.getAuditDetails(draftRequest.getRequestInfo().getUserInfo().getId().toString(), true));
	}
	
	public DraftResponse updateDraft(DraftRequest draftRequest) {
		DraftSearchCriteria criteria = DraftSearchCriteria.builder().id(draftRequest.getDraft().getId()).build();
		DraftResponse response = searchDraftsForValidation(draftRequest.getRequestInfo(), criteria);
		if(response.getDrafts().isEmpty()) {
			throw new CustomException("INVALID_UPDATE_REQUEST", "Draft being updated doesn't belong to this user");
		}
		enrichDraftsForUpdate(draftRequest);
		List<Draft> drafts = Collections.singletonList(draftRequest.getDraft());
		producer.push(propertyConfiguration.getUpdateDraftsTopic(), draftRequest);
		return DraftResponse.builder().responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(draftRequest.getRequestInfo(), true))
				.drafts(drafts).build();
	}

	private void enrichDraftsForUpdate(DraftRequest draftRequest) {
		if (!isEmpty(draftRequest.getDraft().getAssessmentNumber()))
			draftRequest.getDraft().setActive(false);
//		draftRequest.getDraft().setTenantId(draftRequest.getRequestInfo().getUserInfo().getTenantId());
		draftRequest.getDraft().setAuditDetails(propertyUtil.getAuditDetails(draftRequest.getRequestInfo().getUserInfo().getId().toString(), false));
	}

	public DraftResponse searchDrafts(RequestInfo requestInfo, DraftSearchCriteria draftSearchCriteria) {
		draftSearchCriteria.setOffset(draftSearchCriteria.getOffset() > 0 ? draftSearchCriteria.getOffset() : 0);
		draftSearchCriteria.setLimit(draftSearchCriteria.getLimit() > 0 ? draftSearchCriteria.getLimit() : 5);
		if (!isEmpty(draftSearchCriteria.getAssessmentNumber()))
			draftSearchCriteria.setIsActive(false);
		else
			draftSearchCriteria.setIsActive(true);

		List<Draft> drafts = null;

		try {
			drafts = draftRepository.getDrafts(draftSearchCriteria);
		}catch(Exception e) {
			log.info("Exception while fetching drafts: ",e);
			throw new CustomException("FETCH_DRAFTS_FAILED", "Unable to fetch drafts");
		}
		return DraftResponse.builder().responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true))
				.drafts(drafts).build();
		
	}
	
	public DraftResponse searchDraftsForValidation(RequestInfo requestInfo, DraftSearchCriteria draftSearchCriteria) {
		draftSearchCriteria.setUserId(requestInfo.getUserInfo().getUuid());
		List<Draft> drafts = new ArrayList<>();
		try {
			drafts = draftRepository.getDrafts(draftSearchCriteria);
		}catch(Exception e) {
			log.info("Exception while fetching drafts: ",e);
			throw new CustomException("FETCH_DRAFTS_FAILED", "Unable to fetch drafts");
		}
		return DraftResponse.builder().responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true))
				.drafts(drafts).build();	
	}
}
