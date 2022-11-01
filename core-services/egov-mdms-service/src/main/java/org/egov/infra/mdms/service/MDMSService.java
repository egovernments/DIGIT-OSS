package org.egov.infra.mdms.service;

import java.io.ByteArrayInputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.egov.MDMSApplicationRunnerImpl;
import org.egov.mdms.model.District;
import org.egov.mdms.model.Khasra;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.mdms.model.Must;
import org.egov.mdms.model.Owner;
import org.egov.mdms.model.Tehsil;
import org.egov.mdms.model.Village;
import org.jamabandi.LRDataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

@Service
@Slf4j
public class MDMSService {

	/**
	 * Service method to collect master data from tenantIdMap and apply filter as
	 * per the request
	 * 
	 * @param mdmsCriteriaReq
	 * @return Map<String, Map<String, JSONArray>> masterData
	 */

	LRDataService service;
	@Value("${jamabandi.service.url}")
	public String serviceURl;
	@Value("${jamabandi.service.key}")
	public String key;
	@Value("${jamabandi.service.sCode}")
	public String stateCode;

	public Map<String, Map<String, JSONArray>> searchMaster(MdmsCriteriaReq mdmsCriteriaReq) {

		Map<String, Map<String, Map<String, JSONArray>>> tenantIdMap = MDMSApplicationRunnerImpl.getTenantMap();

		String tenantId = mdmsCriteriaReq.getMdmsCriteria().getTenantId();
		log.info(" 	 : " + tenantId);

		/*
		 * local tenantId replica for backtracking to parent tenant when child tenant is
		 * empty
		 */
		String tenantIdWithData = tenantId;

		int countOfSubTenant = StringUtils.countOccurrencesOf(tenantId, ".");
		Map<String, Map<String, JSONArray>> tenantData = tenantIdMap.get(tenantId);
		Map<String, Map<String, JSONArray>> responseMap = new HashMap<>();

		/*
		 * if the tenantId doesn't contain a separator
		 */
		if (countOfSubTenant == 0) {

			if (tenantData != null) {
				getDataForTenatId(mdmsCriteriaReq, tenantIdWithData, responseMap);
			}
		} else {
			/*
			 * if the tenantId contains separator, it will be backtracked until a tenant
			 * with data is found
			 */
			for (int i = countOfSubTenant; i >= 0; i--) {

				/*
				 * pick new tenantId data only from the second loop
				 */
				if (i < countOfSubTenant)
					tenantData = tenantIdMap.get(tenantIdWithData);

				if (tenantData == null) {
					/*
					 * trim the tenantId by "." separator to take the parent tenantId
					 */
					tenantIdWithData = tenantIdWithData.substring(0, tenantIdWithData.lastIndexOf("."));
				} else {
					getDataForTenatId(mdmsCriteriaReq, tenantIdWithData, responseMap);
					break;
				}
			}
		}
		return responseMap;
	}

	/**
	 * method to filter module & master data from the given tenantId data
	 * 
	 * @param mdmsCriteriaReq
	 * @param tenantId
	 * @param responseMap
	 */
	public void getDataForTenatId(MdmsCriteriaReq mdmsCriteriaReq, String tenantId,
			Map<String, Map<String, JSONArray>> responseMap) {

		List<ModuleDetail> moduleDetails = mdmsCriteriaReq.getMdmsCriteria().getModuleDetails();
		for (ModuleDetail moduleDetail : moduleDetails) {

			List<MasterDetail> masterDetails = moduleDetail.getMasterDetails();
			Map<String, JSONArray> finalMasterMap = new HashMap<>();

			for (MasterDetail masterDetail : masterDetails) {

				JSONArray masterData = null;
				try {
					masterData = getMasterDataFromTenantData(moduleDetail.getModuleName(), masterDetail.getName(),
							tenantId);
				} catch (Exception e) {
					log.error("Exception occurred while reading master data", e);
				}

				if (masterData == null)
					continue;

				if (masterDetail.getFilter() != null)
					masterData = filterMaster(masterData, masterDetail.getFilter());

				finalMasterMap.put(masterDetail.getName(), masterData);
			}
			responseMap.put(moduleDetail.getModuleName(), finalMasterMap);
		}
	}

	/**
	 * Method to collect master data from module data Automatically backtracks to
	 * parent tenant if data is not found for the master for the given tenantId
	 * 
	 * @param moduleName
	 * @param masterName
	 * @param tenantId
	 * @return {@link JSONArray} jsonArray
	 * @throws Exception
	 */
	private JSONArray getMasterDataFromTenantData(String moduleName, String masterName, String tenantId)
			throws Exception {

		JSONArray jsonArray = null;
		/*
		 * local tenantId for backtracking parent tenant if data not available for given
		 * master
		 */
		String localTenantId = tenantId;
		Map<String, Map<String, Map<String, JSONArray>>> tenantIdMap = MDMSApplicationRunnerImpl.getTenantMap();
		Map<String, Map<String, JSONArray>> data;

		int subTenatCount = StringUtils.countOccurrencesOf(tenantId, ".");

		for (int i = subTenatCount; i >= 0; i--) {

			data = tenantIdMap.get(localTenantId);
			if (data.get(moduleName) != null && data.get(moduleName).get(masterName) != null) {
				jsonArray = data.get(moduleName).get(masterName);
				/*
				 * break and stop backtracking if data is found
				 */
				break;
			} else {
				/*
				 * trim the tenantId by "." separator to take the parent tenantId
				 */
				localTenantId = localTenantId.substring(0, localTenantId.lastIndexOf("."));
			}
		}

		log.info("ModuleName.... " + moduleName + " : MasterName.... " + masterName);
		return jsonArray;
	}

