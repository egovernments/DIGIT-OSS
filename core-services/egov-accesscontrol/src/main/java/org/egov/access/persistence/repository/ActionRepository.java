/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.access.persistence.repository;

import com.jayway.jsonpath.JsonPath;
import org.egov.access.domain.model.Action;
import org.egov.access.persistence.repository.querybuilder.ActionQueryBuilder;
import org.egov.access.persistence.repository.rowmapper.ActionSearchRowMapper;
import org.egov.access.persistence.repository.rowmapper.ModuleSearchRowMapper;
import org.egov.access.web.contract.action.ActionRequest;
import org.egov.access.web.contract.action.ActionService;
import org.egov.access.web.contract.action.Module;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.json.JSONArray;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.sql.Date;
import java.util.*;
import java.util.Map.Entry;

@Repository
public class ActionRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(ActionRepository.class);
	
	@Value("${role.mdms.filter}")
	private String roleFilter;
	@Value("${action.mdms.filter}")
	private String actionFilter;
	@Value("${action.mdms.search.filter}")
	private String actionSearchFilter;
	@Value("${egov.mdms.host}${egov.mdms.path}")
	private String url;
	@Value("${mdms.roleaction.path}")
	private String roleActionPath;
	@Value("${mdms.actions.path}")
	private String actionPath;
	
	@Value("${mdms.roleactionmodule.name}")
	private String roleActionModule;
	@Value("${mdms.actionstestmodule.name}")
	private String actionTestModule;
	@Value("${mdms.actionsmodule.name}")
	private String actionModule;
	@Value("${mdms.roleactionmaster.names}")
	private String roleActionMaster;
	@Value("${mdms.actionmaster.names}")
	private String actionMaster;
	@Value("${mdms.actionstest.path}")
	private String actionTestPath;
	
	

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Autowired
	private RestTemplate restTemplate;

	public List<Action> createAction(final ActionRequest actionRequest) {

		LOGGER.info("Create Action Repository::" + actionRequest);
		final String actionInsert = ActionQueryBuilder.insertActionQuery();

		List<Action> actions = actionRequest.getActions();

		List<Map<String, Object>> batchValues = new ArrayList<>(actions.size());
		for (Action action : actions) {
			batchValues.add(new MapSqlParameterSource("name", action.getName()).addValue("url", action.getUrl())
					.addValue("servicecode", action.getServiceCode()).addValue("queryparams", action.getQueryParams())
					.addValue("parentmodule", action.getParentModule()).addValue("ordernumber", action.getOrderNumber())
					.addValue("displayname", action.getDisplayName()).addValue("enabled", action.isEnabled())
					.addValue("createdby", Long.valueOf(actionRequest.getRequestInfo().getUserInfo().getId()))
					.addValue("lastmodifiedby", Long.valueOf(actionRequest.getRequestInfo().getUserInfo().getId()))
					.addValue("createddate", new Date(new java.util.Date().getTime()))
					.addValue("lastmodifieddate", new Date(new java.util.Date().getTime())).getValues());
		}

		namedParameterJdbcTemplate.batchUpdate(actionInsert, batchValues.toArray(new Map[actions.size()]));
		return actions;
	}

	public List<Action> updateAction(final ActionRequest actionRequest) {

		LOGGER.info("update Action Repository::" + actionRequest);
		final String actionUpdate = ActionQueryBuilder.updateActionQuery();

		List<Action> actions = actionRequest.getActions();

		List<Map<String, Object>> batchValues = new ArrayList<>(actions.size());
		for (Action action : actions) {
			batchValues.add(new MapSqlParameterSource("url", action.getUrl())
					.addValue("servicecode", action.getServiceCode()).addValue("queryparams", action.getQueryParams())
					.addValue("parentmodule", action.getParentModule()).addValue("ordernumber", action.getOrderNumber())
					.addValue("displayname", action.getDisplayName()).addValue("enabled", action.isEnabled())
					.addValue("lastmodifiedby", Long.valueOf(actionRequest.getRequestInfo().getUserInfo().getId()))
					.addValue("lastmodifieddate", new Date(new java.util.Date().getTime()))
					.addValue("name", action.getName()).getValues());
		}

		namedParameterJdbcTemplate.batchUpdate(actionUpdate, batchValues.toArray(new Map[actions.size()]));
		return actions;
	}

	public boolean checkActionNameExit(String actionName) {

		String Query = ActionQueryBuilder.checkActionNameExit();

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("name", actionName);
		SqlRowSet sqlRowSet = namedParameterJdbcTemplate.queryForRowSet(Query, parametersMap);

		if (sqlRowSet.next() && sqlRowSet.getLong("id") > 0) {

			return true;
		}

		return false;
	}

	public boolean checkCombinationOfUrlAndqueryparamsExist(String url, String queryParams) {

		String Query = ActionQueryBuilder.checkCombinationOfUrlAndqueryparamsExist();

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("url", url);
		parametersMap.put("queryparams", queryParams);

		SqlRowSet sqlRowSet = namedParameterJdbcTemplate.queryForRowSet(Query, parametersMap);

		if (sqlRowSet.next() && sqlRowSet.getLong("id") > 0) {

			return true;
		}

		return false;

	}

	private Map<String, List<Action>> getActionsQueryBuilder(ActionRequest actionRequest) {

		ActionSearchRowMapper actionRowMapper = new ActionSearchRowMapper();

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("code", actionRequest.getRoleCodes());
		parametersMap.put("tenantid", actionRequest.getTenantId());

		String query = "select id,name,displayname,servicecode,url,queryparams,enabled,parentmodule,ordernumber from eg_action action where id IN(select actionid from eg_roleaction roleaction where roleaction.rolecode IN ( select code from eg_ms_role where code in (:code)) and roleaction.tenantid =:tenantid and action.id = roleaction.actionid )";

		if (actionRequest.getEnabled() != null) {
			query = query + " and enabled =:enabled ORDER BY id ASC";
			parametersMap.put("enabled", actionRequest.getEnabled());
		} else {
			query = query + " ORDER BY id ASC";
		}

		LOGGER.info("Action Query : " + query);
		namedParameterJdbcTemplate.query(query, parametersMap, actionRowMapper);
		Map<String, List<Action>> actionMap = actionRowMapper.actionMap;

		return actionMap;
	}

	private List<Module> getServiceQueryBuilder(ActionRequest actionRequest, Map<String, List<Action>> actionMap) {

		ModuleSearchRowMapper moduleRowMapper = new ModuleSearchRowMapper();

		Set<Entry<String, List<Action>>> set = actionMap.entrySet();

		Iterator<Entry<String, List<Action>>> iterator = set.iterator();

		List<String> codes = new ArrayList<String>();

		while (iterator.hasNext()) {
			Entry<String, List<Action>> var = iterator.next();
			codes.add(var.getKey());
		}

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("codes", codes);
		parametersMap.put("tenantid", actionRequest.getTenantId());

		String query = "select id,name,code,parentmodule,displayname,enabled from service service where service.code in (:codes) and tenantid=:tenantid";

		if (actionRequest.getEnabled() != null) {
			query = query + " and enabled =:enabled ";
			parametersMap.put("enabled", actionRequest.getEnabled());
		}

		LOGGER.info("services Query : " + query);
		List<Module> modules = namedParameterJdbcTemplate.query(query, parametersMap, moduleRowMapper);

		return modules;

	}

	private List<Module> getAllServicesQueryBuilder(ActionRequest actionRequest, List<Module> moduleList) {

		StringBuilder allservicesQueryBuilder = new StringBuilder();

		ModuleSearchRowMapper moduleRowMapper = new ModuleSearchRowMapper();

		List<Long> moduleCodes = new ArrayList<>();
		for (Module module : moduleList) {
			moduleCodes.add(module.getId());
		}

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("moduleCodes", moduleCodes);
		parametersMap.put("tenantid", actionRequest.getTenantId());

		allservicesQueryBuilder.append("(WITH RECURSIVE nodes(id,code,name,parentmodule,displayname,enabled) AS ("
				+ " SELECT s1.id,s1.code, s1.name, s1.parentmodule,s1.displayname,s1.enabled"
				+ " FROM service s1 WHERE " + " id IN (:moduleCodes) UNION ALL"
				+ " SELECT s1.id,s1.code, s1.name, s1.parentmodule,s1.displayname,s1.enabled"
				+ " FROM nodes s2, service s1 WHERE CAST(s1.parentmodule as bigint) = s2.id");

		if (actionRequest.getEnabled() != null) {
			parametersMap.put("enabled", actionRequest.getEnabled());

			allservicesQueryBuilder.append(" and s1.tenantid =:tenantid and s1.enabled =:enabled )");

		} else {
			allservicesQueryBuilder.append(" and s1.tenantid = :tenantid )");
		}

		allservicesQueryBuilder.append(" SELECT * FROM nodes )" + " UNION"
				+ " (WITH RECURSIVE nodes(id,code,name,parentmodule,displayname,enabled) AS ("
				+ " SELECT s1.id,s1.code, s1.name, s1.parentmodule,s1.displayname,s1.enabled"
				+ " FROM service s1 WHERE " + " id IN (:moduleCodes) UNION ALL"
				+ " SELECT s1.id,s1.code, s1.name, s1.parentmodule,s1.displayname,s1.enabled"
				+ " FROM nodes s2, service s1 WHERE CAST(s2.parentmodule as bigint) = s1.id");
		if (actionRequest.getEnabled() != null) {
			parametersMap.put("enabled", actionRequest.getEnabled());

			allservicesQueryBuilder
					.append(" and s1.tenantid =:tenantid and s1.enabled =:enabled ) SELECT * FROM nodes )");

		} else {
			allservicesQueryBuilder.append(" and s1.tenantid = :tenantid ) SELECT * FROM nodes )");
		}

		LOGGER.info("All Services Query : " + allservicesQueryBuilder.toString());
		List<Module> allServiceList = namedParameterJdbcTemplate.query(allservicesQueryBuilder.toString(),
				parametersMap, moduleRowMapper);

		return allServiceList;
	}

	public ActionService getAllActionsBasedOnRoles(ActionRequest actionRequest) {

		ActionService service = new ActionService();

		service.setModules(new ArrayList<Module>());

		List<Module> moduleList = null;

		List<Module> allServiceList = null;

		Map<String, List<Action>> actionMap = getActionsQueryBuilder(actionRequest);

		if (actionMap.size() > 0) {

			moduleList = getServiceQueryBuilder(actionRequest, actionMap);

		}

		if (moduleList != null && moduleList.size() > 0) {

			allServiceList = getAllServicesQueryBuilder(actionRequest, moduleList);

		}

		if (allServiceList != null && allServiceList.size() > 0) {

			List<Module> rootModules = prepareListOfRootModules(allServiceList, actionMap);

			for (Module module : rootModules) {

				getSubmodule(module, allServiceList, actionMap);

			}

			removeMainModuleDoesnotExistActions(rootModules);

			service.setModules(rootModules);
		}

		return service;
	}

	private List<Module> prepareListOfRootModules(List<Module> moduleList, Map<String, List<Action>> actionMap) {

		List<Module> mainModules = new ArrayList<Module>();

		for (Module module : moduleList) {

			if (module.getParentModule() == null || module.getParentModule().isEmpty()) {

				List<Module> subModule = new ArrayList<Module>();
				if (actionMap.containsKey(module.getCode())) {

					module.setActionList(actionMap.get(module.getCode()));
				}

				module.setSubModules(subModule);

				mainModules.add(module);

			}
		}

		return mainModules;
	}

	private Module getSubmodule(Module module, List<Module> allModules, Map<String, List<Action>> actionMap) {

		if (module.getSubModules().size() != 0) {

			List<Module> subModuleList = new ArrayList<Module>();

			module.setSubModules(subModuleList);
		}

		for (Module module1 : allModules) {

			if (module.getId().toString().equals(module1.getParentModule())) {

				if (actionMap.containsKey(module.getCode())) {

					module.setActionList(actionMap.get(module.getCode()));
				}

				module.getSubModules().add(module1);

			}

		}

		if (module.getSubModules().size() != 0) {

			for (Module sub : module.getSubModules()) {

				List<Module> subModuleList = new ArrayList<Module>();

				sub.setSubModules(subModuleList);
				getSubmodule(sub, allModules, actionMap);
			}
		}

		return module;
	}

	private void removeMainModuleDoesnotExistActions(List<Module> modules) {

		if (modules.size() > 0) {

			for (int i = 0; i < modules.size(); i++) {

				if (modules.get(i).getSubModules() != null && modules.get(i).getSubModules().size() == 0
						&& modules.get(i).getActionList() == null) {

					modules.remove(i);
				}

			}
		}

	}

	public List<Action> getAllActions(ActionRequest actionRequest) {

		List<Module> moduleList = null;

		List<Module> allServiceList = null;

		Map<String, List<Action>> actionMap = getActionsQueryBuilder(actionRequest);

		if (actionMap.size() > 0) {

			moduleList = getServiceQueryBuilder(actionRequest, actionMap);

		}

		if (moduleList != null && moduleList.size() > 0) {

			allServiceList = getAllServicesQueryBuilder(actionRequest, moduleList);

		}

		List<Action> actionList = new ArrayList<Action>();

		Set<Entry<String, List<Action>>> set = actionMap.entrySet();

		Iterator<Entry<String, List<Action>>> iterator = set.iterator();

		while (iterator.hasNext()) {

			Entry<String, List<Action>> entry = iterator.next();

			List<Action> actions = entry.getValue();

			for (Action action : actions) {

				String path = "";
				if (allServiceList != null) {
					path = getPath(action.getServiceCode(), allServiceList);
				}

				if (path != "") {
					path = path + "." + action.getName();
					String[] output = path.split("\\.");

					for (Module mod : allServiceList) {

						if (mod.getName().equals(output[0]) && mod.getParentModule() != null) {

							path = "";
						}
					}

				}
				action.setPath(path);

				actionList.add(action);
			}
		}

		return actionList;
	}
	

