/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any Long of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.mdms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.receipt.consumer.model.BusinessService;
import org.egov.receipt.consumer.model.FinanceMdmsModel;
import org.egov.receipt.consumer.model.FinancialStatus;
import org.egov.receipt.consumer.model.InstrumentContract;
import org.egov.receipt.consumer.model.InstrumentGlCodeMapping;
import org.egov.receipt.consumer.model.InstrumentResponse;
import org.egov.receipt.consumer.model.InstrumentSearchContract;
import org.egov.receipt.consumer.model.MasterDetail;
import org.egov.receipt.consumer.model.MdmsCriteria;
import org.egov.receipt.consumer.model.MdmsCriteriaReq;
import org.egov.receipt.consumer.model.ModuleDetail;
import org.egov.receipt.consumer.model.OnlineGLCodeMapping;
import org.egov.receipt.consumer.model.ProcessStatus;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.RequestInfoWrapper;
import org.egov.receipt.consumer.model.TaxHeadMaster;
import org.egov.receipt.consumer.model.Tenant;
import org.egov.receipt.consumer.repository.ServiceRequestRepository;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.egov.reciept.consumer.config.PropertiesManager;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

@Service
public class MicroServiceUtilImpl implements MicroServiceUtil{
	private static final String FIN_MODULE_NAME = "FinanceModule";
	private static final String BILLSERVICE_MODULE_NAME = "BillingService";
	private static final String FINANCE_CODE = "Finance";
	private static final Object ONLINE_INSTRUMENT_TYPE = "Online";
	private static final String BUSINESS_SERVICE_MAPP_MASTER = "BusinessServiceMapping";
	private static final String TAX_HEAD_MAPP_MASTER = "TaxHeadMasterGlCodeMapping";
	private static final String INSTRUMENT_GLCODE_MAPP_MASTER = "InstrumentGLcodeMapping";
	private static final String FIN_INSTRUMENT_STATUS_MAPP_MASTER = "FinanceInstrumentStatusMapping";
	private static final String ONLINE_GLCODE_MAPP_MASTER = "OnlineGLCodeMapping";
	private static final String BUSINESS_SERVICE_MASTER = "BusinessService";
	private static final String CITY_MODULE_MASTER = "citymodule";
	private static final String TENANT_MODULE_NAME = "tenant";
	@Autowired
	private PropertiesManager manager;
	@Autowired
	private MdmsCriteria mdmscriteria;
	@Autowired
	private MdmsCriteriaReq mdmsrequest;
	@Autowired
	private ObjectMapper mapper;
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Override
	public List<BusinessService> getBusinessService(String tenantId, String code, RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws VoucherCustomException{
		if(finSerMdms.getFinanceServiceMdmsData() == null){
			this.getFinanceServiceMdmsData(tenantId, code, requestInfo, finSerMdms);
		}
		List<BusinessService> list = new ArrayList<>();
		try {
			if(finSerMdms.getFinanceServiceMdmsData() != null){
				list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.FinanceModule.BusinessServiceMapping"),new TypeReference<List<BusinessService>>(){});
			}			
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"Error while parsing mdms data. Check the business/account head mapping json file.");
		}
		return list;
	}
	
