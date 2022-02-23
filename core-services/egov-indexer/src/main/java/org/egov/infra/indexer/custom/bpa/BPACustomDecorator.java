package org.egov.infra.indexer.custom.bpa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.infra.indexer.custom.bpa.landInfo.EnrichedLandInfo;
import org.egov.infra.indexer.custom.bpa.landInfo.EnrichedUnit;
import org.egov.infra.indexer.custom.bpa.landInfo.Unit;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.json.JSONObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;

@Service
@Slf4j
public class BPACustomDecorator {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper mapper;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;

	// EDCR Service
	@Value("${egov.edcr.host}")
	private String edcrHost;

	@Value("${egov.edcr.authtoken.endpoint}")
	private String edcrAuthEndPoint;

	@Value("${egov.edcr.getPlan.endpoint}")
	private String getPlanEndPoint;

	//BPA Service
	@Value("${egov.bpa.host}")
	private String bpaHost;

	@Value("${egov.bpa.search.endpoint}")
	private String bpaEndpoint;

	/**
	 * Transforms data
	 * 
	 * @param bpaRequest
	 * @return
	 */
	public EnrichedBPARequest transformData(BPARequest bpaRequest){
		List<EnrichedUnit> enrichedUnitList = new ArrayList<>();
        Double plotAreaApproved=null;

		//fetching plotArea after approval based on approval number
		if(bpaRequest.getBPA().getStatus().equals("APPROVED"))
		{
			log.info("Fetching Approved Plot Area ");
			String edcrnumber = fetchPermitNumber(bpaRequest.getRequestInfo(),bpaRequest.getBPA());
			plotAreaApproved = getEDCRDetails(edcrnumber,bpaRequest.getRequestInfo(),bpaRequest.getBPA());
		}

		for(Unit unit:bpaRequest.getBPA().getLandInfo().getUnit())
		{
			//Converting comma separated string value to set
			String[] usageCategory = unit.getUsageCategory().split(",");
			Set<String> usageCategorySet = new HashSet<>(Arrays.asList(usageCategory));

			//fetching occupancy type based on suboccupancy type
			Set<String> occupancyType = fetchOccupancyCode(bpaRequest.getRequestInfo(),bpaRequest.getBPA().getTenantId(),usageCategory);
			occupancyType = fetchOccupancyNames(bpaRequest.getRequestInfo(),bpaRequest.getBPA().getTenantId(),occupancyType);

			EnrichedUnit enrichedUnit = EnrichedUnit.builder()
					.id(unit.getId())
					.tenantId(unit.getTenantId())
					.floorNo(unit.getFloorNo())
					.unitType(unit.getUnitType())
					.usageCategory(usageCategorySet)
					.occupancyType(occupancyType)
					.occupancyDate(unit.getOccupancyDate())
					.additionalDetails(unit.getAdditionalDetails())
					.additionalDetails(unit.getAuditDetails())
					.build();

			enrichedUnitList.add(enrichedUnit);
		}

		EnrichedLandInfo enrichedLandInfo = EnrichedLandInfo.builder()
				.id(bpaRequest.getBPA().getLandInfo().getId())
				.landUId(bpaRequest.getBPA().getLandInfo().getLandUId())
				.landUniqueRegNo(bpaRequest.getBPA().getLandInfo().getLandUniqueRegNo())
				.tenantId(bpaRequest.getBPA().getLandInfo().getTenantId())
				.status(bpaRequest.getBPA().getLandInfo().getStatus())
				.address(bpaRequest.getBPA().getLandInfo().getAddress())
				.ownershipCategory(bpaRequest.getBPA().getLandInfo().getOwnershipCategory())
				.owners(bpaRequest.getBPA().getLandInfo().getOwners())
				.institution(bpaRequest.getBPA().getLandInfo().getInstitution())
				.source(bpaRequest.getBPA().getLandInfo().getSource())
				.channel(bpaRequest.getBPA().getLandInfo().getChannel())
				.documents(bpaRequest.getBPA().getLandInfo().getDocuments())
				.unit(enrichedUnitList)
				.additionalDetails(bpaRequest.getBPA().getLandInfo().getAdditionalDetails())
				.auditDetails(bpaRequest.getBPA().getLandInfo().getAuditDetails())
				.plotAreaApproved(plotAreaApproved)
				.build();

		BPA bpa = bpaRequest.getBPA();
		EnrichedBPA enrichedBPA = EnrichedBPA.builder()
				.id(bpa.getId())
				.applicationNo(bpa.getApplicationNo())
				.accountId(bpa.getAccountId())
				.edcrNumber(bpa.getEdcrNumber())
				.riskType(bpa.getRiskType())
				.businessService(bpa.getBusinessService())
				.approvalNo(bpa.getApprovalNo())
				.landId(bpa.getLandId())
				.tenantId(bpa.getTenantId())
				.approvalDate((bpa.getApprovalDate()))
				.applicationDate(bpa.getApplicationDate())
				.status(bpa.getStatus())
				.documents(bpa.getDocuments())
				.landInfo(enrichedLandInfo)
				.workflow(bpa.getWorkflow())
				.auditDetails(bpa.getAuditDetails())
				.additionalDetails(bpa.getAdditionalDetails())
				.build();

        EnrichedBPARequest enrichedBPARequest = EnrichedBPARequest.builder()
				.BPA(enrichedBPA)
				.requestInfo(bpaRequest.getRequestInfo())
				.build();

		return enrichedBPARequest;
	}

