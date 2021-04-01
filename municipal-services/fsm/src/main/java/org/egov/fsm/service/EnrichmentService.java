package org.egov.fsm.service;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.FSMRepository;
import org.egov.fsm.repository.IdGenRepository;
import org.egov.fsm.util.ComparisionUtility;
import org.egov.fsm.util.FSMAuditUtil;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.web.model.AuditDetails;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMAudit;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.Workflow;
import org.egov.fsm.web.model.idgen.IdResponse;
import org.egov.fsm.web.model.user.User;
import org.egov.fsm.web.model.user.UserDetailResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EnrichmentService {
	@Autowired
	private FSMConfiguration config;

	@Autowired
	private IdGenRepository idGenRepository;
	@Autowired
	private BoundaryService boundaryService ;
	
	@Autowired
	private FSMRepository repository ;

	@Autowired
	private UserService userService;
	
	@Autowired
	private FSMUtil fsmUtil;
	
	@Autowired
	private ComparisionUtility comparisionUtility;
	/**
	 * enrich the create FSM request with the required data
	 * @param fsmRequest
	 * @param mdmsData
	 */
	public void enrichFSMCreateRequest(FSMRequest fsmRequest, Object mdmsData) {
		//TODO add requied logic
		RequestInfo requestInfo = fsmRequest.getRequestInfo();
		
		if( fsmRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN)) {
			User citzen = new User();
			BeanUtils.copyProperties(fsmRequest.getRequestInfo().getUserInfo(), citzen);
			fsmRequest.getFsm().setCitizen(citzen);
		}else {
			userService.manageApplicant(fsmRequest);
		}
		
		boundaryService.getAreaType(fsmRequest, config.getHierarchyTypeCode());
		fsmRequest.getFsm().setStatus(FSM.StatusEnum.ACTIVE);
		fsmRequest.getFsm().setApplicationStatus(FSMConstants.DRAFT);
		AuditDetails auditDetails = fsmUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
		fsmRequest.getFsm().setAuditDetails(auditDetails);
		fsmRequest.getFsm().setId(UUID.randomUUID().toString());
		
		fsmRequest.getFsm().setAccountId(fsmRequest.getFsm().getCitizen().getUuid());
		
		if (fsmRequest.getFsm().getAddress() != null) {
			if (StringUtils.isEmpty(fsmRequest.getFsm().getAddress().getId()))
				fsmRequest.getFsm().getAddress().setId(UUID.randomUUID().toString());
			fsmRequest.getFsm().getAddress().setTenantId(fsmRequest.getFsm().getTenantId());
			fsmRequest.getFsm().getAddress().setAuditDetails(auditDetails);
			if (fsmRequest.getFsm().getAddress().getGeoLocation() != null
					&& StringUtils.isEmpty(fsmRequest.getFsm().getAddress().getGeoLocation().getId()))
				fsmRequest.getFsm().getAddress().getGeoLocation().setId(UUID.randomUUID().toString());
		}else {
			throw new CustomException(FSMErrorConstants.INVALID_ADDRES," Address is mandatory");
		}
		
		if(fsmRequest.getFsm().getPitDetail() != null) {
			if (StringUtils.isEmpty(fsmRequest.getFsm().getPitDetail().getId()))
				fsmRequest.getFsm().getPitDetail().setId(UUID.randomUUID().toString());
			fsmRequest.getFsm().getPitDetail().setTenantId(fsmRequest.getFsm().getTenantId());
			fsmRequest.getFsm().getPitDetail().setAuditDetails(auditDetails);
		}
		
		if(fsmRequest.getWorkflow() == null) {
			String action =  fsmRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase(FSMConstants.EMPLOYEE) ? FSMConstants.WF_ACTION_APPLY : FSMConstants.WF_ACTION_CREATE; 
			fsmRequest.setWorkflow( Workflow.builder().action(action).build());
		}
		
		setIdgenIds(fsmRequest);
		
	}
	
	/**
	 *  generate the applicationNo using the idGen serivce and populate
	 * @param request
	 */
	private void setIdgenIds(FSMRequest request) {
		RequestInfo requestInfo = request.getRequestInfo();
		String tenantId = request.getFsm().getTenantId();
		FSM fsm = request.getFsm();

		List<String> applicationNumbers = getIdList(requestInfo, tenantId, config.getApplicationNoIdgenName(),
				config.getApplicationNoIdgenFormat(), 1);
		ListIterator<String> itr = applicationNumbers.listIterator();

		Map<String, String> errorMap = new HashMap<>();

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

		fsm.setApplicationNo(itr.next());
	}
	
	/**
	 * Generate the id
	 * @param requestInfo
	 * @param tenantId
	 * @param idKey
	 * @param idformat
	 * @param count
	 * @return
	 */
	private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idformat, int count) {
		List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idformat, count)
				.getIdResponses();

		if (CollectionUtils.isEmpty(idResponses))
			throw new CustomException(FSMErrorConstants.IDGEN_ERROR, "No ids returned from idgen Service");

		return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
	}
	
	/**
	 *  enrich the update request with the requied ata
	 * @param fsmRequest
	 * @param mdmsData
	 */
	public void enrichFSMUpdateRequest(FSMRequest fsmRequest, Object mdmsData, FSM oldFsm) {
		//TODO add requied logic
		RequestInfo requestInfo = fsmRequest.getRequestInfo();
		AuditDetails auditDetails = fsmUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), false);
		auditDetails.setCreatedBy(oldFsm.getAuditDetails().getCreatedBy());
		auditDetails.setCreatedTime(oldFsm.getAuditDetails().getCreatedTime());
		fsmRequest.getFsm().setAuditDetails(auditDetails);
		if (fsmRequest.getFsm().getAddress() != null) {
			if (StringUtils.isEmpty(fsmRequest.getFsm().getAddress().getId()))
				fsmRequest.getFsm().getAddress().setId(UUID.randomUUID().toString());
			fsmRequest.getFsm().getAddress().setTenantId(fsmRequest.getFsm().getTenantId());
			fsmRequest.getFsm().getAddress().setAuditDetails(auditDetails);
			if (fsmRequest.getFsm().getAddress().getGeoLocation() != null
					&& StringUtils.isEmpty(fsmRequest.getFsm().getAddress().getGeoLocation().getId()))
				fsmRequest.getFsm().getAddress().getGeoLocation().setId(UUID.randomUUID().toString());
		}else {
			throw new CustomException(FSMErrorConstants.INVALID_ADDRES," Address is mandatory");
		}
		
		if(fsmRequest.getFsm().getPitDetail() != null) {
			if (StringUtils.isEmpty(fsmRequest.getFsm().getPitDetail().getId())) {
					fsmRequest.getFsm().getPitDetail().setId(UUID.randomUUID().toString());
					fsmRequest.getFsm().getPitDetail().setTenantId(fsmRequest.getFsm().getTenantId());
			}			
			fsmRequest.getFsm().getPitDetail().setAuditDetails(auditDetails);
		}

	}

	/**
	 * enrich the request with post workflow call based on the workflow response
	 * @param fsmRequest
	 */
	public void postStatusEnrichment(FSMRequest fsmRequest) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * 
	 * @param fsms
	 * @param requestInfo
	 */
	public void enrichFSMSearch(List<FSM> fsms, RequestInfo requestInfo, String tenantId) {
		 
		enrichBoundarys(fsms, requestInfo);
		List<String> accountIds = fsms.stream().map(FSM::getAccountId).collect(Collectors.toList());
		FSMSearchCriteria fsmsearch = new FSMSearchCriteria();
		fsmsearch.setTenantId(tenantId);
		fsmsearch.setOwnerIds(accountIds);
		UserDetailResponse userDetailResponse = userService.getUser(fsmsearch, requestInfo);
		encrichApplicant(userDetailResponse, fsms);
	}
	
	/**
	 * enrich the bounday in the FSM Object
	 * @param fsms
	 * @param requestInfo
	 */
	private void enrichBoundarys(List<FSM> fsms, RequestInfo requestInfo) {
		fsms.forEach(fsm -> {
			boundaryService.getAreaType(new FSMRequest(requestInfo, fsm, null), config.getHierarchyTypeCode());
		});
		
			
	}

	/**
	 * enrich the applicant information in FSM
	 * @param userDetailResponse
	 * @param fsms
	 */
	private void encrichApplicant(UserDetailResponse userDetailResponse, List<FSM> fsms) {

		List<User> users = userDetailResponse.getUser();
		Map<String, User> userIdToApplicantMap = new HashMap<>();
		users.forEach(user -> userIdToApplicantMap.put(user.getUuid(), user));
		fsms.forEach(fsm -> {
			 fsm.setCitizen( userIdToApplicantMap.get(fsm.getAccountId()));
		});
	}
	
	public List<FSMAudit> enrichFSMAudit(FSMAuditUtil  sourceObject, List<FSMAuditUtil> targetObjects) {
		return comparisionUtility.compareData(sourceObject, targetObjects);
	}
}
