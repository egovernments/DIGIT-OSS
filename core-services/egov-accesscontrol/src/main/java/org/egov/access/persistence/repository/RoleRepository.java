package org.egov.access.persistence.repository;

import java.io.UnsupportedEncodingException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.egov.access.domain.model.Role;
import org.egov.access.persistence.repository.querybuilder.RoleQueryBuilder;
import org.egov.access.web.contract.role.RoleRequest;
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

import com.jayway.jsonpath.JsonPath;



@Repository
public class RoleRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(RoleRepository.class);

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Value("${mdms.roles.filter}")
	private String roleFilter;
	@Value("${egov.mdms.host}${egov.mdms.path}")
	private String url;
	@Value("${mdms.role.path}")
	private String rolePath;
	@Value("${mdms.rolemodule.name}")
    private String moduleName;
	@Value("${mdms.rolemaster.name}")
	private String rolesMaster;
	
	@Autowired
	private RestTemplate restTemplate;
	
	public List<Role> createRole(final RoleRequest roleRequest) {

		LOGGER.info("Create Role Repository::" + roleRequest);
		final String roleInsert = RoleQueryBuilder.insertRoleQuery();

		List<Role> roles = roleRequest.getRoles();

		List<Map<String, Object>> batchValues = new ArrayList<>(roles.size());
		for (Role role : roles) {
			batchValues.add(new MapSqlParameterSource("name", role.getName()).addValue("code", role.getCode())
					.addValue("description", role.getDescription())
					.addValue("createdby", Long.valueOf(roleRequest.getRequestInfo().getUserInfo().getId()))
					.addValue("createddate", new Date(new java.util.Date().getTime()))
					.addValue("lastmodifiedby", Long.valueOf(roleRequest.getRequestInfo().getUserInfo().getId()))
					.addValue("lastmodifieddate", new Date(new java.util.Date().getTime())).getValues());
		}

		namedParameterJdbcTemplate.batchUpdate(roleInsert, batchValues.toArray(new Map[roles.size()]));

		return roles;

	}

	public List<Role> updateRole(final RoleRequest roleRequest) {

		LOGGER.info("update Role Repository::" + roleRequest);
		final String roleUpdate = RoleQueryBuilder.updateRoleQuery();

		List<Role> roles = roleRequest.getRoles();

		List<Map<String, Object>> batchValues = new ArrayList<>(roles.size());

		for (Role role : roles) {
			batchValues.add(new MapSqlParameterSource("name", role.getName()).addValue("code", role.getCode())
					.addValue("description", role.getDescription())
					.addValue("lastmodifiedby", Long.valueOf(roleRequest.getRequestInfo().getUserInfo().getId()))
					.addValue("lastmodifieddate", new Date(new java.util.Date().getTime())).getValues());
		}

		namedParameterJdbcTemplate.batchUpdate(roleUpdate, batchValues.toArray(new Map[roles.size()]));

		return roles;
	}

	public boolean checkRoleNameDuplicationValidationErrors(String roleName) {

		final String query = RoleQueryBuilder.checkRoleNameDuplicationValidationErrors();

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("name", roleName);
		SqlRowSet sqlRowSet = namedParameterJdbcTemplate.queryForRowSet(query, parametersMap);

		if (sqlRowSet != null && sqlRowSet.next() && sqlRowSet.getString("code") != null
				&& sqlRowSet.getString("code") != "") {

			return true;
		}

		return false;
	}
public List<Role> getAllMDMSRoles(RoleSearchCriteria roleSearchCriteria) throws JSONException, UnsupportedEncodingException {
		String res = "";
		String rFilter = roleFilter;
		List<Role> roleList = new ArrayList<Role>();
		List<String> rolecodes = roleSearchCriteria.getCodes();
		StringBuffer rolecodelist = new StringBuffer();
		
		for(int i=0;i<rolecodes.size();i++) {
			rolecodelist.append("'");
			rolecodelist.append(rolecodes.get(i));
			rolecodelist.append("'");
			if(i != rolecodes.size()-1)
				rolecodelist.append(",");
		}
		rFilter = rFilter.replaceAll("\\$code", rolecodelist.toString());
		MdmsCriteriaReq mcq = getRoleMDMSCriteria(roleSearchCriteria, rFilter);
		LOGGER.info("Role Filter: "+rFilter.toString());
		LOGGER.info("The URL is: "+ url);
		
		try {
		res = restTemplate.postForObject(url, mcq, String.class);
		} catch(Exception e){
			LOGGER.error("Error while fetching roles from MDMS: " + e.getMessage());
		}

		Object jsonObject = JsonPath.read(res,rolePath);
		JSONArray mdmsArray = new JSONArray(jsonObject.toString());
		LOGGER.info("Role  from MDMS: "+jsonObject.toString());
		
		
		roleList = convertToRole(mdmsArray);
		return roleList;
	}

private MdmsCriteriaReq getRoleMDMSCriteria(RoleSearchCriteria roleSearchCriteria,String roleFilter) {
	String mName = "";
	
	mName = moduleName;
	String tenantId = "";
	tenantId = roleSearchCriteria.getTenantId();
	LOGGER.info("Tenant id from repository: "+tenantId);
	MdmsCriteriaReq mcq = new MdmsCriteriaReq();
	List<MasterDetail> masterDetails = new ArrayList<MasterDetail>();
	List<ModuleDetail> moduleDetail = new ArrayList<ModuleDetail>();
	mcq.setRequestInfo(getRInfo());
	MdmsCriteria mc = new MdmsCriteria();
	if(tenantId.contains(".")){
		 String[] stateid = tenantId.split("\\.");
		 LOGGER.info("State IDs are :"+stateid);
		 mc.setTenantId(stateid[0]);
		 
	 } else {
		 mc.setTenantId(tenantId);
		 
	 }
	ModuleDetail md = new ModuleDetail();
	md.setModuleName(mName);
	MasterDetail masterDetail = new MasterDetail();
	masterDetail.setName(rolesMaster);
	if(roleSearchCriteria.getCodes().size() > 0){
	masterDetail.setFilter(roleFilter);
	}
	masterDetails.add(masterDetail);
	md.setMasterDetails(masterDetails);
	moduleDetail.add(md);
	mc.setModuleDetails(moduleDetail);
	mcq.setMdmsCriteria(mc);
	return mcq;
}



private List<Role> convertToRole(JSONArray roleArray)
		throws JSONException {
	List<Role> roleList = new ArrayList<Role>();
	for (int i = 0; i < roleArray.length(); i++) {
		Role role = new Role();
		if(roleArray.getJSONObject(i).has("code")){
			role.setCode(roleArray.getJSONObject(i).getString("code"));
		} else {role.setCode("");}
		if(roleArray.getJSONObject(i).has("name")){
		role.setName(roleArray.getJSONObject(i).getString("name"));
		} else {role.setName("");}
		if(roleArray.getJSONObject(i).has("description")){
		role.setDescription(roleArray.getJSONObject(i).getString("description"));
		} else {role.setDescription("");}
		roleList.add(role);
	}
 
	 return roleList;
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

	

}
