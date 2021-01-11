package org.egov.swservice.service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.IdGenRepository;
import org.egov.swservice.repository.SewerageDaoImpl;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.Connection.StatusEnum;
import org.egov.swservice.web.models.Idgen.IdResponse;
import org.egov.swservice.web.models.users.User;
import org.egov.swservice.web.models.users.UserDetailResponse;
import org.egov.swservice.web.models.users.UserSearchRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

@Service
@Slf4j
public class EnrichmentService {

	@Autowired
	private SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	private IdGenRepository idGenRepository;

	@Autowired
	private SWConfiguration config;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SewerageDaoImpl sewerageDao;

	@Autowired
	private UserService userService;

	/**
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage Connection Requst Object
	 */
	@SuppressWarnings("unchecked")
	public void enrichSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest, int reqType) {
		AuditDetails auditDetails = sewerageServicesUtil
				.getAuditDetails(sewerageConnectionRequest.getRequestInfo().getUserInfo().getUuid(), true);
		sewerageConnectionRequest.getSewerageConnection().setAuditDetails(auditDetails);
		sewerageConnectionRequest.getSewerageConnection().setId(UUID.randomUUID().toString());
		sewerageConnectionRequest.getSewerageConnection().setStatus(StatusEnum.ACTIVE);
		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails() == null) {
			for (String constValue : SWConstants.ADDITIONAL_OBJECT) {
				additionalDetail.put(constValue, null);
			}
		} else {
			additionalDetail = mapper.convertValue(
					sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails(), HashMap.class);
		}
		// Application created date
		additionalDetail.put(SWConstants.APP_CREATED_DATE, BigDecimal.valueOf(System.currentTimeMillis()));
		sewerageConnectionRequest.getSewerageConnection().setAdditionalDetails(additionalDetail);
		// Setting ApplicationType
		sewerageConnectionRequest.getSewerageConnection().setApplicationType(
				reqType == SWConstants.CREATE_APPLICATION ? SWConstants.NEW_SEWERAGE_CONNECTION : SWConstants.MODIFY_SEWERAGE_CONNECTION);
		setSewarageApplicationIdgenIds(sewerageConnectionRequest);
		setStatusForCreate(sewerageConnectionRequest);
	}

	@SuppressWarnings("unchecked")
	public void enrichingAdditionalDetails(SewerageConnectionRequest sewerageConnectionRequest) {
		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails() == null) {
			SWConstants.ADDITIONAL_OBJECT.forEach(key -> additionalDetail.put(key, null));
		} else {
			HashMap<String, Object> addDetail = mapper.convertValue(
					sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails(), HashMap.class);
			List<String> adhocPenalityAndRebateConst = Arrays.asList(SWConstants.ADHOC_PENALTY,
					SWConstants.ADHOC_REBATE, SWConstants.APP_CREATED_DATE, SWConstants.ESTIMATION_DATE_CONST);
			for (String constKey : SWConstants.ADDITIONAL_OBJECT) {
				if (addDetail.getOrDefault(constKey, null) != null && adhocPenalityAndRebateConst.contains(constKey)) {
					BigDecimal big = new BigDecimal(String.valueOf(addDetail.get(constKey)));
					additionalDetail.put(constKey, big);
				} else {
					additionalDetail.put(constKey, addDetail.get(constKey));
				}
			}
			if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(SWConstants.APPROVE_CONNECTION_CONST)) {
				additionalDetail.put(SWConstants.ESTIMATION_DATE_CONST, System.currentTimeMillis());
			}
			additionalDetail.put(SWConstants.LOCALITY,addDetail.get(SWConstants.LOCALITY).toString());
		}
		sewerageConnectionRequest.getSewerageConnection().setAdditionalDetails(additionalDetail);
	}

	/**
	 * Sets status for create request
	 * 
	 * @param sewerageConnectionRequest
	 *            Sewerage connection request
	 *
	 */
	private void setStatusForCreate(SewerageConnectionRequest sewerageConnectionRequest) {
		if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
				.equalsIgnoreCase(SWConstants.ACTION_INITIATE)) {
			sewerageConnectionRequest.getSewerageConnection().setApplicationStatus(SWConstants.STATUS_INITIATED);
		}
	}

	/**
	 * Sets the SewarageConnectionId for given SewerageConnectionRequest
	 *
	 * @param request
	 *            SewerageConnectionRequest which is to be created
	 */
	private void setSewarageApplicationIdgenIds(SewerageConnectionRequest request) {
		List<String> applicationNumbers = getIdList(request.getRequestInfo(),
				request.getSewerageConnection().getTenantId(), config.getSewerageApplicationIdGenName(),
				config.getSewerageApplicationIdGenFormat(), 1);

		if (CollectionUtils.isEmpty(applicationNumbers) || applicationNumbers.size() != 1) {
			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("IDGEN ERROR ",
					"The Id of SewerageConnection returned by idgen is not equal to number of SewerageConnection");
			throw new CustomException(errorMap);
		}
		request.getSewerageConnection().setApplicationNo(applicationNumbers.listIterator().next());
	}

	private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idFormat, int count) {
		List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idFormat, count)
				.getIdResponses();

		if (CollectionUtils.isEmpty(idResponses))
			throw new CustomException("IDGEN_ERROR", "No ids returned from IdGen Service");

		return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
	}

	/**
	 * Enrich update sewarage connection
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage Connection Request Object
	 */
	public void enrichUpdateSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest) {
		AuditDetails auditDetails = sewerageServicesUtil
				.getAuditDetails(sewerageConnectionRequest.getRequestInfo().getUserInfo().getUuid(), false);
		sewerageConnectionRequest.getSewerageConnection().setAuditDetails(auditDetails);
		SewerageConnection connection = sewerageConnectionRequest.getSewerageConnection();
		if (!CollectionUtils.isEmpty(connection.getDocuments())) {
			connection.getDocuments().forEach(document -> {
				if (document.getId() == null) {
					document.setId(UUID.randomUUID().toString());
					document.setDocumentUid(UUID.randomUUID().toString());
					document.setStatus(Status.ACTIVE);
				}
				document.setAuditDetails(auditDetails);
			});
		}
		if (!CollectionUtils.isEmpty(connection.getPlumberInfo())) {
			connection.getPlumberInfo().forEach(plumberInfo -> {
				if (plumberInfo.getId() == null) {
					plumberInfo.setId(UUID.randomUUID().toString());
				}
				plumberInfo.setAuditDetails(auditDetails);
			});
		}
		enrichingAdditionalDetails(sewerageConnectionRequest);
	}

	/**
	 * Enrich sewerage connection request and add connection no if status is
	 * approved
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage connection request object
	 */
	public void postStatusEnrichment(SewerageConnectionRequest sewerageConnectionRequest) {
		if (SWConstants.ACTIVATE_CONNECTION
				.equalsIgnoreCase(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			setConnectionNO(sewerageConnectionRequest);
		}
	}

	/**
	 * Enrich sewerage connection request and set sewerage connection no
	 * 
	 * @param request
	 *            Sewerage Connection Request Object
	 */
	private void setConnectionNO(SewerageConnectionRequest request) {
		List<String> connectionNumbers = getIdList(request.getRequestInfo(),
				request.getSewerageConnection().getTenantId(), config.getSewerageIdGenName(),
				config.getSewerageIdGenFormat(), 1);

		if (CollectionUtils.isEmpty(connectionNumbers) || connectionNumbers.size() != 1) {
			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("IDGEN_ERROR",
					"The Id of WaterConnection returned by idgen is not equal to number of WaterConnection");
			throw new CustomException(errorMap);
		}

		request.getSewerageConnection().setConnectionNo(connectionNumbers.listIterator().next());
	}

	/**
	 * Enrich fileStoreIds
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage Connection Request Object
	 */
	public void enrichFileStoreIds(SewerageConnectionRequest sewerageConnectionRequest) {
		try {
			if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(SWConstants.APPROVE_CONNECTION_CONST)
					|| sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
							.equalsIgnoreCase(SWConstants.ACTION_PAY)) {
				sewerageDao.enrichFileStoreIds(sewerageConnectionRequest);
			}
		} catch (Exception ex) {
			log.debug(ex.toString());
		}
	}

	/**
	 * Enrich sewerage connection list
	 *
	 * @param sewerageConnectionList
	 * @param requestInfo
	 */
	public void enrichConnectionHolderDeatils(List<SewerageConnection> sewerageConnectionList, SearchCriteria criteria,
			RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(sewerageConnectionList))
			return;
		Set<String> connectionHolderIds = new HashSet<>();
		for (SewerageConnection sewerageConnection : sewerageConnectionList) {
			if (!CollectionUtils.isEmpty(sewerageConnection.getConnectionHolders())) {
				connectionHolderIds.addAll(sewerageConnection.getConnectionHolders().stream()
						.map(OwnerInfo::getUuid).collect(Collectors.toSet()));
			}
		}
		if (CollectionUtils.isEmpty(connectionHolderIds))
			return;
		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(criteria.getTenantId(), requestInfo);
		userSearchRequest.setUuid(connectionHolderIds);
		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		enrichConnectionHolderInfo(userDetailResponse, sewerageConnectionList,requestInfo);
	}

	/**
	 * Populates the owner fields inside of the sewerage connection objects from the
	 * response got from calling user api
	 * 
	 * @param userDetailResponse
	 * @param sewerageConnectionList
	 *            List of water connection whose owner's are to be populated from
	 *            userDetailsResponse
	 */
	public void enrichConnectionHolderInfo(UserDetailResponse userDetailResponse,
			List<SewerageConnection> sewerageConnectionList,RequestInfo requestInfo) {
		List<OwnerInfo> connectionHolderInfos = userDetailResponse.getUser();
		Map<String, OwnerInfo> userIdToConnectionHolderMap = new HashMap<>();
		connectionHolderInfos.forEach(user -> userIdToConnectionHolderMap.put(user.getUuid(), user));
		sewerageConnectionList.forEach(sewerageConnection -> {
			if (!CollectionUtils.isEmpty(sewerageConnection.getConnectionHolders())) {
				sewerageConnection.getConnectionHolders().forEach(holderInfo -> {
					if (userIdToConnectionHolderMap.get(holderInfo.getUuid()) == null)
						throw new CustomException("OWNER_SEARCH_ERROR", "The owner of the sewerage application"
								+ sewerageConnection.getApplicationNo() + " is not coming in user search");
					else{
						Boolean isOpenSearch = isSearchOpen(requestInfo.getUserInfo());
						if(isOpenSearch)
							holderInfo.addUserDetail(getMaskedOwnerInfo(userIdToConnectionHolderMap.get(holderInfo.getUuid())));
						else
							holderInfo.addUserDetail(userIdToConnectionHolderMap.get(holderInfo.getUuid()));
					}

				});
			}
		});
	}

	public Boolean isSearchOpen(org.egov.common.contract.request.User userInfo) {

		return userInfo.getType().equalsIgnoreCase("SYSTEM")
				&& userInfo.getRoles().stream().map(Role::getCode).collect(Collectors.toSet()).contains("ANONYMOUS");
	}

	private User getMaskedOwnerInfo(OwnerInfo info) {

		info.setMobileNumber(null);
		info.setUuid(null);
		info.setUserName(null);
		info.setGender(null);
		info.setAltContactNumber(null);
		info.setPwdExpiryDate(null);

		return info;
	}

	/**
	 * Filter the connection from connection activated or modified state
	 *
	 * @param connectionList
	 * @return
	 */
	public List<SewerageConnection> filterConnections(List<SewerageConnection> connectionList) {
		HashMap<String, Connection> connectionHashMap = new HashMap<>();
		connectionList.forEach(connection -> {
			if (!StringUtils.isEmpty(connection.getConnectionNo())) {
				if (connectionHashMap.get(connection.getConnectionNo()) == null &&
						SWConstants.FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					connectionHashMap.put(connection.getConnectionNo(), connection);
				} else if (connectionHashMap.get(connection.getConnectionNo()) != null &&
						SWConstants.FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					if (connectionHashMap.get(connection.getConnectionNo()).getApplicationStatus().
							equals(connection.getApplicationStatus())) {
						HashMap additionalDetail1 = new HashMap<>();
						HashMap additionalDetail2 = new HashMap<>();
						additionalDetail1 = mapper
								.convertValue(connectionHashMap.get(connection.getConnectionNo()).getAdditionalDetails(), HashMap.class);
						additionalDetail2 = mapper
								.convertValue(connection.getAdditionalDetails(), HashMap.class);
						BigDecimal creationDate1 = (BigDecimal) additionalDetail1.get(SWConstants.APP_CREATED_DATE);
						BigDecimal creationDate2 = (BigDecimal) additionalDetail2.get(SWConstants.APP_CREATED_DATE);
						if (creationDate1.compareTo(creationDate2) == -1) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					} else {
						if (connection.getApplicationStatus().equals(SWConstants
								.MODIFIED_FINAL_STATE)) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					}
				}
			}
		});
		return  new ArrayList(connectionHashMap.values());
	}
}