	/**
	 * fetch the bpa details from the approval number
	 * @param requestInfo
	 * @param bpa
	 * @return
	 */
	public String fetchPermitNumber(RequestInfo requestInfo, BPA bpa)
	{
		StringBuilder uri = new StringBuilder(bpaHost);
		uri.append(bpaEndpoint);
		uri.append("?").append("tenantId=").append(bpa.getTenantId());
		uri.append("&").append("approvalNo=").append(bpa.getApprovalNo());

		Map<String, Object> apiRequest = new HashMap<>();
		apiRequest.put("RequestInfo", requestInfo);
		String edcrNumber="";

		RequestInfo bpaRequestInfo = new RequestInfo();
		BeanUtils.copyProperties(requestInfo, bpaRequestInfo);
		LinkedHashMap responseMap = null;
		try {
			responseMap = (LinkedHashMap) fetchResult(uri,
					new RequestInfoWrapper(bpaRequestInfo));
		} catch (Exception e) {
			log.error("Exception while fetching edcr number from bpa response ",e);
		}

		if (CollectionUtils.isEmpty(responseMap)) {
			log.error("The response from BPA service is empty or null");
			return "";
		}

		String jsonString = new JSONObject(responseMap).toString();
		DocumentContext context = JsonPath.using(Configuration.defaultConfiguration()).parse(jsonString);
		edcrNumber = context.read("BPA[0].edcrNumber");

		return edcrNumber;
	}

