package org.egov.swservice.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.web.models.RoadCuttingInfo;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MDMSValidator {
	@Autowired
	private SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;

	public void validateMasterData(SewerageConnectionRequest request, int reqType) {
			switch (reqType) {
				case SWConstants.UPDATE_APPLICATION:
					validateMasterDataForUpdateConnection(request);
					break;
				case SWConstants.MODIFY_CONNECTION:
					validateMasterDataForModifyConnection(request);
					break;
				case SWConstants.DISCONNECT_CONNECTION:
					validateMasterDataForDisconnection(request);
					break;
				default:
					break;
	     }
	}

	private void validateMasterDataForDisconnection(SewerageConnectionRequest request) {
		if (request.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.EXECUTE_DISCONNECTION)) {
			Map<String, String> errorMap = new HashMap<>();
			List<String> names = new ArrayList<>(Arrays.asList(SWConstants.MDMS_SW_CONNECTION_TYPE));
			List<String> taxModelnames = new ArrayList<>(Arrays.asList(SWConstants.SC_ROADTYPE_MASTER));
			Map<String, List<String>> codes = getAttributeValues(request.getSewerageConnection().getTenantId(),
					SWConstants.MDMS_SW_MOD_NAME, names, "$.*.code",
					SWConstants.JSONPATH_ROOT, request.getRequestInfo());
			Map<String, List<String>> codeFromCalculatorMaster = getAttributeValues(request.getSewerageConnection().getTenantId(),
					SWConstants.SW_TAX_MODULE, taxModelnames, "$.*.code",
					SWConstants.TAX_JSONPATH_ROOT, request.getRequestInfo());
			// merge codes
			String[] masterNames = {SWConstants.MDMS_SW_CONNECTION_TYPE, SWConstants.SC_ROADTYPE_MASTER};
			Map<String, List<String>> finalcodes = Stream.of(codes, codeFromCalculatorMaster).map(Map::entrySet)
					.flatMap(Collection::stream).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
			validateMDMSData(masterNames, finalcodes);
			validateCodesForDisconnection(request.getSewerageConnection(), finalcodes, errorMap);
			if (!errorMap.isEmpty())
				throw new CustomException(errorMap);
		}
	}

	private void validateCodesForDisconnection(SewerageConnection sewerageConnection,
											   Map<String, List<String>> codes, Map<String, String> errorMap) {
		StringBuilder messageBuilder;
		if (sewerageConnection.getConnectionType() != null
				&& !codes.get(SWConstants.MDMS_SW_CONNECTION_TYPE).contains(sewerageConnection.getConnectionType())) {
			messageBuilder = new StringBuilder();
			messageBuilder.append("Connection type value is invalid, please enter proper value! ");
			errorMap.put("INVALID SEWERAGE CONNECTION TYPE", messageBuilder.toString());
		}
	}


	public Map<String, List<String>> getAttributeValues(String tenantId, String moduleName, List<String> names,
			String filter, String jsonPath, RequestInfo requestInfo) {
		StringBuilder uri = new StringBuilder(mdmsHost).append(mdmsEndpoint);
		MdmsCriteriaReq criteriaReq = sewerageServicesUtil.prepareMdMsRequest(tenantId, moduleName, names, filter,
				requestInfo);
		try {
			Object result = serviceRequestRepository.fetchResult(uri, criteriaReq);
			return JsonPath.read(result, jsonPath);
		} catch (Exception e) {
			log.error("Error while fetching MDMS data", e);
			throw new CustomException("INVALID_CONNECTION_TYPE", SWConstants.INVALID_CONNECTION_TYPE);
		}
	}

	private void validateMDMSData(String[] masterNames, Map<String, List<String>> codes) {
		Map<String, String> errorMap = new HashMap<>();
		for (String masterName : masterNames) {
			if (CollectionUtils.isEmpty(codes.get(masterName))) {
				errorMap.put("MDMS_DATA_ERROR ", "Unable to fetch " + masterName + " codes from MDMS");
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	private static Map<String, String> validateCodes(SewerageConnection sewerageConnection,
			Map<String, List<String>> codes, Map<String, String> errorMap) {
		StringBuilder messageBuilder;
		if (sewerageConnection.getConnectionType() != null 
				&& !codes.get(SWConstants.MDMS_SW_CONNECTION_TYPE).contains(sewerageConnection.getConnectionType())) {
			messageBuilder = new StringBuilder();
			messageBuilder.append("Connection type value is invalid, please enter proper value! ");
			errorMap.put("INVALID SEWERAGE CONNECTION TYPE", messageBuilder.toString());
		}
		
		if(sewerageConnection.getRoadCuttingInfo() == null){
			errorMap.put("INVALID_ROAD_INFO", "Road Cutting Information should not be empty");
		}

		if(sewerageConnection.getRoadCuttingInfo() != null){
			for(RoadCuttingInfo roadCuttingInfo : sewerageConnection.getRoadCuttingInfo()){
				if (!StringUtils.isEmpty(roadCuttingInfo.getRoadType())
						&& !codes.get(SWConstants.SC_ROADTYPE_MASTER).contains(roadCuttingInfo.getRoadType())) {
					messageBuilder = new StringBuilder();
					messageBuilder.append("Road type value is invalid, please enter proper value! ");
					errorMap.put("INVALID_WATER_ROAD_TYPE", messageBuilder.toString());
				}
			}
		}
		
		return errorMap;
	}
	
	/**
	 * Validate master data of sewerage connection request
	 *
	 * @param request sewerage connection request
	 */
	public void validateMasterForCreateRequest(SewerageConnectionRequest request) {
		// calling property related master
		List<String> propertyModuleMasters = new ArrayList<>(Arrays.asList(SWConstants.PROPERTY_OWNERTYPE));
		Map<String, List<String>> codesFromPropetyMasters = getAttributeValues(request.getSewerageConnection().getTenantId(),
				SWConstants.PROPERTY_MASTER_MODULE, propertyModuleMasters, "$.*.code",
				SWConstants.PROPERTY_JSONPATH_ROOT, request.getRequestInfo());
		// merge codes
		String[] finalmasterNames = {SWConstants.PROPERTY_OWNERTYPE};
		validateMDMSData(finalmasterNames, codesFromPropetyMasters);
		validateCodesForCreateRequest(request, codesFromPropetyMasters);
	}

	/**
	 *  @param request Sewerage connection request
	 * @param codes list of master data codes to verify against the sewerage connection request
	 */
	public void validateCodesForCreateRequest(SewerageConnectionRequest request, Map<String, List<String>> codes) {
		Map<String, String> errorMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(request.getSewerageConnection().getConnectionHolders())) {
			request.getSewerageConnection().getConnectionHolders().forEach(holderDetail -> {
				if (!StringUtils.isEmpty(holderDetail.getOwnerType())
						&&
						!codes.get(SWConstants.PROPERTY_OWNERTYPE).contains(holderDetail.getOwnerType())) {
					errorMap.put("INVALID_CONNECTION_HOLDER_TYPE",
							"The Connection holder type '" + holderDetail.getOwnerType() + "' does not exists");
				}
			});
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	public void validateMasterDataForUpdateConnection(SewerageConnectionRequest request) {
		if (request.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION_CONST)) {
			Map<String, String> errorMap = new HashMap<>();
			List<String> names = new ArrayList<>(Arrays.asList(SWConstants.MDMS_SW_CONNECTION_TYPE));
			List<String> taxModelnames = new ArrayList<>(Arrays.asList(SWConstants.SC_ROADTYPE_MASTER));
			Map<String, List<String>> codes = getAttributeValues(request.getSewerageConnection().getTenantId(),
					SWConstants.MDMS_SW_MOD_NAME, names, "$.*.code",
					SWConstants.JSONPATH_ROOT, request.getRequestInfo());
			Map<String, List<String>> codeFromCalculatorMaster = getAttributeValues(request.getSewerageConnection().getTenantId(),
					SWConstants.SW_TAX_MODULE, taxModelnames, "$.*.code",
					SWConstants.TAX_JSONPATH_ROOT, request.getRequestInfo());
			// merge codes
			String[] masterNames = {SWConstants.MDMS_SW_CONNECTION_TYPE, SWConstants.SC_ROADTYPE_MASTER};
			Map<String, List<String>> finalcodes = Stream.of(codes, codeFromCalculatorMaster).map(Map::entrySet)
					.flatMap(Collection::stream).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
			validateMDMSData(masterNames, finalcodes);
			validateCodes(request.getSewerageConnection(), finalcodes, errorMap);
			if (!errorMap.isEmpty())
				throw new CustomException(errorMap);
		}
	}

	public  void validateMasterDataForModifyConnection(SewerageConnectionRequest request) {
		if (request.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.APPROVE_CONNECTION)) {
			Map<String, String> errorMap = new HashMap<>();
			List<String> names = new ArrayList<>(Arrays.asList(SWConstants.MDMS_SW_CONNECTION_TYPE));
			List<String> taxModelnames = new ArrayList<>(Arrays.asList(SWConstants.SC_ROADTYPE_MASTER));
			Map<String, List<String>> codes = getAttributeValues(request.getSewerageConnection().getTenantId(),
					SWConstants.MDMS_SW_MOD_NAME, names, "$.*.code",
					SWConstants.JSONPATH_ROOT, request.getRequestInfo());
			Map<String, List<String>> codeFromCalculatorMaster = getAttributeValues(request.getSewerageConnection().getTenantId(),
					SWConstants.SW_TAX_MODULE, taxModelnames, "$.*.code",
					SWConstants.TAX_JSONPATH_ROOT, request.getRequestInfo());
			// merge codes
			String[] masterNames = {SWConstants.MDMS_SW_CONNECTION_TYPE, SWConstants.SC_ROADTYPE_MASTER};
			Map<String, List<String>> finalcodes = Stream.of(codes, codeFromCalculatorMaster).map(Map::entrySet)
					.flatMap(Collection::stream).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
			validateMDMSData(masterNames, finalcodes);
			validateCodes(request.getSewerageConnection(), finalcodes, errorMap);
			if (!errorMap.isEmpty())
				throw new CustomException(errorMap);
		}
	}

}