	/*
	 * Disabled isStateLevel tenant key and enabled backtracking for data true by
	 * default
	 */

//	public Boolean isMasterBacktracingEnabled(String moduleName, String masterName) {
//		Map<String, Map<String, Object>> masterConfigMap = MDMSApplicationRunnerImpl.getMasterConfigMap();
//
//		Map<String, Object> moduleData = masterConfigMap.get(moduleName);
//		Boolean isStateLevel = false;
//
//		Object masterData = null;
//		if (moduleData != null)
//			masterData = moduleData.get(masterName);
//
//		if (null != masterData) {
//			try {
//				isStateLevel = JsonPath.read(mapper.writeValueAsString(masterData), MDMSConstants.STATE_LEVEL_JSONPATH);
//			} catch (Exception e) {
//				log.error("isStateLevelEnabled field missing default false value will be set");
//			}
//		}
//		return isStateLevel;
//	}

	public JSONArray filterMaster(JSONArray masters, String filterExp) {
		JSONArray filteredMasters = JsonPath.read(masters, filterExp);
		return filteredMasters;
	}

	/**
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<District> getDistrict() throws Exception {

		List<District> districts = new ArrayList<District>();
		log.info("Service URL" + serviceURl);
		service = new LRDataService(new URL(serviceURl));
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;

		db = dbf.newDocumentBuilder();
		ByteArrayInputStream is = new ByteArrayInputStream(
				service.getLRDataServiceSoap().getDistrict(key, stateCode).getBytes());
		Document doc = db.parse(is);

		log.info("Number of districts\t" + doc.getDocumentElement().getElementsByTagName("Districts").getLength());

		NodeList nodeList = doc.getElementsByTagName("Districts");
		NodeList nodeList1 = null;
		District district = null;
		for (int i = 0; i < nodeList.getLength(); i++) {
			nodeList1 = nodeList.item(i).getChildNodes();
			district = new District();

			district.setDistrictCode(nodeList1.item(1).getTextContent());
			district.setDistrictName(nodeList1.item(0).getTextContent());
			if (nodeList1.item(2) != null)
				district.setCensusCode(nodeList1.item(2).getTextContent());

			districts.add(district);

		}
		return districts;

	}

	/**
	 * 
	 * @param DistrictCode
	 * @return
	 * @throws Exception
	 */
	public List<Tehsil> getTehsil(String DistrictCode) throws Exception {

		List<Tehsil> tehsils = new ArrayList<Tehsil>();
		log.info("Service URL" + serviceURl);
		service = new LRDataService(new URL(serviceURl));
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;

		db = dbf.newDocumentBuilder();
		ByteArrayInputStream is = new ByteArrayInputStream(
				service.getLRDataServiceSoap().getTehsil(key, stateCode, DistrictCode).getBytes());
		Document doc = db.parse(is);

		log.info("Number of Tehsils\t" + doc.getDocumentElement().getElementsByTagName("Tehsils").getLength());

		NodeList nodeList = doc.getElementsByTagName("Tehsils");
		NodeList nodeList1 = null;
		Tehsil tehsil = null;
		for (int i = 0; i < nodeList.getLength(); i++) {
			nodeList1 = nodeList.item(i).getChildNodes();
			tehsil = new Tehsil();

			tehsil.setCode(nodeList1.item(1).getTextContent());
			tehsil.setName(nodeList1.item(0).getTextContent());
			if (nodeList1.item(2) != null)
				tehsil.setCensusCode(nodeList1.item(2).getTextContent());

			tehsils.add(tehsil);

		}
		return tehsils;

	}

	/**
	 * \
	 * 
	 * @param dCode
	 * @param tCode
	 * @return
	 * @throws Exception
	 */
	public List<Village> getVillages(String dCode, String tCode) throws Exception {

		List<Village> villages = new ArrayList<Village>();
		log.info("Service URL" + serviceURl);
		service = new LRDataService(new URL(serviceURl));
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;

		db = dbf.newDocumentBuilder();
		ByteArrayInputStream is = new ByteArrayInputStream(
				service.getLRDataServiceSoap().getVillages(key, stateCode, dCode, tCode).getBytes());
		Document doc = db.parse(is);

		log.info("Number of Villages \t" + doc.getDocumentElement().getElementsByTagName("Villages").getLength());

		NodeList nodeList = doc.getElementsByTagName("Villages");
		NodeList nodeList1 = null;
		Village village = null;
		for (int i = 0; i < nodeList.getLength(); i++) {
			nodeList1 = nodeList.item(i).getChildNodes();
			village = new Village();

			village.setCode(nodeList1.item(1).getTextContent());
			village.setName(nodeList1.item(0).getTextContent());

			village.setKhewats(nodeList1.item(2).getTextContent());
			village.setKhatonis(nodeList1.item(3).getTextContent());
			village.setKhasras(nodeList1.item(4).getTextContent());

			villages.add(village);

		}
		return villages;

	}

