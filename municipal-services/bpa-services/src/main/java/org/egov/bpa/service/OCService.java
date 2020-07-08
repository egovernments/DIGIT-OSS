package org.egov.bpa.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.egov.bpa.config.BPAConfiguration;
import org.egov.bpa.repository.ServiceRequestRepository;
import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.util.BPAErrorConstants;
import org.egov.bpa.util.BPAUtil;
import org.egov.bpa.web.model.BPARequest;
import org.egov.bpa.web.model.BPASearchCriteria;
import org.egov.bpa.web.model.edcr.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.JsonPath;

@Service
public class OCService {

	@Autowired
	private BPAConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private BPAUtil util;

	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	public void validateAdditionalData(BPARequest bpaRequest, BPASearchCriteria criteria) {
		// getting data from edcr nos and saving both the edcr details in array
		// with name data
		org.egov.common.contract.request.RequestInfo requestInfo = bpaRequest.getRequestInfo();
		String OcEdcr = bpaRequest.getBPA().getEdcrNumber(); 
		String num = criteria.getEdcrNumber();
		ArrayList<String> edcrNos = new ArrayList<String>();
		edcrNos.add(OcEdcr);
		edcrNos.add(num);
		RequestInfo edcrRequestInfo = new RequestInfo();
		// LinkedHashMap response = null;
		ArrayList<LinkedHashMap<String, Object>> data = new ArrayList<LinkedHashMap<String, Object>>();
		edcrNos.forEach(edcrNo -> {
			StringBuilder uri = new StringBuilder(config.getEdcrHost());
			uri.append(config.getGetPlanEndPoint());
			uri.append("?").append("tenantId=").append(criteria.getTenantId());
			uri.append("&").append("edcrNumber=").append(edcrNo);
			try {
				LinkedHashMap response = (LinkedHashMap) serviceRequestRepository.fetchResult(uri,
						new org.egov.bpa.web.model.edcr.RequestInfoWrapper(edcrRequestInfo));
				data.add(response);

			} catch (Exception e) {
				e.printStackTrace();
			}
		});



		ArrayList<String> riskType = new ArrayList<String>();
		ArrayList<String> khathaNos = new ArrayList<String>();
		ArrayList<String> plotNos = new ArrayList<String>();
		ArrayList<String> occupancy = new ArrayList<String>();

		if (data.size() >= 2) {
			int i = 0;
			data.forEach(edcrDetail -> {

				String tenantId = criteria.getTenantId();
				MdmsCriteriaReq mdmsCriteriaReq = util.getMDMSRequest(requestInfo, tenantId);
				Object result = serviceRequestRepository.fetchResult(util.getMdmsSearchUrl(), mdmsCriteriaReq);
				System.out.println(result);

				ArrayList OcData = new ArrayList();
				OcData.add(JsonPath.read(result, "$.MdmsRes.BPA.RiskTypeComputation"));

				Double buildingHeight = (Double) ((List) JsonPath.read(edcrDetail, "$.edcrDetail.*.planDetail.blocks.*.building.buildingHeight")).get(0);
				Double plotArea = (Double) ((List) JsonPath.read(edcrDetail, "$.edcrDetail.*.planDetail.plot.area")).get(0);

//				plotArea.add();

//				buildingHeight.add();


				String filterExp = "$.[?((@.fromPlotArea < " + plotArea + " && @.toPlotArea >= " + plotArea
						+ ") || ( @.fromBuildingHeight < " + buildingHeight + "  &&  @.toBuildingHeight >= "
						+ buildingHeight + "  ))].riskType";

				List<String> riskTypes = JsonPath.read(OcData.get(0), filterExp);
				riskType.add(riskTypes.get(0));

				khathaNos.add(JsonPath.read(edcrDetail, BPAConstants.OC_KHATHANO));

				plotNos.add(JsonPath.read(edcrDetail, BPAConstants.OC_PLOTNO));
				// get occupancy

				occupancy.add(JsonPath.read(edcrDetail, BPAConstants.OC_OCCUPANCY));

			});


			if (riskType.size() > 1) {
				if(riskType.get(1).equalsIgnoreCase("LOW")){
					if(!riskType.get(0).equalsIgnoreCase("LOW")){
						throw new CustomException(BPAErrorConstants.INVALID_CREATE,
								"Risk type from BPA edcr is not matching with the Risk type from occupancy certificate edcr. You cannot proceed with the application");
					}

				}else if(riskType.get(1).equalsIgnoreCase("MEDIUM")){
					if(riskType.get(0).equalsIgnoreCase("HIGH")){
						throw new CustomException(BPAErrorConstants.INVALID_CREATE,
								"Risk type from BPA edcr is not matching with the Risk type from occupancy certificate edcr. You cannot proceed with the application");
					}
				}
			}
				if (khathaNos.size() > 1) {
					if (!khathaNos.get(0).equalsIgnoreCase(khathaNos.get(1))) {
						throw new CustomException(BPAErrorConstants.INVALID_CREATE,
								"Khata number from BPA edcr is not matching with the khata number from occupancy certificate edcr. You cannot proceed with the application");
					}

				}
				if (plotNos.size() > 1) {
					if (!plotNos.get(0).equalsIgnoreCase(plotNos.get(1))) {
							throw new CustomException(BPAErrorConstants.INVALID_CREATE,
									"plot number from BPA edcr is not matching with the plot number from occupancy certificate edcr. You cannot proceed with the application");
					}
				}
				if (occupancy.size() > 1) {
					if (!occupancy.get(0).equalsIgnoreCase(occupancy.get(1))) {
							throw new CustomException(BPAErrorConstants.INVALID_CREATE,
									"occupancy from BPA edcr is not matching with the occupancy from occupancy certificate edcr. You cannot proceed with the application");
					}
				}

		}

	}

}