	@Override
	public List<TaxHeadMaster> getTaxHeadMasters(String tenantId,String code, RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws VoucherCustomException {
		if(finSerMdms.getFinanceServiceMdmsData() == null){
			this.getFinanceServiceMdmsData(tenantId, code, requestInfo, finSerMdms);
		}
		List<TaxHeadMaster> list = new ArrayList<>();
		try {
			if(finSerMdms.getFinanceServiceMdmsData() != null){
				list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.FinanceModule.TaxHeadMasterGlCodeMapping"),new TypeReference<List<TaxHeadMaster>>(){});
			}			
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"Error while parsing mdms data for TaxHeadMasterGlCodeMapping master. Check the business/account head mapping json file.");
		}
		return list;
	}
	/**
	 * 
	 * @param tenantId
	 * @param businessServiceCode
	 * @return
	 * @throws VoucherCustomException
	 * Function which is used to fetch the finance service mdms data based on Business Service code.
	 */
	public void getFinanceServiceMdmsData(String tenantId,String businessServiceCode, RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws VoucherCustomException{
		StringBuilder mdmsUrl = new StringBuilder(manager.getMdmsHostUrl()+manager.getMdmsSearchUrl());
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		this.addFinanceModule(moduleDetails, businessServiceCode);
		this.addBillingServiceModule(moduleDetails, businessServiceCode);
		this.addTenantModule(moduleDetails);
        mdmscriteria.setTenantId(tenantId);
        mdmscriteria.setModuleDetails(moduleDetails);
        mdmsrequest.setRequestInfo(requestInfo);
        mdmsrequest.setMdmsCriteria(mdmscriteria);
        try {
       		Map postForObject = mapper.convertValue(serviceRequestRepository.fetchResult(mdmsUrl, mdmsrequest, tenantId), Map.class);
       		finSerMdms.setFinanceServiceMdmsData(postForObject);
        } catch (ServiceCallException e) {
			
        } catch (Exception e) {
        	throw new VoucherCustomException(ProcessStatus.FAILED,"Error Occured While calling the URL : "+mdmsUrl);
		}
	}
	
	private void addFinanceModule(List<ModuleDetail> moduleDetails,String businessServiceCodes){
		ArrayList<MasterDetail> masterDetailsList = new ArrayList<>();
		masterDetailsList.add(new MasterDetail(BUSINESS_SERVICE_MAPP_MASTER,businessServiceCodes != null ? "[?(" + prepareFilter(businessServiceCodes,"code") + ")]" : null));
		masterDetailsList.add(new MasterDetail(TAX_HEAD_MAPP_MASTER,businessServiceCodes != null ? "[?(" + prepareFilter(businessServiceCodes,"billingservicecode") + ")]":null));
		masterDetailsList.add(new MasterDetail(INSTRUMENT_GLCODE_MAPP_MASTER,null));
		masterDetailsList.add(new MasterDetail(FIN_INSTRUMENT_STATUS_MAPP_MASTER,null));
		masterDetailsList.add(new MasterDetail(ONLINE_GLCODE_MAPP_MASTER,businessServiceCodes != null ? "[?(" + prepareFilter(businessServiceCodes,"servicecode") + ")]" : null));
		moduleDetails.add(new ModuleDetail(FIN_MODULE_NAME, masterDetailsList));
	}
	
	private String prepareFilter(String businessServiceCodes, String key) {
		StringBuilder builder = new StringBuilder();
		if(businessServiceCodes.split(",").length <= 1){
			return builder.append("@.").append(key).append("=='").append(businessServiceCodes).append("'").toString();
		}else{
			String[] split = businessServiceCodes.split(",");
			for(String str:split){
				if(builder.toString().isEmpty()){
					builder.append("@.").append(key).append("=='").append(str).append("'");
				}else {
					builder.append(" || ").append("@.").append(key).append("=='").append(str).append("'");
				}
			}
		}
		return builder.toString();
	}

	private void addBillingServiceModule(List<ModuleDetail> moduleDetails,String businessServiceCode){
		ArrayList<MasterDetail> masterDetailsList = new ArrayList<>();
		masterDetailsList.add(new MasterDetail(BUSINESS_SERVICE_MASTER,businessServiceCode != null ? "[?(@.code=='" + businessServiceCode + "')]" : null));
		moduleDetails.add(new ModuleDetail(BILLSERVICE_MODULE_NAME, masterDetailsList));
	}
	
	private void addTenantModule(List<ModuleDetail> moduleDetails){
		ArrayList<MasterDetail> masterDetailsList = new ArrayList<>();
		masterDetailsList.add(new MasterDetail(CITY_MODULE_MASTER,"[?(@.code=='" + FINANCE_CODE + "')]"));
		moduleDetails.add(new ModuleDetail(TENANT_MODULE_NAME, masterDetailsList));
	}

	@Override
	public String getBusinessServiceName(String tenantId,String code, RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws VoucherCustomException {
		if(finSerMdms.getFinanceServiceMdmsData() == null){
			this.getFinanceServiceMdmsData(tenantId, code, requestInfo, finSerMdms);
		}
		List<BusinessService> list = new ArrayList<>();
		try {
			if(finSerMdms.getFinanceServiceMdmsData() != null){
				list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.BillingService.BusinessService"),new TypeReference<List<BusinessService>>(){});
			}
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"Error while parsing mdms data for BusinessService master. Check the business/account head mapping json file.");
		}
		return !list.isEmpty() ? list.get(0).getBusinessService() : code;
	}
	
	@Override
	public String getGlcodeByInstrumentType(String tenantId,String businessCode,RequestInfo requestInfo, FinanceMdmsModel finSerMdms,String instrumentType) throws VoucherCustomException {
		if(finSerMdms.getFinanceServiceMdmsData() == null){
			this.getFinanceServiceMdmsData(tenantId, businessCode, requestInfo, finSerMdms);
		}
		try {
			if(finSerMdms.getFinanceServiceMdmsData() != null){
				if(ONLINE_INSTRUMENT_TYPE.equals(instrumentType)){
					/* Online instrument type mapped at ULB level*/
					List<OnlineGLCodeMapping> list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.FinanceModule.OnlineGLCodeMapping"),new TypeReference<List<OnlineGLCodeMapping>>(){});
					List<OnlineGLCodeMapping> collect = list.stream().filter(inst -> inst.getServicecode().equals(businessCode)).collect(Collectors.toList());
					return !collect.isEmpty() ? collect.get(0).getGlcode() : null;
				}else{
					List<InstrumentGlCodeMapping> list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.FinanceModule.InstrumentGLcodeMapping"),new TypeReference<List<InstrumentGlCodeMapping>>(){});
					List<InstrumentGlCodeMapping> collect = list.stream().filter(inst -> inst.getInstrumenttype().equalsIgnoreCase(instrumentType)).collect(Collectors.toList());
					return !collect.isEmpty() ? collect.get(0).getGlcode() : null;
				}
			}
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"Error while parsing mdms data for InstrumentGLcodeMapping/OnlineGLCodeMapping master. Check the business/account head mapping json file.");
		}
		return null;
	}
	