	/**
	 * 
	 * @param dCode
	 * @param tCode
	 * @param NVCode
	 * @return
	 * @throws Exception
	 */

	public Must getMurabaByNVCODE(String dCode, String tCode, String NVCode) throws Exception {

		Must must = new Must();
		log.info("Service URL" + serviceURl);
		service = new LRDataService(new URL(serviceURl));
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;

		db = dbf.newDocumentBuilder();
		ByteArrayInputStream is = new ByteArrayInputStream(
				service.getLRDataServiceSoap().getMurabaByNVCODE(key, dCode, tCode, NVCode).getBytes());
		Document doc = db.parse(is);

		log.info("Number of Must\t" + doc.getDocumentElement().getElementsByTagName("must").getLength());

		NodeList nodeList = doc.getElementsByTagName("must");
		NodeList nodeList1 = null;
		List<String> musts = new ArrayList<String>();
		for (int i = 0; i < nodeList.getLength(); i++) {
			nodeList1 = nodeList.item(i).getChildNodes();
			musts.add(nodeList1.item(0).getTextContent());

		}
		must.setMust(musts);
		return must;

	}

	/**
	 * 
	 * @param dCode
	 * @param tCode
	 * @param NVCode
	 * @param muraba
	 * @return
	 * @throws Exception
	 */
	public List<Khasra> getKhasraListByNVCODE(String dCode, String tCode, String NVCode, String muraba)
			throws Exception {

		List<Khasra> Khasras = new ArrayList<Khasra>();
		log.info("Service URL" + serviceURl);
		service = new LRDataService(new URL(serviceURl));
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;

		db = dbf.newDocumentBuilder();
		ByteArrayInputStream is = new ByteArrayInputStream(
				service.getLRDataServiceSoap().getKhasraListByNVCODE(key, dCode, tCode, NVCode, muraba).getBytes());
		Document doc = db.parse(is);

		log.info("Number of khasra \t" + doc.getDocumentElement().getElementsByTagName("khasra").getLength());

		NodeList nodeList = doc.getElementsByTagName("khasra");
		NodeList nodeList1 = null;
		Khasra khasra = null;
		for (int i = 0; i < nodeList.getLength(); i++) {
			nodeList1 = nodeList.item(i).getChildNodes();

			khasra = new Khasra();
			khasra.setKhewats(nodeList1.item(0).getTextContent());
			khasra.setKhatonis(nodeList1.item(1).getTextContent());
			khasra.setKilla(nodeList1.item(2).getTextContent());
			khasra.setKnl(nodeList1.item(3).getTextContent());
			khasra.setMrl(nodeList1.item(4).getTextContent());
			khasra.setPeriod(nodeList1.item(5).getTextContent());
			khasra.setGovt(nodeList1.item(6).getTextContent());

			Khasras.add(khasra);

		}
		return Khasras;

	}

	/**
	 * 
	 * @param dCode
	 * @param tCode
	 * @param NVCode
	 * @param _Khewat
	 * @return
	 * @throws Exception
	 */
	public List<Owner> getOwnersbykhewatOnline(String dCode, String tCode, String NVCode, String _Khewat)
			throws Exception {

		List<Owner> owners = new ArrayList<Owner>();
		log.info("Service URL" + serviceURl);
		service = new LRDataService(new URL(serviceURl));
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;

		db = dbf.newDocumentBuilder();
		ByteArrayInputStream is = new ByteArrayInputStream(
				service.getLRDataServiceSoap().getOwnersbykhewatOnline(key, dCode, tCode, NVCode, _Khewat).getBytes());
		Document doc = db.parse(is);

		log.info("Number of DistrictCode\t" + doc.getDocumentElement().getElementsByTagName("root").getLength());

		NodeList nodeList = doc.getElementsByTagName("root");
		NodeList nodeList1 = null;
		Owner owner = null;
		for (int i = 0; i < nodeList.getLength(); i++) {
			nodeList1 = nodeList.item(i).getChildNodes();

			owner = new Owner();
			owner.setCkhewat(nodeList1.item(2).getTextContent());
			owner.setName(nodeList1.item(0).getTextContent());
			log.info(nodeList1.item(0).getTextContent()
);			owner.setNvCode(nodeList1.item(1).getTextContent());

			owners.add(owner);

		}
		return owners;

	}

}