public List<Action> getAllMDMSActions(ActionRequest actionRequest) throws JSONException, UnsupportedEncodingException {
		
		
		
		String res = "";
		String actionres = "";
		Boolean enabled = true;
		String tenantid = "";
		String actFilter = actionFilter;
		String rFilter = roleFilter;
		String actSearchFilter = actionSearchFilter;
		List<Action> actionList = new ArrayList<Action>();
		List<String> rolecodes = actionRequest.getRoleCodes();
		StringBuffer rolecodelist = new StringBuffer();
		
		for(int i=0;i<rolecodes.size();i++) {
			rolecodelist.append("'");
			rolecodelist.append(rolecodes.get(i));
			rolecodelist.append("'");
			if(i != rolecodes.size()-1)
				rolecodelist.append(",");
			
		}
		if(actionRequest.getTenantId() != null){
		       tenantid = actionRequest.getTenantId();
		}
				if(actionRequest.getEnabled() != null){
				enabled = actionRequest.getEnabled();
				
				}
		
		
		rFilter = rFilter.replaceAll("\\$rolecode", rolecodelist.toString());
		MdmsCriteriaReq mcq = getRoleActionMDMSCriteria(actionRequest, rFilter);
		
		try {
		res = restTemplate.postForObject(url, mcq, String.class);
		} catch(Exception e){
			e.printStackTrace();
		}

		Object jsonObject = JsonPath.read(res,roleActionPath);
		JSONArray mdmsArray = new JSONArray(jsonObject.toString());
		StringBuffer actionids = new StringBuffer();
		for (int i = 0; i < mdmsArray.length(); i++) {
			
			actionids.append(mdmsArray.getJSONObject(i).getInt("actionid"));
			
			if(i != mdmsArray.length()-1)
				actionids.append(",");
			
		}
		actFilter = actFilter.replaceAll("\\$actionid", actionids.toString());
		actSearchFilter = actSearchFilter.replaceAll("\\$actionid", actionids.toString());
		actFilter = actFilter.replaceAll("\\$enabled", enabled.toString());
		

		
		 MdmsCriteriaReq actionmcq = new MdmsCriteriaReq();
			List<MasterDetail> actionmasterDetails = new ArrayList<MasterDetail>();
			List<ModuleDetail> actionmoduleDetail = new ArrayList<ModuleDetail>();
			actionmcq.setRequestInfo(getRInfo());
			MdmsCriteria actionmc = new MdmsCriteria();
			 if(tenantid.contains(".")){
				 String[] stateid = tenantid.split("\\.");
				 actionmc.setTenantId(stateid[0]);
				 
			 } else {
				 actionmc.setTenantId(tenantid);
				 
			 }
			 if(actionRequest.getEnabled() != null){
			getMdmsActionCriteria(actionRequest, actFilter, actionmcq, actionmasterDetails, actionmoduleDetail,
					actionmc);
			 } else {
				 getMdmsActionCriteria(actionRequest, actSearchFilter, actionmcq, actionmasterDetails, actionmoduleDetail,
							actionmc); 
			 }
		
		actionres = restTemplate.postForObject(url, actionmcq,String.class);
		String jsonpath = "";
		if(actionRequest.getActionMaster() != null){
			jsonpath = actionTestPath + actionRequest.getActionMaster();
		} else{
		jsonpath = actionPath;
		}
		
		
		Object action  = JsonPath.read(actionres,jsonpath);
		
		JSONArray actionsArray = new JSONArray();
		actionsArray = new JSONArray(action.toString());
		actionList = convertToAction(actionRequest,actionsArray);
		return actionList;
	}