	@Override
	public FinancialStatus getFinancialStatusByCode(String tenantId,RequestInfo requestInfo, FinanceMdmsModel finSerMdms,String statusCode) throws VoucherCustomException {
		if(finSerMdms.getFinanceServiceMdmsData() == null){
			this.getFinanceServiceMdmsData(tenantId, null, requestInfo, finSerMdms);
		}
		List<FinancialStatus> list = new ArrayList<>();
		try {
			if(finSerMdms.getFinanceServiceMdmsData() != null){
				list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.FinanceModule.FinanceInstrumentStatusMapping"),new TypeReference<List<FinancialStatus>>(){});
			}
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"Error while parsing mdms data for EgfInstrumentStatusMapping master. Check the EgfInstrumentStatusMapping.json file.");
		}
		List<FinancialStatus> collect = list.stream().filter(fs -> fs.getCode().equals(statusCode)).collect(Collectors.toList());
		return !collect.isEmpty() ? collect.get(0) : null;
	}
	
	@Override
	public List<Tenant> getFinanceTenantList(String tenantId, String businessCode,RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws VoucherCustomException{
		if(finSerMdms.getFinanceServiceMdmsData() == null){
			this.getFinanceServiceMdmsData(tenantId, businessCode, requestInfo, finSerMdms);
		}
		List<Tenant> list = null;
		try {
			if(finSerMdms.getFinanceServiceMdmsData() != null){
				list = mapper.convertValue(JsonPath.read(finSerMdms.getFinanceServiceMdmsData(), "$.MdmsRes.tenant.citymodule[0].tenants"),new TypeReference<List<Tenant>>(){});
			}
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"Error while parsing mdms data for CityModule master. Check the CityModule.json file.");
		}
		return list;
	}
	
	@Override
	public List<InstrumentContract> getInstruments(InstrumentSearchContract instrumentSearchContract, RequestInfo requestInfo, String tenantId) throws VoucherCustomException {
		StringBuilder uri = new StringBuilder(manager.getInstrumentHostUrl()).append(manager.getInstrumentSearch());
		uri.append("?tenantId=").append(tenantId);
		if(instrumentSearchContract.getReceiptIds() != null && !instrumentSearchContract.getReceiptIds().isEmpty()){
			uri.append("&receiptIds=").append(instrumentSearchContract.getReceiptIds());
		}
		InstrumentResponse instrumentResponse = mapper.convertValue(serviceRequestRepository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build(), tenantId), InstrumentResponse.class);
		return instrumentResponse != null ? instrumentResponse.getInstruments() : null;
	}
	
}