	/**
	 * fetch the edcr details from the bpa
	 * @param requestInfo
	 * @param bpa
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public Double getEDCRDetails(String edcrNo, RequestInfo requestInfo, BPA bpa) {
		StringBuilder uri = new StringBuilder(edcrHost);
		Double plotArea=null;

		uri.append(getPlanEndPoint);
		uri.append("?").append("tenantId=").append(bpa.getTenantId());
		uri.append("&").append("edcrNumber=").append(edcrNo);

		RequestInfo edcrRequestInfo = new RequestInfo();
		BeanUtils.copyProperties(requestInfo, edcrRequestInfo);
		LinkedHashMap responseMap = null;
		try {
			responseMap = (LinkedHashMap) fetchResult(uri,
					new RequestInfoWrapper(edcrRequestInfo));
		} catch (Exception e) {
			log.error("Exception while fetching plot area from edcr response ",e);
		}
		if (CollectionUtils.isEmpty(responseMap)) {
			log.error("The response from BPA service is empty or null");
			return null;
		}
		String jsonString = new JSONObject(responseMap).toString();
		DocumentContext context = JsonPath.using(Configuration.defaultConfiguration()).parse(jsonString);
		plotArea = context.read("edcrDetail[0].planDetail.virtualBuilding.totalBuitUpArea");

		return plotArea;
	}


	public Set<String> fetchOccupancyCode(RequestInfo requestInfo, String tenantId, String[] usageCategory){
		Set<String> occupancyType = new HashSet<>();

		JSONArray jsonarray = null;

		StringBuilder uri = new StringBuilder();
		uri.append(mdmsHost).append(mdmsEndpoint);
		if(StringUtils.isEmpty(tenantId))
			return occupancyType;

		MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForSubOccupancyType(requestInfo, tenantId.split("\\.")[0]);
		try {
			Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
			for(String subOccupancyType : usageCategory)
			{
				Filter masterDataFilter = filter(
						where("code").is(subOccupancyType));
				jsonarray = JsonPath.parse(response).read("$.MdmsRes.BPA.SubOccupancyType[?]",masterDataFilter);
				LinkedHashMap map = (LinkedHashMap) jsonarray.get(0);
				occupancyType.add((String) map.get("occupancyType"));
			}
		}catch(Exception e) {
			log.error("Exception while fetching mdms response ",e);
		}
		return occupancyType;
	}

	private MdmsCriteriaReq getMdmsRequestForSubOccupancyType(RequestInfo requestInfo, String tenantId){
		MasterDetail masterDetail = new MasterDetail();
		masterDetail.setName("SubOccupancyType");
		List<MasterDetail> masterDetailList = new ArrayList<>();
		masterDetailList.add(masterDetail);

		ModuleDetail moduleDetail = new ModuleDetail();
		moduleDetail.setMasterDetails(masterDetailList);
		moduleDetail.setModuleName("BPA");
		List<ModuleDetail> moduleDetailList = new ArrayList<>();
		moduleDetailList.add(moduleDetail);

		MdmsCriteria mdmsCriteria = new MdmsCriteria();
		mdmsCriteria.setTenantId(tenantId);
		mdmsCriteria.setModuleDetails(moduleDetailList);

		MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
		mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
		mdmsCriteriaReq.setRequestInfo(requestInfo);

		return mdmsCriteriaReq;
	}

	public Set<String> fetchOccupancyNames(RequestInfo requestInfo, String tenantId, Set<String> occupancyType){
		Set<String> finalOccupancyType = new HashSet<>();
		JSONArray jsonarray = null;

		StringBuilder uri = new StringBuilder();
		uri.append(mdmsHost).append(mdmsEndpoint);
		if(StringUtils.isEmpty(tenantId))
			return occupancyType;

		MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForOccupancyType(requestInfo, tenantId.split("\\.")[0]);
		try {
			Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
			for(String occupancyTypeCode : occupancyType)
			{
				Filter masterDataFilter = filter(
						where("code").is(occupancyTypeCode));
				jsonarray = JsonPath.parse(response).read("$.MdmsRes.BPA.OccupancyType[?]",masterDataFilter);
				LinkedHashMap map = (LinkedHashMap) jsonarray.get(0);
				finalOccupancyType.add((String) map.get("name"));
			}
		}catch(Exception e) {
			log.error("Exception while fetching mdms response ",e);
		}
		return finalOccupancyType;
	}

	private MdmsCriteriaReq getMdmsRequestForOccupancyType(RequestInfo requestInfo, String tenantId){
		MasterDetail masterDetail = new MasterDetail();
		masterDetail.setName("OccupancyType");
		List<MasterDetail> masterDetailList = new ArrayList<>();
		masterDetailList.add(masterDetail);

		ModuleDetail moduleDetail = new ModuleDetail();
		moduleDetail.setMasterDetails(masterDetailList);
		moduleDetail.setModuleName("BPA");
		List<ModuleDetail> moduleDetailList = new ArrayList<>();
		moduleDetailList.add(moduleDetail);

		MdmsCriteria mdmsCriteria = new MdmsCriteria();
		mdmsCriteria.setTenantId(tenantId);
		mdmsCriteria.setModuleDetails(moduleDetailList);

		MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
		mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
		mdmsCriteriaReq.setRequestInfo(requestInfo);

		return mdmsCriteriaReq;
	}

	/**
	 * fetchResult form the different services based on the url and request object
	 * @param uri
	 * @param request
	 * @return
	 */
	public Object fetchResult(StringBuilder uri, Object request) {
		Object response = null;
		log.debug("URI: " + uri.toString());
		try {
			log.debug("Request: " + mapper.writeValueAsString(request));
			response = restTemplate.postForObject(uri.toString(), request, Map.class);
		} catch (HttpClientErrorException e) {
			log.error("External Service threw an Exception: ", e);
			throw new ServiceCallException(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error("Exception while fetching from searcher: ", e);
			throw new ServiceCallException(e.getMessage());
		}

		return response;
	}
}