private MdmsCriteriaReq getRoleActionMDMSCriteria(ActionRequest actionRequest, String roleFilter) {
	MdmsCriteriaReq mcq = new MdmsCriteriaReq();
	List<MasterDetail> masterDetails = new ArrayList<MasterDetail>();
	List<ModuleDetail> moduleDetail = new ArrayList<ModuleDetail>();
	mcq.setRequestInfo(getRInfo());
	MdmsCriteria mc = new MdmsCriteria();
	mc.setTenantId(actionRequest.getTenantId());
	ModuleDetail md = new ModuleDetail();
	md.setModuleName(roleActionModule);
	MasterDetail masterDetail = new MasterDetail();
	masterDetail.setName(roleActionMaster);
	masterDetail.setFilter(roleFilter);
	masterDetails.add(masterDetail);
	md.setMasterDetails(masterDetails);
	moduleDetail.add(md);
	mc.setModuleDetails(moduleDetail);
	mcq.setMdmsCriteria(mc);
	return mcq;
}

private void getMdmsActionCriteria(ActionRequest actionRequest, String actionFilter, MdmsCriteriaReq actionmcq,
		List<MasterDetail> actionmasterDetails, List<ModuleDetail> actionmoduleDetail, MdmsCriteria actionmc) {
	ModuleDetail actionmd = new ModuleDetail();
	
	
	MasterDetail actionmasterDetail = new MasterDetail();
	if(actionRequest.getActionMaster() != null){
		actionmd.setModuleName(actionTestModule);
		actionmasterDetail.setName(actionRequest.getActionMaster()); 
	} else {
		actionmd.setModuleName(actionModule);
		actionmasterDetail.setName(actionMaster);
	}
	
	actionmasterDetail.setFilter(actionFilter);
	actionmasterDetails.add(actionmasterDetail);
	actionmd.setMasterDetails(actionmasterDetails);
	actionmoduleDetail.add(actionmd);
	actionmc.setModuleDetails(actionmoduleDetail);
	actionmcq.setMdmsCriteria(actionmc);
}

