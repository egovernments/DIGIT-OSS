package com.tarento.analytics.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URI;
import java.util.*;

import com.tarento.analytics.constant.Constants;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.dto.Tenants;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.service.MetadataService;

@Service("metadataService")
public class MetadataServiceImpl implements MetadataService {

	public static final Logger logger = LoggerFactory.getLogger(MetadataServiceImpl.class);

	 @Autowired
	 private ConfigurationLoader configurationLoader;
	 
	 @Autowired
	 private ObjectMapper objectMapper;
	 
	 @Autowired
	 private RestTemplate restTemplate;
	 
	@Value("${egov.mdms.host}")
    private String mdmsServiceHost;
    
    @Value("${egov.mdms.search.endpoint}")
    private String mdmsSearchEndpoint;

	@Override
	public ArrayNode getDashboardConfiguration(String dashboardId, String catagory, List<RoleDto> roleIds) throws AINException, IOException {

		Calendar cal = Calendar.getInstance();
		cal.set(cal.getWeekYear()-1, Calendar.APRIL, 1);
		Date startDate = cal.getTime();
		Date endDate = new Date();

		String fyInfo = "From " + Constants.DASHBOARD_DATE_FORMAT.format(startDate) + " to " + Constants.DASHBOARD_DATE_FORMAT.format(endDate);


		ObjectNode dashBoardNode = configurationLoader.get(ConfigurationLoader.MASTER_DASHBOARD_CONFIG);
		ArrayNode dasboardNodes = (ArrayNode) dashBoardNode.findValue(Constants.DashBoardConfig.DASHBOARDS);

		ObjectNode roleMappingNode = configurationLoader.get(ConfigurationLoader.ROLE_DASHBOARD_CONFIG);
		ArrayNode rolesArray = (ArrayNode) roleMappingNode.findValue(Constants.DashBoardConfig.ROLES);
		ArrayNode dbArray = JsonNodeFactory.instance.arrayNode();
		for(JsonNode role: rolesArray){
			logger.info("role name: " + role.get("roleName"));
			logger.info("role ID: " + role.get("roleId"));
			String roleId = role.get("roleId").asText();

			//Object roleId = roleIds.stream().filter(x -> role.get(Constants.DashBoardConfig.ROLE_ID).asLong() == (x.getId())).findAny().orElse(null);
			if (null != roleId) {
				ArrayNode visArray = JsonNodeFactory.instance.arrayNode();
				for(JsonNode db : role.get(Constants.DashBoardConfig.DASHBOARDS)){
					ObjectNode copyDashboard = objectMapper.createObjectNode();

					JsonNode name = JsonNodeFactory.instance.textNode("");
					JsonNode id = JsonNodeFactory.instance.textNode("");
					JsonNode title = JsonNodeFactory.instance.textNode(fyInfo);
					if (db.get(Constants.DashBoardConfig.ID).asText().equalsIgnoreCase(dashboardId)) {
						//dasboardNodes.forEach(dbNode -> {
						for(JsonNode dbNode : dasboardNodes){
							if (dbNode.get(Constants.DashBoardConfig.ID).asText().equalsIgnoreCase(dashboardId)) {
								logger.info("dbNode: " + dbNode);
								name = dbNode.get(Constants.DashBoardConfig.NAME);
								id = dbNode.get(Constants.DashBoardConfig.ID);

								if (catagory != null) {
									dbNode.get(Constants.DashBoardConfig.VISUALISATIONS).forEach(visual -> {
										if (visual.get(Constants.DashBoardConfig.NAME).asText().equalsIgnoreCase(catagory))
											visArray.add(visual);
									});
								} else {
									dbNode.get(Constants.DashBoardConfig.VISUALISATIONS).forEach(visual -> {
										visArray.add(visual);
									});
								}
							}
							copyDashboard.set(Constants.DashBoardConfig.NAME, name);
							copyDashboard.set(Constants.DashBoardConfig.ID, id);
							//add TITLE with varible dynamically
							copyDashboard.set(Constants.DashBoardConfig.TITLE, title);

							copyDashboard.set(Constants.DashBoardConfig.VISUALISATIONS, visArray);
							copyDashboard.set("roleId", role.get("roleId"));
							copyDashboard.set("roleName", role.get("roleName"));

						}//);
						dbArray.add(copyDashboard);
					}
				}

			}
		}

		return dbArray;
	}

/*	@Override
	public ArrayNode getDashboardConfiguration(String dashboardId, String catagory, List<RoleDto> roleIds) throws AINException, IOException {

		ObjectNode configNode = configurationLoader.get(ConfigurationLoader.ROLE_DASHBOARD_CONFIG);
		ArrayNode rolesArray = (ArrayNode) configNode.findValue("roles");
		ArrayNode dbArray = JsonNodeFactory.instance.arrayNode();

		rolesArray.forEach(role -> {
			Object roleId = roleIds.stream().filter(x -> role.get("roleId").asLong() == (x.getId())).findAny().orElse(null);
			System.out.println("roleId = "+roleId);

			if (null != roleId) {
				role.get("dashboards").forEach(dashboard -> {
					ObjectNode copyDashboard = dashboard.deepCopy();
					ArrayNode visArray = JsonNodeFactory.instance.arrayNode();
					if(catagory != null) {
						copyDashboard.get("visualizations").forEach(visual ->{
							if(visual.get("name").asText().equalsIgnoreCase(catagory)){
								visArray.add(visual);
							}
						});
						copyDashboard.set("visualizations", visArray);
					}
					if(dashboard.get("id").asText().equalsIgnoreCase(dashboardId)){
						dbArray.add(copyDashboard);
					}
				});
			}
		});

		//List<Dashboard> dbs = objectMapper.readValue(dbArray.toString(), new TypeReference<List<Dashboard>>() {});
		return dbArray;
	}*/

