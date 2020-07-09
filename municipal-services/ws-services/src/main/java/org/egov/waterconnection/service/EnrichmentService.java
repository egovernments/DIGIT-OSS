package org.egov.waterconnection.service;


import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.web.models.AuditDetails;
import org.egov.waterconnection.web.models.Connection.StatusEnum;
import org.egov.waterconnection.web.models.Status;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.web.models.Idgen.IdResponse;
import org.egov.waterconnection.repository.IdGenRepository;
import org.egov.waterconnection.repository.WaterDaoImpl;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class EnrichmentService {

	@Autowired
	private WaterServicesUtil waterServicesUtil;

	@Autowired
	private IdGenRepository idGenRepository;

	@Autowired
	private WSConfiguration config;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private WaterDaoImpl waterDao;
	


	/**
	 * Enrich water connection
	 * 
	 * @param waterConnectionRequest WaterConnection Object
	 */
	public void enrichWaterConnection(WaterConnectionRequest waterConnectionRequest) {
		AuditDetails auditDetails = waterServicesUtil
				.getAuditDetails(waterConnectionRequest.getRequestInfo().getUserInfo().getUuid(), true);
		waterConnectionRequest.getWaterConnection().setAuditDetails(auditDetails);
		waterConnectionRequest.getWaterConnection().setId(UUID.randomUUID().toString());
		waterConnectionRequest.getWaterConnection().setStatus(StatusEnum.ACTIVE);
		//Application creation date
		HashMap<String, Object> additionalDetail = new HashMap<>();
	    additionalDetail.put(WCConstants.APP_CREATED_DATE, BigDecimal.valueOf(System.currentTimeMillis()));
	    waterConnectionRequest.getWaterConnection().setAdditionalDetails(additionalDetail);
		setApplicationIdGenIds(waterConnectionRequest);
		setStatusForCreate(waterConnectionRequest);
		
	}
	@SuppressWarnings("unchecked")
	public void enrichingAdditionalDetails(WaterConnectionRequest waterConnectionRequest) {
		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (waterConnectionRequest.getWaterConnection().getAdditionalDetails() == null) {
			WCConstants.ADDITIONAL_OBJ_CONSTANT.forEach(key -> {
				additionalDetail.put(key, null);
			});
		} else {
			HashMap<String, Object> addDetail = mapper
					.convertValue(waterConnectionRequest.getWaterConnection().getAdditionalDetails(), HashMap.class);
			List<String> numberConstants = Arrays.asList(WCConstants.ADHOC_PENALTY, WCConstants.ADHOC_REBATE,
					WCConstants.INITIAL_METER_READING_CONST, WCConstants.APP_CREATED_DATE,
					WCConstants.ESTIMATION_DATE_CONST);
			for (String constKey : WCConstants.ADDITIONAL_OBJ_CONSTANT) {
				if (addDetail.getOrDefault(constKey, null) != null && numberConstants.contains(constKey)) {
					BigDecimal big = new BigDecimal(String.valueOf(addDetail.get(constKey)));
					additionalDetail.put(constKey, big);
				} else {
					additionalDetail.put(constKey, addDetail.get(constKey));
				}
			}
			if (waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(WCConstants.APPROVE_CONNECTION_CONST)) {
				additionalDetail.put(WCConstants.ESTIMATION_DATE_CONST, System.currentTimeMillis());
			}
		}
		waterConnectionRequest.getWaterConnection().setAdditionalDetails(additionalDetail);
	}
	

	/**
	 * Sets the WaterConnectionId for given WaterConnectionRequest
	 *
	 * @param request
	 *            WaterConnectionRequest which is to be created
	 */
	private void setApplicationIdGenIds(WaterConnectionRequest request) {
		WaterConnection waterConnection = request.getWaterConnection();
		List<String> applicationNumbers = getIdList(request.getRequestInfo(),
				request.getWaterConnection().getTenantId(), config.getWaterApplicationIdGenName(),
				config.getWaterApplicationIdGenFormat());
		if (applicationNumbers.size() != 1) {
			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("IDGEN_ERROR",
					"The Id of WaterConnection returned by IdGen is not equal to number of WaterConnection");
			throw new CustomException(errorMap);
		}
		waterConnection.setApplicationNo(applicationNumbers.get(0));
	}

	private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idFormat) {
		List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idFormat, 1)
				.getIdResponses();

		if (CollectionUtils.isEmpty(idResponses))
			throw new CustomException(WCConstants.IDGEN_ERROR_CONST, "No ids returned from idgen Service");

		return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
	}
	
	
	/**
	 * Enrich update water connection
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void enrichUpdateWaterConnection(WaterConnectionRequest waterConnectionRequest) {
		AuditDetails auditDetails = waterServicesUtil
				.getAuditDetails(waterConnectionRequest.getRequestInfo().getUserInfo().getUuid(), false);
		waterConnectionRequest.getWaterConnection().setAuditDetails(auditDetails);
		WaterConnection connection = waterConnectionRequest.getWaterConnection();
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
		enrichingAdditionalDetails(waterConnectionRequest);
	}
	
	/**
	 * Enrich water connection request and add connection no if status is approved
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void postStatusEnrichment(WaterConnectionRequest waterConnectionRequest) {
		if (WCConstants.ACTIVATE_CONNECTION
				.equalsIgnoreCase(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction())) {
			setConnectionNO(waterConnectionRequest);
		}
	}
	
	/**
	 * Create meter reading for meter connection
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void postForMeterReading(WaterConnectionRequest waterConnectionRequest) {
		if (WCConstants.ACTIVATE_CONNECTION
				.equalsIgnoreCase(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction())) {
			waterDao.postForMeterReading(waterConnectionRequest);
		}
	}
    
    
    /**
     * Enrich water connection request and set water connection no
     * @param request WaterConnectionRequest Object
     */
	private void setConnectionNO(WaterConnectionRequest request) {
		List<String> connectionNumbers = getIdList(request.getRequestInfo(), request.getWaterConnection().getTenantId(),
				config.getWaterConnectionIdGenName(), config.getWaterConnectionIdGenFormat());
		if (connectionNumbers.size() != 1) {
			throw new CustomException("IDGEN_ERROR",
					"The Id of WaterConnection returned by IdGen is not equal to number of WaterConnection");
		}
		request.getWaterConnection().setConnectionNo(connectionNumbers.get(0));
	}
	/**
	 * Enrich fileStoreIds
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void enrichFileStoreIds(WaterConnectionRequest waterConnectionRequest) {
		try {
			if (waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(WCConstants.APPROVE_CONNECTION_CONST)
					|| waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
							.equalsIgnoreCase(WCConstants.ACTION_PAY)) {
				waterDao.enrichFileStoreIds(waterConnectionRequest);
			}
		} catch (Exception ex) {
			log.debug(ex.toString());
		}
	}
	
	/**
	 * Sets status for create request
	 * 
	 * @param waterConnectionRequest
	 *            The create request
	 */
	private void setStatusForCreate(WaterConnectionRequest waterConnectionRequest) {
		if (waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
				.equalsIgnoreCase(WCConstants.ACTION_INITIATE)) {
			waterConnectionRequest.getWaterConnection().setApplicationStatus(WCConstants.STATUS_INITIATED);
		}
	}

}