private List<Action> convertToAction(ActionRequest actionRequest,JSONArray actionsArray)
		throws JSONException {
	List<Action> actionList = new ArrayList<Action>();
	for (int i = 0; i < actionsArray.length(); i++) {
		Action act = new Action();
		if(actionsArray.getJSONObject(i).has("displayName")){
		act.setDisplayName(actionsArray.getJSONObject(i).getString("displayName"));
		} else {act.setDisplayName("");}
		if(actionsArray.getJSONObject(i).has("url")){
		act.setUrl(actionsArray.getJSONObject(i).getString("url"));
		} else {act.setUrl("");}
		if(actionsArray.getJSONObject(i).has("enabled")){
		act.setEnabled(actionsArray.getJSONObject(i).getBoolean("enabled"));
		} else {act.setEnabled(false);}
		if(actionsArray.getJSONObject(i).has("id")){
		act.setId(actionsArray.getJSONObject(i).getLong("id"));
		} else {act.setId(new Long(0));}
		if(actionsArray.getJSONObject(i).has("name")){
		act.setName(actionsArray.getJSONObject(i).getString("name"));
		} else {act.setName("");}
		if(actionsArray.getJSONObject(i).has("orderNumber")){
		act.setOrderNumber(actionsArray.getJSONObject(i).getInt("orderNumber"));
		} else {act.setOrderNumber(0);}
		if(actionsArray.getJSONObject(i).has("parentModule")){
		act.setParentModule(actionsArray.getJSONObject(i).get("parentModule").toString());
		} else {act.setParentModule("");}
		if(actionsArray.getJSONObject(i).has("path")){
		act.setPath(actionsArray.getJSONObject(i).getString("path"));
		} else {act.setPath("");}
		if(actionsArray.getJSONObject(i).has("queryParams")){
		act.setQueryParams(actionsArray.getJSONObject(i).get("queryParams").toString());
		} else {act.setQueryParams("");}
		if(actionsArray.getJSONObject(i).has("serviceCode")){
		act.setServiceCode(actionsArray.getJSONObject(i).getString("serviceCode"));
		} else {act.setServiceCode("");}
		
		if(actionsArray.getJSONObject(i).has("navigationURL")){
		act.setNavigationURL(actionsArray.getJSONObject(i).getString("navigationURL"));
		} else {act.setNavigationURL("");}
		if(actionsArray.getJSONObject(i).has("leftIcon")){
		act.setLeftIcon(actionsArray.getJSONObject(i).getString("leftIcon"));
		} else {act.setLeftIcon("");}
		if(actionsArray.getJSONObject(i).has("rightIcon")){
		act.setRightIcon(actionsArray.getJSONObject(i).getString("rightIcon"));
		} else {act.setRightIcon("");}
		
		act.setTenantId(actionRequest.getTenantId());
		actionList.add(act);
	}
 
	 return actionList;
}
    
	public static RequestInfo getRInfo()
	{
		// TODO Auto-generated method stub
				RequestInfo ri = new RequestInfo();
				ri.setAction("action");
				ri.setAuthToken("a487e887-cafd-41cf-bb8a-2245acbb6c01");
				/*ri.setTs(new Date());*/
				ri.setApiId("apiId");
				ri.setVer("version");
				ri.setDid("did");
				ri.setKey("key");
				ri.setMsgId("msgId");
				ri.setRequesterId("requestId");
		return ri;
	}
	
	private String getPath(String serviceCode, List<Module> modules) {

		String path = "";

		for (Module module : modules) {

			if (serviceCode.equals(module.getCode())) {

				if (module.getParentModule() == null || module.getParentModule().isEmpty()) {

					path = module.getName();
					return path;

				} else if (module.getParentModule() != null && module.getParentModule() != "") {

					path = module.getName();

					path = getCompletePath(module, path, modules);

				}

			}
		}

		return path;
	}

	private String getCompletePath(Module module, String path, List<Module> modules) {

		if (modules.size() > 0) {

			for (Module loopmodule : modules) {

				if ((loopmodule.getParentModule() == null || loopmodule.getParentModule() == "")
						&& module.getParentModule() != null
						&& module.getParentModule().equals(loopmodule.getId().toString())) {

					path = loopmodule.getName() + "." + path;
					return path;

				} else {
					if (loopmodule.getParentModule() != null && loopmodule.getParentModule() != ""
							&& module.getParentModule().equals(loopmodule.getId().toString())) {

						String path1 = "";
						path = loopmodule.getName() + "." + path;

						String path2 = getCompletePath(loopmodule, path1, modules);

						if (path2 != "") {
							path = path2 + path;

						}
					}
				}

			}
		}
		return path;
	}

}