	public JSONArray getTargetDistrict() throws Exception {
		final String baseUrl = mdmsServiceHost + mdmsSearchEndpoint;
		URI uri = new URI(baseUrl);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<String> requestEntity = new HttpEntity<>("{}", headers);
		ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, requestEntity, String.class);
		String targetdistrict = response.getBody();
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = objectMapper.readTree(targetdistrict);
		ArrayNode array = (ArrayNode) jsonNode.at("/MdmsRes/tenant/tenants");

		File getFile = new File(
				System.getProperty("user.dir") + System.getProperty("file.separator") + "data/tenants.json");
		BufferedReader br = null;
		Tenants sample = null;
		try{
			br = new BufferedReader(new FileReader(getFile));
			sample = new Gson().fromJson(br, Tenants.class);
		}catch (Exception e){
			logger.info("Error occured while reading tenants file.");
		}finally{
			br.close();
		}
		JSONArray jsonArray = new JSONArray();
		Map<String, List<Object>> mapDistrictUlb = new HashMap();
		Map<String, Object> DistrictMap = new HashMap();
		for (int i = 0; i < sample.getTenants().size(); i++) {
			String ulbCode = sample.getTenants().get(i).getCode();
			String ulbName = sample.getTenants().get(i).getName();
			String districtName = sample.getTenants().get(i).getCity().getDistrictName();
			String districtCode = sample.getTenants().get(i).getCity().getDistrictCode();
			Map<String, Object> mapUlb = new HashMap();
			Map<String, Object> mapDist = new LinkedHashMap();
			Map<String, Object> mapDistAll = new LinkedHashMap();
			mapDist.put("District Name", districtName);
			mapDist.put("District Code", districtCode);
			mapUlb.put("Ulb Name", ulbName);
			mapUlb.put("tenantId", ulbCode);
			mapDistAll.put(districtCode, new JSONObject(mapDist));
			DistrictMap.put(districtCode.toString(), mapDist);
			if (mapDistrictUlb.containsKey(districtCode.toString())) {
				mapDistrictUlb.get(districtCode.toString()).add(mapUlb);
			} else {
				List<Object> lst = new ArrayList();
				lst.add(mapUlb);
				mapDistrictUlb.put(districtCode.toString(), lst);
			}
		}
		for (Map.Entry<String, Object> entry1 : DistrictMap.entrySet()) {
			JSONObject getdistrictJson = new JSONObject();
			for (Map.Entry<String, List<Object>> entry2 : mapDistrictUlb.entrySet()) {
				if (entry1.getKey().equals(entry2.getKey())) {
					JSONObject getUlbtoDistrict = new JSONObject();
					getdistrictJson.put(entry1.getKey(), entry1.getValue());
					String json = new Gson().toJson(entry1.getValue(), LinkedHashMap.class);
					getUlbtoDistrict.put(entry1.getKey(), new JSONObject(json).accumulate("Ulb", entry2.getValue()));
					jsonArray.put(getUlbtoDistrict);
				}
			}
		}
		return jsonArray;
	}

}
